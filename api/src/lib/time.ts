import format from 'date-fns/format'
import parser from 'cron-parser'

const getCronFromDateTime = (dt) => {
  return format(dt, 'm HH d M ? yyyy')
}

const isCronInRange = (cronString, tz, currentDate, endDate) => {
  try {
    parser
      .parseExpression(cronString, { currentDate, endDate, tz })
      .next()
    return true
  } catch (e) {
    return false
  }
}

const getNextRunTime = (cronString, timezone, from = new Date()) =>
  parser.parseExpression(cronString, { currentDate: from, tz: timezone }).next().toDate()

export {
  getCronFromDateTime,
  isCronInRange,
  getNextRunTime,
}
