module.exports = {
  name: '!refund',
  description: 'Refund the points in the current prediction',
  execute(msg, _args, db, predictions) {
    const validOutcomes = ['yes', 'no'];

    msg.channel.send('The prediction is cancelled and the points have been refunded.');
    predictions.open = false;
    
    validOutcomes.forEach(outcome => {
      predictions[outcome].forEach(prediction => {
        const pointsQuery = `SELECT points FROM users WHERE id = ${prediction.id}`;
  
        db.query(pointsQuery, (err, result) => {
          if (err) throw err;
  
          const points = result[0].points;
          const newBalance = points + prediction.amount;
  
          const rewardQuery = `UPDATE users SET points = ${newBalance} WHERE id = ${prediction.id};`
          db.query(rewardQuery, (err, _) => {
            if (err) throw err;
          });
        });
      });
    });
  }
};
