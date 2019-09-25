import AWS from 'aws-sdk';
import { getCronFromDateTime } from './time'

AWS.config.update({ region: process.env.REGION })

const eventer = new AWS.CloudWatchEvents({apiVersion: '2015-10-07'})

const sendEvent = (eventName, data) => {
  const params = {
    Entries: [{
      Detail: JSON.stringify(data),
      DetailType: eventName,
      Source: 'io.morninglight',
    }]
  }
  return eventer.putEvents(params).promise()
}

const setCronEvent = (datetime, data) => {
  const jobName = process.env.CRON_NAME

  const cronString = getCronFromDateTime(datetime)

  const newInput = JSON.stringify(data)

  return eventer.listTargetsByRule({ Rule: jobName }).promise()
    .then(setCronEventData(jobName, data))
    .then(setCronString(jobName, cronString))
}

const setCronEventData = (ruleName, data) => (cronRule) => {
  const newTargets = cronRule.Targets.map(target => ({ ...target, Input: data }))

  return eventer.putTargets({
    Rule: ruleName,
    Targets: newTargets
  }).promise()
}

const setCronString = (ruleName, cronString) => () => {
  return eventer.putRule({
    Name: ruleName,
    ScheduleExpression: `cron(${cronString})`
  }).promise()
}

export {
  sendEvent,
  setCronEvent,
}
