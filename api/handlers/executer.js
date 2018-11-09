import Executer from '../controllers/Executer'
import CloudWatchEvents from '../lib/CloudWatchEvents'

export const handler = async (event, context) => {
  const { lastRun, scheduledTime } = event

  const service = new Executer()
  const results = await service.runAllActions({ from: lastRun, to: scheduledTime })

  return new CloudWatchEvents()
    .sendEvent('cron:executed', { lastRun: scheduledTime })
}
