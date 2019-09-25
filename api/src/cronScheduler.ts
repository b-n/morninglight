
import { getCORSResponse } from './lib/APIGateway'
import { getById, getActiveRecords, upsertRecord } from './models/schedule'
import { getNextRunTime } from './lib/time'
import min from 'date-fns/min'
import { CloudWatchEvents } from './lib/CloudWatchEvents'

const handler = async (event, context) => {
  const { lastRun } = event
  const from = lastRun || new Date().getTime()

  const allSchedules = await getActiveRecords();

  const nextRun = min(
    allSchedules
    .map(({cron, tz}) => getNextRunTime(cron, tz, from).toString())
  );

  return new CloudWatchEvents()
    .setCronEvent(nextRun, { lastRun: from, scheduledTime: nextRun })
}

export {
  handler
}
