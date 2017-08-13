exports.up = (pgm) => {
  pgm.createTable({name: 'machines'}, {
    id: {type: 'serial', primaryKey: true},
    name: 'text',
    price: 'numeric(15,2) DEFAULT \'0.00\''
  });
};

exports.down = (pgm) => {
  pgm.dropTable('machines');
};
