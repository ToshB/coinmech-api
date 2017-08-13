exports.up = (pgm) => {
  pgm.createTable({name: 'transactions'}, {
    id: 'id',
    date: 'timestamptz NOT NULL DEFAULT now()',
    card_id: 'text NOT NULL',
    amount: 'numeric(15,2) NOT NULL',
    player_id: 'integer',
    machine_id: 'integer',
  });
};

exports.down = (pgm) => {
  pgm.dropTable('transactions');
};
