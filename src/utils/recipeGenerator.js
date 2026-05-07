const OpenAI = require('openai');

class RecipeGenerator {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateAntiGaspiRecipes(availableIngredients, dietaryRestrictions = [], preferences = {}) {
    try {
      const systemPrompt = `Tu es un chef expert spécialisé dans la cuisine anti-gaspi. 
      Ta mission est de créer des recettes délicieuses utilisant uniquement les ingrédients disponibles.
      Priorise les ingrédients qui périment bientôt.
      Adapte les recettes aux restrictions alimentaires de l'utilisateur.
      Sois créatif mais réaliste dans tes propositions.`;

      const userPrompt = `Ingrédients disponibles: ${availableIngredients.join(', ')}
      Restrictions alimentaires: ${dietaryRestrictions.join(', ') || 'Aucune'}
      Préférences: ${JSON.stringify(preferences)}
      
      Génère 3 recettes anti-gaspi avec:
      - Titre attractif
      - Temps de préparation et cuisson
      - Ingrédients avec quantités précises
      - Instructions étape par étape
      - Nombre de portions
      - Difficulté
      - Conseils anti-gaspi
      
      Format de réponse JSON:
      {
        "recipes": [
          {
            "title": "Nom de la recette",
            "prepTime": 15,
            "cookTime": 30,
            "servings": 4,
            "difficulty": "facile",
            "ingredients": [
              {"name": "ingrédient", "quantity": 200, "unit": "g"}
            ],
            "instructions": [
              {"step": 1, "instruction": "instruction détaillée"}
            ],
            "antiGaspiTips": ["conseil 1", "conseil 2"],
            "category": "plat principal"
          }
        ]
      }`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Erreur génération recettes:', error);
      throw new Error('Impossible de générer des recettes actuellement');
    }
  }

  async optimizeRecipeForIngredients(recipe, availableIngredients) {
    try {
      const systemPrompt = `Tu es un nutritionniste et chef expert. 
      Optimise cette recette pour n'utiliser que les ingrédients disponibles.
      Sugger des substitutions intelligentes si nécessaire.`;

      const userPrompt = `Recette originale: ${JSON.stringify(recipe)}
      Ingrédients disponibles: ${availableIngredients.join(', ')}
      
      Optimise cette recette en:
      - Remplaçant les ingrédients manquants par des équivalents disponibles
      - Ajustant les quantités proportionnellement
      - Conservant l'équilibre nutritionnel
      - Minimisant le gaspillage
      
      Réponds en JSON avec la recette optimisée.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erreur optimisation recette:', error);
      throw new Error('Impossible d\'optimiser la recette');
    }
  }

  async generateStorageTips(productName, category, expiryDate) {
    try {
      const systemPrompt = `Tu es un expert en conservation alimentaire.
      Fournis des conseils précis pour prolonger la durée de conservation des aliments.`;

      const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      
      const userPrompt = `Produit: ${productName}
      Catégorie: ${category}
      Jours avant péremption: ${daysUntilExpiry}
      
      Génère 5 conseils de conservation spécifiques:
      - Méthode de stockage optimale
      - Température idéale
      - Signes de fraîcheur à surveiller
      - Méthodes de conservation prolongée
      - Idées anti-gaspi si proche de la péremption
      
      Format JSON:
      {
        "storageTips": [
          {
            "category": "stockage",
            "tip": "conseil détaillé",
            "priority": "high|medium|low"
          }
        ]
      }`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erreur génération conseils:', error);
      throw new Error('Impossible de générer des conseils de conservation');
    }
  }

  async calculateNutritionalValue(ingredients) {
    try {
      const systemPrompt = `Tu es un nutritionniste expert.
      Calcule les valeurs nutritionnelles approximatives des ingrédients.`;

      const userPrompt = `Ingrédients avec quantités: ${JSON.stringify(ingredients)}
      
      Calcule pour la recette complète:
      - Calories totales
      - Protéines, glucides, lipides (en grammes)
      - Fibres, sucres, sodium
      - Valeurs par portion
      
      Format JSON:
      {
        "total": {
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "fiber": 0,
          "sugar": 0,
          "sodium": 0
        },
        "perServing": {
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0,
          "fiber": 0,
          "sugar": 0,
          "sodium": 0
        }
      }`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Erreur calcul nutritionnel:', error);
      throw new Error('Impossible de calculer les valeurs nutritionnelles');
    }
  }
}

module.exports = new RecipeGenerator();
