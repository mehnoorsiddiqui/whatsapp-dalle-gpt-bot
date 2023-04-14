class User {
    constructor(number, model = 'chatgpt', language = 'en') {
        this._number = number;
        this._model = model;
        this._language = language;
    }

    getNumber() {
        return this._number;
    }
    getModel() {
        return this._model;
    }    
    setModel(model) {
        this._model = model;
    }
    getLanguage() {
        return this._language;
    }    

    setLanguage(language) {
        this._language = language;
    }
}
  
module.exports = User;
