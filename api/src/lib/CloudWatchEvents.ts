import AWS, { CloudWatchEvents } from 'aws-sdk';
import { ListTargetsByRuleResponse } from 'aws-sdk/clients/cloudwatchevents'
import { getCronFromDateTime } from './time'

AWS.config.update({ region: process.env.REGION })

type EventData = Record<string, any> | Array<any>

const eventer = new CloudWatchEvents({apiVersion: '2015-10-07'})

const sendEvent = (eventName: string, data: EventData): Promise<EventData> => {
  const params = {
    Entries: [{
      Detail: JSON.stringify(data),
      DetailType: eventName,
      Source: 'io.morninglight',
    }]
  }
  return eventer.putEvents(params).promise()
    .then(() => data)
}

const setCronEvent = (datetime: number | Date, data: EventData): Promise<EventData> => {
  const jobName = process.env.CRON_NAME!

  const cronString = getCronFromDateTime(datetime)

  return eventer.listTargetsByRule({ Rule: jobName }).promise()
    .then(setRuleTargetsWithData(jobName, data))
    .then(setRuleCronString(jobName, cronString))
    .then(() => data)
}

const setRuleTargetsWithData = (ruleName: string, data: EventData) => (cronRule: ListTargetsByRuleResponse) => {
  if (!cronRule.Targets) {
    return Promise.reject('Rule has no targets')
  }
  const newTargets = cronRule.Targets.map(target => ({ ...target, Input: JSON.stringify(data) }))

  return eventer.putTargets({
    Rule: ruleName,
    Targets: newTargets
  }).promise()
}

const setRuleCronString = (ruleName: string, cronString: string) => () => {
  return eventer.putRule({
    Name: ruleName,
    ScheduleExpression: `cron(${cronString})`
  }).promise()
}

export {
  EventData,
  sendEvent,
  setCronEvent,
}
