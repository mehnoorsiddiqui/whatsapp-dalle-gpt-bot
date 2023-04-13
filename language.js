class Language {
  constructor() {
    this.language = "en";
  }

  setLanguage(str) {
    this.language = str;
  }

  getLanguage() {
    return this.language;
  }
}

module.exports = Language;
