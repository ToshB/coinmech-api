import {Logger} from 'pino';
import {createEventStore, EsEvent, EventStore, EventStream} from './EventStore';
import Config from '../Config';
import {CardEvent, TransactionEvent} from './Transactions';
import {EventEmitter2} from 'eventemitter2';
import pino = require('pino');

export default class TransactionService {
  private es: EventStore<TransactionEvent>;
  public initialized: boolean;
  private streamId: string;
  private logger: pino.Logger;
  private bus: EventEmitter2;

  constructor(readonly config: Config, bus: EventEmitter2, logger: Logger) {
    this.logger = logger.child({});
    this.bus = bus;
    this.es = createEventStore({
      type: 'mongodb',
      eventsCollectionName: 'transactions',             // optional
      transactionsCollectionName: 'esTransactions', // optional
      timeout: 10000,                            // optional
      url: config.mongoURL,
      options: {
        ssl: config.mongoURL.indexOf('ssl=true') > 0,
        autoReconnect: true
      }
    });
    this.streamId = 'transactions';


    this.es.on('connect', () => {
      this.logger.info('Eventstore storage connected');
    });

    this.es.on('disconnect', () => {
      this.logger.error('Eventstore storage disconnected');
    });

    this.es.defineEventMappings({
      id: 'id',
      commitStamp: 'timestamp'
    });

    this.es.useEventPublisher((event: CardEvent) => {
      bus.emit(event.type, event);
    });

    this.es.init(err => {
      if (err) {
        this.logger.error(err, 'Error initializing eventstore');
        return;
      }
      this.logger.info('Eventstore initialized');
    });
  }

  handleError = (e: Error) => {
    this.logger.error(e);
    throw new Error(`Error querying DB: ${e.message}`);
  };

  addTransaction(transaction: CardEvent) {
    return new Promise((resolve, reject) => {
      this.es.getEventStream(this.streamId, (err: Error, stream: EventStream<CardEvent>) => {
        if (err) {
          return reject(err);
        }
        stream.addEvent(transaction);
        stream.commit((err: Error) => {
          if (err) {
            return reject(err)
          }

          this.es.getLastEvent(this.streamId, (err: Error, event: EsEvent<CardEvent>) => {
            if (err) {
              return reject(err);
            }

            return resolve(event);
          });
        });
      });
    })
  }

  getAllTransactions() {
    return new Promise(resolve => {
      this.es.getEventStream(this.streamId, (err: Error, stream: EventStream<CardEvent>) => {
        resolve(stream.events.map(e => e.payload).reverse());
      });
    });
  }

  replayAllEvents() {
    return new Promise(resolve => {
      this.es.getEventStream(this.streamId, (err: Error, stream: EventStream<CardEvent>) => {
        stream.events.forEach(event => this.bus.emit(event.payload.type, event.payload));
        resolve(stream.events.length);
      });
    });
  }
}
