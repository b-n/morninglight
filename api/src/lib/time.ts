import format from 'date-fns/format'
import parser from 'cron-parser'

const getCronFromDateTime = (dt: Date | number) : string => {
  return format(dt, 'm HH d M ? yyyy')
}

const isCronInRange = (
  cronString: string,
  tz: string,
  currentDate: Date,
  endDate: Date
): boolean => {
  try {
    parser
      .parseExpression(cronString, { currentDate, endDate, tz })
      .next()
    return true
  } catch (e) {
    return false
  }
}

const getNextRunTime = (
  cronString: string,
  timezone: string,
  from: Date | number = new Date()
): Date => {
  return parser.parseExpression(
    cronString,
    {
      currentDate: from,
      tz: timezone
    }
  ).next().toDate()
}

export {
  getCronFromDateTime,
  isCronInRange,
  getNextRunTime,
}
