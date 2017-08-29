import {Logger} from 'pino';
import {CommitStream, createEventStore, EventStore, EventStream} from './EventStore';
import Config from '../Config';
import {TransactionEvent} from './Transactions';

export default class TransactionService {
  private es: EventStore<TransactionEvent>;
  public initialized: boolean;
  private streamId: string;

  constructor(readonly config: Config, readonly logger: Logger) {
    this.es = createEventStore({
      type: 'mongodb',
      eventsCollectionName: 'transactions',             // optional
      transactionsCollectionName: 'esTransactions', // optional
      timeout: 10000,                            // optional
      url: config.mongoURL
    });
    this.streamId = 'transactions';

    this.es.on('connect', function () {
      console.log('storage connected');
    });

    this.es.on('disconnect', function () {
      console.log('connection to storage is gone');
    });

    this.es.init();
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  addTransaction(transaction: TransactionEvent) {
    return new Promise((resolve, reject) => {
      this.es.getEventStream(this.streamId, (err: Error, stream: EventStream<TransactionEvent>) => {
        if (err) {
          return reject(err);
        }
        stream.addEvent(transaction);
        stream.commit((err: Error, stream: CommitStream<TransactionEvent>) => {
          resolve(stream.eventsToDispatch.map(e => e.payload));
        });
      });
    })
  }

  getAllTransactions() {
    return new Promise(resolve => {
      this.es.getEventStream(this.streamId, (err: Error, stream: EventStream<TransactionEvent>) => {
        resolve(stream.events.map(e => e.payload));
      });
    });
  }
}
