import fetch from 'node-fetch'
import parser from 'cron-parser'
import CloudWatchEvents from '../lib/CloudWatchEvents'
import DynamoDB from '../lib/DynamoDB'
import Particle from '../lib/Particle'

class Executor {

  constructor() {
    this.eventer = new CloudWatchEvents()
    this.db = new DynamoDB()
    this.handle = this.handle.bind(this)
  }

  async handle(event, context) {
    const { lastRun, scheduledTime } = event

    const queryResults = await this.db.getActiveItems()

    const results = await Promise.all(
      queryResults.Items
        .filter(item => this.isCronInRange(item.cron, item.timezone, lastRun, scheduledTime))
        .map(item => this.getActionFromSchedule(item))
    )

    return this.eventer.sendEvent('cron:executed', { lastRun: scheduledTime })
  }

  async getActionFromSchedule(item) {
    //TODO: should collect per type, and call to appropriate handler
    const { type, action, data } = item
    if (type == 'particle') return new Particle().runAction(action, data)
    return Promise.reject('Not a valid type')
  }

  isCronInRange(cronString, tz, currentDate, endDate) {
    try {
      parser
        .parseExpression(cronString, { currentDate, endDate, tz })
        .next()
      return true
    } catch (exception) {
      return false
    }
  }
}

export const handle = new Executor().handle
