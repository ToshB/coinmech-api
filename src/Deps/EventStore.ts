const eventstore = require('eventstore');

interface Options {
  type: string;
  eventsCollectionName: string;
  transactionsCollectionName: string;
  timeout: number;
  url: string;
  options?: {
    ssl?: boolean;
    autoReconnect?: boolean;
  };
}

export interface EsEvent<T> {
  payload: T;
}

export interface EventStream<T> {
  events: EsEvent<T>[];
  eventsToDispatch: EsEvent<T>[];

  addEvent(event: T): void;

  addEvents(events: T[]): void;

  commit(): void;

  commit(cb: (err: Error, stream: EventStream<T>) => void): void;

}

export interface EventStore<T> {
  getLastEvent(query: any, cb: (err: Error, event: EsEvent<T>) => void): void;

  on(evt: string, cb: () => any): void;

  defineEventMappings(mappings: object): void;

  useEventPublisher(handler: (event: T) => void): void;

  init(cb?: (error: Error) => void): void;

  getEventStream(streamId: string, cb: (err: Error, stream: EventStream<T>) => void): void;

}

export function createEventStore<T>(options: Options): EventStore<T> {
  return eventstore(options);
}

