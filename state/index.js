class State {
  constructor() {
    this.open = false;
    this.yes = [];
    this.no = [];
  }

  openPredictions() {
    this.open = true;
  }
};

module.exports = {
  state: State
};
