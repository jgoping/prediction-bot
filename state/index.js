const validOutcomes = ['yes', 'no'];

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

  addPrediction(id, outcome, amount) {
    if (!validOutcomes.includes(outcome)) {
      throw new Error('please specify yes or no as an outcome.');
    }

    this[outcome].push({id, amount});
  }

  clearPredictions() {
    this.yes = [];
    this.no = [];
  }
};

module.exports = {
  state: State
};
