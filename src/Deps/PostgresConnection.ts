import {createConnection} from 'typeorm';
import {User} from '../entity/User';

export const createPostgresConnection = (connectionString: string) => {
  return createConnection({
    type: 'postgres',
    url: connectionString,
    entities: [
      User
    ],
    synchronize: true,
    logging: false
  });
};