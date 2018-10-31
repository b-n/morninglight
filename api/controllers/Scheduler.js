import addMinutes from 'date-fns/addMinutes'
import min from 'date-fns/min'
import parser from 'cron-parser'

import CloudWatchEvents from '../lib/CloudWatchEvents'
import DynamoDB from '../lib/DynamoDB'

class Scheduler {

  constructor() {
    this.eventer = new CloudWatchEvents()
    this.db = new DynamoDB()
    this.handle = this.handle.bind(this)
  }

  async handle(event, context) {
    const { lastRun } = event

    const fromDate = lastRun || new Date().getTime()

    const scheduledTime = await this.getNextRunTime(fromDate)

    return this.eventer.setCronEvent(scheduledTime, { lastRun, scheduledTime });
  }

  async getNextRunTime(currentDate) {
    const queryResults = await this.db.getActiveItems()
    console.log(currentDate);

    const nextRuns = queryResults.Items.map(({cron, tz}) => new Date(parser.parseExpression(cron, { currentDate, tz }).next().toString()));

    const nextRun = min(nextRuns)

    return nextRun
  }
}

export const handle = new Scheduler().handle
