const eventstore = require('eventstore');

interface Options {
  type: string;
  eventsCollectionName: string;
  transactionsCollectionName: string;
  timeout: number;
  url: string;
}

interface Event<T> {
  payload: T;
}

export interface CommitStream<T> {
  eventsToDispatch: Event<T>[];
}

export interface EventStream<T> {
  events: Event<T>[];

  addEvent(event: T): void;

  addEvents(events: T[]): void;

  commit(): void;

  commit(cb: (err: Error, stream: CommitStream<T>) => void): void;

}

export interface EventStore<T> {
  on(evt: string, cb: () => any): void;
  defineEventMappings(mappings: object): void;
  init(): void;

  getEventStream(streamId: string, cb: (err: Error, stream: EventStream<T>) => void): void;

}

export function createEventStore<T>(options: Options): EventStore<T> {
  return eventstore(options);
}

