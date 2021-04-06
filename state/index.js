class State {
  constructor() {
    this.open = false;
    this.yes = [];
    this.no = [];
  }

  openPredictions() {
    this.open = true;
  }

  closePredictions() {
    this.open = false;
  }

  isOpen() {
    return this.open;
  }

  clearPredictions() {
    this.yes = [];
    this.no = [];
  }
};

module.exports = {
  state: State
};
