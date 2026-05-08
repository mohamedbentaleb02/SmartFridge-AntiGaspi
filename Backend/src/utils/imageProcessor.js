const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const axios = require('axios');

class ImageProcessor {
  constructor() {
    this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
  }

  async processReceipt(imageBuffer) {
    try {
      const processedImage = await this.preprocessImage(imageBuffer);
      const { data: { text } } = await Tesseract.recognize(
        processedImage,
        'fra',
        {
          logger: m => console.log(m)
        }
      );
      
      return this.parseReceiptText(text);
    } catch (error) {
      throw new Error(`Erreur lors du traitement du ticket: ${error.message}`);
    }
  }

  async preprocessImage(imageBuffer) {
    try {
      return await sharp(imageBuffer)
        .resize(2000, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .sharpen()
        .normalize()
        .threshold(128)
        .png()
        .toBuffer();
    } catch (error) {
      throw new Error(`Erreur lors du prétraitement de l'image: ${error.message}`);
    }
  }

  parseReceiptText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const items = [];
    let currentDate = new Date();
    let totalAmount = 0;

    for (const line of lines) {
      const productMatch = line.match(/(.+?)\s+([\d,]+)\s*[€$]?[\s]*(\d+)?\s*([kg%l])?/i);
      
      if (productMatch) {
        const [, name, price, quantity, unit] = productMatch;
        items.push({
          name: name.trim(),
          price: parseFloat(price.replace(',', '.')),
          quantity: quantity ? parseInt(quantity) : 1,
          unit: unit || 'piece'
        });
      }

      const dateMatch = line.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{2,4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        currentDate = new Date(`${year.length === 2 ? '20' + year : year}-${month}-${day}`);
      }

      const totalMatch = line.match(/total[:\s]*([\d,]+)\s*[€$]?/i);
      if (totalMatch) {
        totalAmount = parseFloat(totalMatch[1].replace(',', '.'));
      }
    }

    return {
      items,
      date: currentDate,
      total: totalAmount,
      rawText: text
    };
  }

  async recognizeProduct(imageBuffer) {
    try {
      const processedImage = await this.preprocessImage(imageBuffer);
      const { data: { text } } = await Tesseract.recognize(
        processedImage,
        'fra+eng',
        {
          logger: m => console.log(m)
        }
      );

      return this.extractProductInfo(text);
    } catch (error) {
      throw new Error(`Erreur lors de la reconnaissance du produit: ${error.message}`);
    }
  }

  extractProductInfo(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const productInfo = {
      name: '',
      brand: '',
      barcode: null,
      ingredients: [],
      nutrition: {},
      expiryDate: null
    };

    for (const line of lines) {
      const barcodeMatch = line.match(/(\d{8,13})/);
      if (barcodeMatch && !productInfo.barcode) {
        productInfo.barcode = barcodeMatch[1];
      }

      const dateMatch = line.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{2,4})/);
      if (dateMatch && !productInfo.expiryDate) {
        const [, day, month, year] = dateMatch;
        productInfo.expiryDate = new Date(`${year.length === 2 ? '20' + year : year}-${month}-${day}`);
      }

      if (!productInfo.name && line.length > 3 && !line.match(/^\d+$/)) {
        productInfo.name = line.trim();
      }

      const nutritionMatch = line.match(/(\w+)\s*:\s*(\d+)\s*(g|mg|kcal|kj)/i);
      if (nutritionMatch) {
        const [, nutrient, amount, unit] = nutritionMatch;
        productInfo.nutrition[nutrient.toLowerCase()] = { amount, unit };
      }
    }

    return productInfo;
  }

  async validateImage(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      
      if (!this.supportedFormats.includes(metadata.format)) {
        throw new Error(`Format non supporté: ${metadata.format}`);
      }

      if (metadata.width < 100 || metadata.height < 100) {
        throw new Error('Image trop petite (minimum 100x100 pixels)');
      }

      if (imageBuffer.length > 10 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (maximum 10MB)');
      }

      return true;
    } catch (error) {
      throw new Error(`Validation de l'image échouée: ${error.message}`);
    }
  }
}

module.exports = new ImageProcessor();
