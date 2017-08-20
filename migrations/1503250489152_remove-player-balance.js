exports.up = (pgm) => {
  pgm.dropColumns('players', ['balance']);
};

exports.down = (pgm) => {
  pgm.addColumns('players', {
    balance: 'numeric(15,2) DEFAULT \'0.00\''
  });
};
