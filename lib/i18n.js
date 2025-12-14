import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class I18n {
  constructor() {
    this.translations = new Map();
    this.defaultLanguage = "en";
    this.currentLanguage = "en";
    this.loadTranslations();
  }

  loadTranslations() {
    const localesDir = path.join(__dirname, "..", "locales");
    
    if (!fs.existsSync(localesDir)) {
      console.warn("Locales directory not found, using default language");
      return;
    }

    const files = fs.readdirSync(localesDir);
    
    for (const file of files) {
      if (file.endsWith(".json")) {
        const lang = path.basename(file, ".json");
        try {
          const content = fs.readFileSync(path.join(localesDir, file), "utf8");
          this.translations.set(lang, JSON.parse(content));
        } catch (error) {
          console.error(`Failed to load translation file ${file}:`, error);
        }
      }
    }
  }

  setLanguage(lang) {
    if (this.translations.has(lang)) {
      this.currentLanguage = lang;
      return true;
    }
    return false;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return Array.from(this.translations.keys());
  }

  // Get translation with dot notation support (e.g., "config.title")
  t(key, params = {}) {
    const translation = this.getNestedValue(
      this.translations.get(this.currentLanguage) || {},
      key
    );

    if (translation === undefined) {
      // Fallback to default language
      const fallback = this.getNestedValue(
        this.translations.get(this.defaultLanguage) || {},
        key
      );
      
      if (fallback === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      
      return this.interpolate(fallback, params);
    }

    return this.interpolate(translation, params);
  }

  getNestedValue(obj, key) {
    return key.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  interpolate(text, params) {
    if (typeof text !== "string") return text;
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }

  // Get all translations for frontend
  getTranslations(lang = this.currentLanguage) {
    return this.translations.get(lang) || {};
  }
}

// Singleton instance
const i18n = new I18n();

export default i18n;