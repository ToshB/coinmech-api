type EventPayload = any;

interface Event {
  payload: EventPayload;

}

interface EventStream {
  events: Event[];
  addEvent(payload: EventPayload): void;
  addEvents(payloads: EventPayload[]): void;
  commit(callback?: (err: Error, stream: EventStream) => void): void;
  eventsToDispatch: Event[];
}


interface EventMapping {
  id: string;
  commitId: string;
  commitSequence: string;
  commitStamp: string;
  streamRevision: string;
}

interface StreamQuery {
  aggregateId: string;
  aggregate?: string;
  context?: string;
}

declare module 'eventstore' {
  export interface Eventstore {
    init(): void;

    init(callback?: ((err: Error) => void)): void;

    useEventPublisher(publisher: (evt: Event) => void): void;

    useEventPublisher(publisher: (evt: Event, cb: () => void) => void): void;

    getEventStream(streamId: string, callback: (err: Error, stream: EventStream) => void): void;
    getEventStream(query: StreamQuery, callback: (err: Error, stream: EventStream) => void): void;
    getEventStream(streamId: string, revMin: number, revMax: number, callback: (err: Error, stream: EventStream) => void): void;
    getEventStream(query: StreamQuery, revMin: number, revMax: number, callback: (err: Error, stream: EventStream) => void): void;

    on(e: string, callback: (() => void)): void;

    defineEventMappings(mapping: EventMapping): void;

    //getFromSnapshot
    //getUndispatchedEvents
    //getEvents
    //getEventsByRevision
    //getEventsSince
    //getLastEvent
    //getNewId
    //store
  }

  function factory(options?: any): Eventstore;

  export default factory;
}
