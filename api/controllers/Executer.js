import parser from 'cron-parser'
import { getActiveRecords } from '../models/schedule'
import Particle from '../lib/Particle'

class Executer {
  async runAllActions({from, to}) {
    const schedules = await getActiveRecords();

    return Promise.all(
      schedules
        .filter(item => this.isCronInRange(item.cron, item.tz, from, to))
        .map(item => this.getActionFromSchedule(item))
    )
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

  async getActionFromSchedule(item) {
    //TODO: should collect per type, and call to appropriate handler
    const { type, action, data } = item
    if (type == 'particle') return new Particle().runAction(action, data)
    return Promise.reject('Not a valid type')
  }
}

export default Executer
