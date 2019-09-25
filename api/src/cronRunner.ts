import { getActiveRecords } from './models/schedule'
import { isCronInRange } from './lib/time'
import { Particle } from './lib/Particle'
import { CloudWatchEvents } from './lib/CloudWatchEvents'

const handler = async (event, context) => {
  const { lastRun, scheduledTime } = event

  const schedules = await getActiveRecords();

  const result = await Promise.all(
    schedules
    .filter(item => this.isCronInRange(item.cron, item.tz, lastRun, scheduledTime))
    .map(item => this.getActionFromSchedule(item))
  )

  return new CloudWatchEvents()
    .sendEvent('cron:executed', { lastRun: scheduledTime })
}

const getActionFromSchedule = async (item) => {
    //TODO: should collect per type, and call to appropriate handler
    const { type, action, data } = item
    if (type == 'particle') return new Particle().runAction(action, data)
    return Promise.reject('Not a valid type')
  }

export { handler }
