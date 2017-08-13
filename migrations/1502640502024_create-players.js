exports.up = (pgm) => {
  pgm.createTable({name: 'players'}, {
    id: 'id',
    name: 'text',
    email: 'text',
    card_id: 'text',
    balance: 'numeric(15,2) DEFAULT \'0.00\''
  });
};

exports.down = (pgm) => {
  pgm.dropTable('players');
};
