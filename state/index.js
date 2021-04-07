const validOutcomes = ['yes', 'no'];

class State {
  constructor() {
    this.open = false;
    this.yes = new Map();
    this.no = new Map();
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

    const otherOutcome = validOutcomes[(validOutcomes.indexOf(outcome) + 1) % 2];

    if (this[otherOutcome].has(id)) {
      throw new Error(`you cannot vote on ${outcome} as you have already voted on ${otherOutcome}.`);
    }

    const newAmount = this[outcome].has(id) ? this[outcome].get(id).amount + amount : amount;

    this[outcome].set(id, {id, amount: newAmount});
  }

  getPredictions(outcome) {
    if (outcome && !validOutcomes.includes(outcome)) {
      throw new Error('please specify yes or no as an outcome.');
    }

    if (outcome) {
      return this[outcome].values();
    }

    return [...this.yes.values(), ...this.no.values()];
  }

  clearPredictions() {
    this.yes.clear();
    this.no.clear();
  }
};

module.exports = {
  state: State
};
