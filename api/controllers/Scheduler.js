import min from 'date-fns/min'
import parser from 'cron-parser'
import { getActiveRecords } from '../models/schedule'

class Scheduler {
  async getNextRunTime(from) {
    const schedules = await getActiveRecords()

    const nextRuns = schedules.map(({cron, tz}) =>
      new Date(parser.parseExpression(cron, { currentDate: from, tz }).next().toString())
    );

    const nextRun = min(nextRuns)

    return Promise.resolve(nextRun)
  }
}

export default Scheduler
