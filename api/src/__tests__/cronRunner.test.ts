import { handler } from '../cronRunner'

import * as libCloudWatchEvents from '../lib/CloudWatchEvents'
import * as libParticle from '../lib/Particle'
import * as scheduleModel from '../models/schedule'
import schedule from './fixtures/schedule'

jest.mock('../models/schedule')
jest.mock('../lib/CloudWatchEvents')
jest.mock('../lib/Particle')

describe('Service has a job runner', () => {
  const spies = {
    getActiveRecords: jest.spyOn(scheduleModel, 'getActiveRecords'),
    runAction: jest.spyOn(libParticle.Particle.prototype, 'runAction'),
    sendEvent: jest.spyOn(libCloudWatchEvents, 'sendEvent'),
  }

  test('Runs jobs in range', async () => {
    const event = {
      lastRun: new Date('1970-01-01T12:00:00'),
      scheduledTime: new Date('1970-01-01T13:00:00'),
    }

    spies.getActiveRecords
      .mockImplementation(() => Promise.resolve([
        { ...schedule, cron: '0 0 * * *' },
        { ...schedule, cron: '0 12 * * *' },
        { ...schedule, cron: '30 12 * * *' },
        { ...schedule, cron: '0 13 * * *' },
        { ...schedule, cron: '0 23 * * *' },
      ]))

    return handler(event)
      .then((result: Record<string, any>) => {
        expect(result.lastRun).toEqual(event.scheduledTime)
        expect(spies.getActiveRecords).toHaveBeenCalledTimes(1)
        expect(spies.sendEvent).toHaveBeenCalledTimes(1)
        expect(spies.runAction).not.toHaveBeenCalledTimes(3)
        spies.getActiveRecords.mockClear()
        spies.runAction.mockClear()
        spies.sendEvent.mockClear()
      })
  })

  test('Runs nothing if nothing in range', async () => {
    const event = {
      lastRun: new Date('1970-01-01T00:00:00'),
      scheduledTime: new Date('1970-01-01T00:00:00'),
    }

    return handler(event)
      .then((result: Record<string, any>) => {
        expect(result.lastRun).toEqual(event.scheduledTime)
        expect(spies.getActiveRecords).toHaveBeenCalledTimes(1)
        expect(spies.sendEvent).toHaveBeenCalledTimes(1)
        expect(spies.runAction).not.toHaveBeenCalled()
        spies.getActiveRecords.mockClear()
        spies.sendEvent.mockClear()
      })
  })

  test('Runner fails if record is poorly configured', async () => {
    const event = {
      lastRun: new Date('1970-01-01T12:00:00'),
      scheduledTime: new Date('1970-01-01T13:00:00'),
    }

    spies.getActiveRecords
      .mockImplementation(() => Promise.resolve([
        {
          ...schedule,
          cron: '30 12 * * *',
          type: 'notValid' as ScheduleActionType,
        },
      ]))

    return expect(handler(event))
      .rejects.toEqual(new Error('Not a valid type'))
  })
})
