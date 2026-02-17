const translate = require('google-translate-api-x');

class TranslationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get cache key
  getCacheKey(text, fromLang, toLang) {
    return `${text}_${fromLang}_${toLang}`;
  }

  // Check cache
  getCachedTranslation(text, fromLang, toLang) {
    const key = this.getCacheKey(text, fromLang, toLang);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.translation;
    }
    
    return null;
  }

  // Set cache
  setCachedTranslation(text, fromLang, toLang, translation) {
    const key = this.getCacheKey(text, fromLang, toLang);
    this.cache.set(key, {
      translation,
      timestamp: Date.now()
    });
  }

  // Translate text
  async translateText(text, fromLang = 'auto', toLang = 'en') {
    try {
      // Check cache first
      const cached = this.getCachedTranslation(text, fromLang, toLang);
      if (cached) {
        return cached;
      }

      // If source and target are same, return original
      if (fromLang !== 'auto' && fromLang === toLang) {
        return text;
      }

      // Translate using Google Translate API
      const result = await translate(text, { 
        from: fromLang, 
        to: toLang 
      });

      const translation = result.text;

      // Cache the result
      this.setCachedTranslation(text, fromLang, toLang, translation);

      return translation;

    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Translation failed');
    }
  }

  // Translate message for multiple users
  async translateForUsers(message, users) {
    const translations = [];
    
    for (const user of users) {
      if (user.preferredLanguage !== message.originalLanguage) {
        try {
          const translatedText = await this.translateText(
            message.content,
            message.originalLanguage,
            user.preferredLanguage
          );
          
          translations.push({
            userId: user._id,
            language: user.preferredLanguage,
            text: translatedText
          });
        } catch (error) {
          console.error(`Translation failed for user ${user._id}:`, error);
        }
      }
    }
    
    return translations;
  }

  // Detect language
  async detectLanguage(text) {
    try {
      const result = await translate(text, { to: 'en' });
      return result.from.language.iso;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'bn', name: 'Bengali' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ur', name: 'Urdu' }
    ];
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

module.exports = new TranslationService();
