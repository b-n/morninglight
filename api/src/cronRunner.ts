import { getActiveRecords } from './models/schedule'
import { isCronInRange } from './lib/time'
import { Particle, ParticleRequest } from './lib/Particle'
import { sendEvent } from './lib/CloudWatchEvents'

interface Event {
  lastRun: Date
  scheduledTime: Date
}

const handler = async (event: Event) => {
  const { lastRun, scheduledTime } = event

  const schedules = await getActiveRecords();

  await Promise.all(
    schedules
    .filter(item => isCronInRange(item.cron, item.tz, lastRun, scheduledTime))
    .map(item => getActionFromSchedule(item))
  )

  return sendEvent('cron:executed', { lastRun: scheduledTime })
}

const getActionFromSchedule = async (item: Schedule) => {
    //TODO: should collect per type, and call to appropriate handler
    const { type, action, data } = item
    if (type === ScheduleActionType.particle) return new Particle().runAction(action, data as ParticleRequest)
    return Promise.reject('Not a valid type')
  }

export { handler }
