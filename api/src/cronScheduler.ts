import min from 'date-fns/min'

import { getNextRunTime } from './lib/time'
import { setCronEvent, EventData } from './lib/CloudWatchEvents'
import { getActiveRecords } from './models/schedule'

interface Event {
  lastRun?: number | Date
}

const handler = async (event: Event): Promise<EventData> => {
  const { lastRun } = event
  const from = lastRun || new Date().getTime()

  const allSchedules = await getActiveRecords()

  const nextRun = min(
    allSchedules
      .map(({ cron, tz }) => getNextRunTime(cron, tz, from))
  )

  return setCronEvent(
    nextRun,
    {
      lastRun: from,
      scheduledTime: nextRun,
    }
  )
}

export {
  handler,
}
