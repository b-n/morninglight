import Scheduler from '../controllers/Scheduler'
import CloudWatchEvents from '../lib/CloudWatchEvents'

export const handler = async (event, context) => {
  const { lastRun } = event

  const from = lastRun || new Date().getTime()

  const service = new Scheduler()
  const to = await service.getNextRunTime(from)

  return new CloudWatchEvents()
    .setCronEvent(to, { lastRun: from, scheduledTime: to })
}
