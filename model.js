class Model {
    constructor() {
      this.model = "chatgpt";
    }
  
    setModel(str) {
      this.model = str;
    }
  
    getModel() {
      return this.model;
    }
  }

module.exports = Model;