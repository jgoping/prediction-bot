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
};

module.exports = {
  state: State
};
