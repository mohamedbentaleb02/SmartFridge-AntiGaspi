const cron = require('node-cron');
const FridgeItem = require('../models/FridgeItem');
const User = require('../models/User');
const CommunityShare = require('../models/CommunityShare');

class NotificationService {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    cron.schedule('0 9 * * *', async () => {
      await this.sendDailyExpiryAlerts();
    });

    cron.schedule('0 18 * * *', async () => {
      await this.sendEveningReminders();
    });

    cron.schedule('0 */6 * * *', async () => {
      await this.updateExpiringItems();
    });

    console.log('Service de notifications démarré');
  }

  async sendDailyExpiryAlerts() {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const expiringItems = await FridgeItem.find({
        expiryDate: { $lte: threeDaysFromNow, $gte: new Date() },
        status: { $ne: 'expired' }
      }).populate('user product');

      const userNotifications = new Map();

      expiringItems.forEach(item => {
        const userId = item.user._id.toString();
        if (!userNotifications.has(userId)) {
          userNotifications.set(userId, {
            user: item.user,
            items: []
          });
        }
        userNotifications.get(userId).items.push(item);
      });

      for (const [userId, notification] of userNotifications) {
        if (notification.user.notifications.expiryAlerts) {
          await this.sendNotification(notification.user, {
            type: 'expiry_alert',
            title: 'Produits expirant bientôt',
            message: `Vous avez ${notification.items.length} produit(s) qui expirera dans les 3 prochains jours`,
            data: {
              items: notification.items.map(item => ({
                productName: item.product.name,
                expiryDate: item.expiryDate,
                daysUntilExpiry: Math.ceil((item.expiryDate - new Date()) / (1000 * 60 * 60 * 24))
              }))
            }
          });
        }
      }

      console.log(`Alertes d'expiration envoyées à ${userNotifications.size} utilisateurs`);
    } catch (error) {
      console.error('Erreur envoi alertes expiration:', error);
    }
  }

  async sendEveningReminders() {
    try {
      const urgentShares = await CommunityShare.findUrgent();
      
      const nearbyUsers = await User.find({
        'notifications.emailNotifications': true,
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [2.3522, 48.8566] },
            $maxDistance: 50000
          }
        }
      });

      for (const user of nearbyUsers) {
        await this.sendNotification(user, {
          type: 'community_urgent',
          title: 'Partages urgents près de chez vous',
          message: `${urgentShares.length} partage(s) urgent(s) disponible(s) dans votre région`,
          data: {
            shares: urgentShares.slice(0, 3).map(share => ({
              id: share._id,
              items: share.items.length,
              location: share.location.address.city
            }))
          }
        });
      }

      console.log(`Rappels communautaires envoyés à ${nearbyUsers.length} utilisateurs`);
    } catch (error) {
      console.error('Erreur rappels communautaires:', error);
    }
  }

  async updateExpiringItems() {
    try {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      await FridgeItem.updateMany(
        {
          expiryDate: { $lt: now },
          status: { $ne: 'expired' }
        },
        { status: 'expired' }
      );

      await FridgeItem.updateMany(
        {
          expiryDate: { $gte: now, $lte: threeDaysFromNow },
          status: 'fresh'
        },
        { status: 'expiring-soon' }
      );

      await FridgeItem.updateMany(
        {
          expiryDate: { $gt: threeDaysFromNow },
          status: 'expiring-soon'
        },
        { status: 'fresh' }
      );

      await CommunityShare.updateMany(
        {
          'availabilityWindow.end': { $lt: now },
          status: 'available'
        },
        { status: 'expired' }
      );

      console.log('Statuts des items mis à jour');
    } catch (error) {
      console.error('Erreur mise à jour statuts:', error);
    }
  }

  async sendNotification(user, notification) {
    try {
      if (process.env.NODE_ENV === 'production' && user.fcmToken) {
        await this.sendPushNotification(user, notification);
      }

      if (user.notifications.emailNotifications) {
        await this.sendEmailNotification(user, notification);
      }

      console.log(`Notification envoyée à ${user.email}: ${notification.title}`);
    } catch (error) {
      console.error(`Erreur notification pour ${user.email}:`, error);
    }
  }

  async sendPushNotification(user, notification) {
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.log('Push notification désactivée (Firebase non configuré)');
      return;
    }

    try {
      const admin = require('firebase-admin');
      
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          })
        });
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          data: JSON.stringify(notification.data || {})
        },
        token: user.fcmToken
      };

      await admin.messaging().send(message);
    } catch (error) {
      console.error('Erreur push notification:', error);
    }
  }

  async sendEmailNotification(user, notification) {
    console.log(`Email notification pour ${user.email}: ${notification.title}`);
  }

  async sendCustomNotification(userId, notification) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      await this.sendNotification(user, notification);
    } catch (error) {
      console.error('Erreur notification personnalisée:', error);
    }
  }

  async sendLowStockAlert(userId, productName, currentQuantity) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.notifications.lowStockAlerts) return;

      await this.sendNotification(user, {
        type: 'low_stock',
        title: 'Stock faible',
        message: `Votre stock de ${productName} est faible (${currentQuantity} restant)`,
        data: {
          productName,
          currentQuantity
        }
      });
    } catch (error) {
      console.error('Erreur alerte stock faible:', error);
    }
  }

  async sendShareReservedNotification(donorId, shareId, recipientName) {
    try {
      const donor = await User.findById(donorId);
      if (!donor) return;

      await this.sendNotification(donor, {
        type: 'share_reserved',
        title: 'Votre partage a été réservé',
        message: `${recipientName} a réservé votre partage`,
        data: {
          shareId,
          recipientName
        }
      });
    } catch (error) {
      console.error('Erreur notification réservation:', error);
    }
  }

  async sendShareCollectedNotification(recipientId, donorName) {
    try {
      const recipient = await User.findById(recipientId);
      if (!recipient) return;

      await this.sendNotification(recipient, {
        type: 'share_collected',
        title: 'Collecte confirmée',
        message: `Votre collecte auprès de ${donorName} a été confirmée`,
        data: {
          donorName
        }
      });
    } catch (error) {
      console.error('Erreur notification collecte:', error);
    }
  }
}

module.exports = new NotificationService();
