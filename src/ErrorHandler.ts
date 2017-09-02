import pino = require('pino');
import {Response} from 'express';

export const logAndSend = (logger: pino.Logger, res: Response) => (error: Error) => {
  logger.error(error);
  res.status(500).send({error: error});
};
