exports.up = (pgm) => {
  pgm.createTable({name: 'cards'}, {
    id: {type: 'text', primaryKey: true},
    last_seen: 'timestamptz',
    balance: 'numeric(15,2) DEFAULT \'0.00\''
  });
};

exports.down = (pgm) => {
  pgm.dropTable('cards');
};
