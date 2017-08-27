exports.up = (pgm) => {
  pgm.dropColumns('players', ['card_id']);
  pgm.addColumns('cards', {
    player_id: {type: 'integer', references: 'players'}
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('cards', ['player_id']);
  pgm.addColumns('players', {
    card_id: {type: 'text', references: 'cards'}
  });
};
