import AWS from 'aws-sdk';

import { getCronFromDateTime } from './time'

export default class CloudWatchEvents {

  constructor() {
    const { REGION, CRON_NAME } = process.env
    AWS.config.update({region: REGION})
    this.cwevents = new AWS.CloudWatchEvents({apiVersion: '2015-10-07'})
    this.cronJobName = CRON_NAME
  }

  async sendEvent(eventName, data) {
    const params = {
      Entries: [{
          Detail: JSON.stringify(data),
          DetailType: eventName,
          Source: 'io.morninglight',
      }]
    }
    return this.cwevents.putEvents(params).promise()
  }

  async setCronEvent(dt, data) {
    const cronString = getCronFromDateTime(dt)

    await this.setCronData(data)

    return this.schedule(cronString)
  }

  async setCronData(data) {
    const newInput = JSON.stringify(data)

    const ruleData = await this.cwevents.listTargetsByRule({ Rule: this.cronJobName }).promise()

    const newTargets = ruleData.Targets.map(target => ({ ...target, Input: newInput }))

    return this.cwevents.putTargets({
      Rule: this.cronJobName,
      Targets: newTargets
    }).promise()
  }

  async schedule(cronString) {
    const { CRON_NAME } = process.env

    return this.cwevents.putRule({
      Name: CRON_NAME,
      ScheduleExpression: `cron(${cronString})`
    }).promise()
  }
}
