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
};

module.exports = {
  state: State
};
