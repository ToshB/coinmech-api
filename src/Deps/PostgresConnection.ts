import {createConnection} from 'typeorm';

export const createPostgresConnection = (connectionString: string) => {
  return createConnection({
    type: 'postgres',
    url: connectionString,
    entities: [
      __dirname + '/../entity/User.ts'
    ],
    synchronize: true,
    logging: false
  });
};