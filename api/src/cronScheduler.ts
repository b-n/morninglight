import { getActiveRecords } from './models/schedule'
import { getNextRunTime } from './lib/time'
import min from 'date-fns/min'
import { setCronEvent } from './lib/CloudWatchEvents'

const handler = async (event, context) => {
  const { lastRun } = event
  const from = lastRun || new Date().getTime()

  const allSchedules = await getActiveRecords();

  const nextRun = min(
    allSchedules
      .map(({cron, tz}) => getNextRunTime(cron, tz, from))
  );

  return setCronEvent(nextRun, { lastRun: from, scheduledTime: nextRun })
}

export {
  handler
}
