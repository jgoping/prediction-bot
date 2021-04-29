const chai = require('chai');
const expect = chai.expect;

const State = require('../../src/state').state;

describe('state class', () => {
  describe('openPredictions() method', () => {
    it('opens the predictions', () => {
      const state = new State();
      state.openPredictions();
  
      expect(state.status).to.eql('open');
    });
  });

  describe('closePreidctions() method', () => {
    it('closes the predictions', () => {
      const state = new State();
      state.closePredictions();
  
      expect(state.status).to.eql('closed');
    });
  });

  describe('isOpen() method', () => {
    it('returns true only if the predictions are open', () => {
      const state = new State();
      expect(state.isOpen()).to.eql(false);

      state.openPredictions();
      expect(state.isOpen()).to.eql(true);

      state.closePredictions();
      expect(state.isOpen()).to.eql(false);
    });
  });

  describe('isLive() method', () => {
    it('returns true only if the predictions are live', () => {
      const state = new State();
      expect(state.isLive()).to.eql(false);

      state.openPredictions();
      expect(state.isLive()).to.eql(true);

      state.closePredictions();
      expect(state.isLive()).to.eql(true);
    });
  });

  describe('addPredictions() method', () => {
    let state;
    
    beforeEach(() => {
      state = new State();

      state.openPredictions();
    });
    
    it('adds new predictions', () => {
      state.addPrediction('123', 'yes', 50);
      state.addPrediction('456', 'no', 100);

      expect(state.yes.get('123')).to.eql({id: '123', amount: 50});
      expect(state.no.get('456')).to.eql({id: '456', amount: 100});
    });

    it('adds to old predictions', () => {
      for (let i=0; i < 3; ++i) {
        state.addPrediction('123', 'yes', 50);
        state.addPrediction('456', 'no', 100);
      }

      expect(state.yes.get('123')).to.eql({id: '123', amount: 150});
      expect(state.no.get('456')).to.eql({id: '456', amount: 300});
    });

    it('prevents a user from predicting on both outcomes', () => {
      state.addPrediction('123', 'yes', 50);
      expect(() => state.addPrediction('123', 'no', 100)).to.throw(Error);
    });

    it('prevents a user from predicting on an invalid outcome', () => {
      expect(() => state.addPrediction('123', 'foo', 50)).to.throw(Error);
    });
  });

  describe('getPredictions() method', () => {
    let state;

    beforeEach(() => {
      state = new State();

      state.openPredictions();
      state.addPrediction('123', 'yes', 50);
      state.addPrediction('456', 'no', 100);
    });

    it('returns the predictions of a specified outcome', () => {
      expect(state.getPredictions('yes').next().value).to.eql({id: '123', amount: 50});
      expect(state.getPredictions('no').next().value).to.eql({id: '456', amount: 100});
    });

    it('returns all the predictions if an outcome is not specified', () => {
      const predictions = state.getPredictions();

      expect(predictions).to.eql([{id: '123', amount: 50}, {id: '456', amount: 100}]);
    });

    it('does not return predictions if the outcome is invalid', () => {
      expect(() => state.getPredictions('foo')).to.throw(Error);
    });
  });

  describe('clearPredictions() method', () => {
    it('clears the predictions', () => {
      const state = new State();

      state.openPredictions();
      state.addPrediction('123', 'yes', 100);
      state.addPrediction('456', 'no', 100);

      expect(state.status).to.not.eql('none');
      expect(state.yes.size).to.eql(1);
      expect(state.no.size).to.eql(1);

      state.clearPredictions();
      expect(state.status).to.eql('none');
      expect(state.yes.size).to.eql(0);
      expect(state.no.size).to.eql(0);
    });
  });
});
