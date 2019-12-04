import { handler } from '../cronScheduler'
import { getNextRunTime } from '../lib/time'

import * as libCloudWatchEvents from '../lib/CloudWatchEvents'
import * as scheduleModel from '../models/schedule'
import schedule from './fixtures/schedule'

jest.mock('../models/schedule')
jest.mock('../lib/CloudWatchEvents')

describe('Service can schedule a future event correctly', () => {
  const spies = {
    getActiveRecords: jest.spyOn(scheduleModel, 'getActiveRecords'),
    setCronEvent: jest.spyOn(libCloudWatchEvents, 'setCronEvent'),
  }

  test('No event, schedules from now', async () => {
    const event = {}

    const now = new Date().getTime()

    return handler(event)
      .then((result: Record<string, any>) => {
        expect(result.lastRun / 1000).toBeCloseTo(now / 1000, 2)
        expect(spies.getActiveRecords).toBeCalledTimes(1)
        expect(spies.setCronEvent).toBeCalledTimes(1)
        spies.getActiveRecords.mockClear()
        spies.setCronEvent.mockClear()
      })
  })

  test('Plans from lastRun', async () => {
    const event = {
      lastRun: new Date().getTime(),
    }

    const { cron, tz } = schedule

    const nextRun = getNextRunTime(cron, tz, event.lastRun)

    return handler(event)
      .then((result: Record<string, any>) => {
        expect(result.lastRun).toEqual(event.lastRun)
        expect(spies.getActiveRecords).toBeCalledTimes(1)
        expect(spies.setCronEvent).toBeCalledTimes(1)
        expect(spies.setCronEvent).toHaveBeenCalledWith(nextRun, result)
        spies.getActiveRecords.mockClear()
        spies.setCronEvent.mockClear()
      })
  })
})
