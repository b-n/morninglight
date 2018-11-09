import min from 'date-fns/min'
import parser from 'cron-parser'

import DynamoDB from '../lib/DynamoDB'

class Scheduler {

  constructor() {
    this.db = new DynamoDB()
  }

  async getNextRunTime(from) {
    const queryResults = await this.db.getActiveItems()

    const nextRuns = queryResults.Items.map(({cron, tz}) =>
      new Date(parser.parseExpression(cron, { currentDate: from, tz }).next().toString())
    );

    const nextRun = min(nextRuns)

    return Promise.resolve(nextRun)
  }
}

export default Scheduler
