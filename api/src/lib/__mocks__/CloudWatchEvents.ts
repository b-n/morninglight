import { EventData } from '../CloudWatchEvents'

const sendEvent = (_eventName: string, data: EventData): Promise<EventData> => {
  return Promise.resolve(data)
}

const setCronEvent = (_datetime: number | Date, data: EventData): Promise<EventData> => {
  return Promise.resolve(data)
}

export {
  sendEvent,
  setCronEvent,
}
