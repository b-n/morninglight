import AWS from 'aws-sdk'

import { getCronFromDateTime } from '../../lib/time'

jest.mock('aws-sdk')

const mockReturns = {
  listTargetsByRule: {
    promise: jest.fn().mockResolvedValue({ Targets: [] }),
  },
  putEvents: {
    promise: jest.fn().mockResolvedValue(true),
  },
  putRule: {
    promise: jest.fn().mockResolvedValue(true),
  },
  putTargets: {
    promise: jest.fn().mockResolvedValue(true),
  },
}

const mocks = {
  listTargetsByRule: jest.fn().mockReturnValue(mockReturns.listTargetsByRule),
  putEvents: jest.fn().mockReturnValue(mockReturns.putEvents),
  putRule: jest.fn().mockReturnValue(mockReturns.putRule),
  putTargets: jest.fn().mockReturnValue(mockReturns.putTargets),
}

AWS.CloudWatchEvents.mockImplementation(() => ({ ...mocks }))

import { sendEvent, setCronEvent } from '../../lib/CloudWatchEvents'

describe('Lib: CloudWatchEvents', () => {
  test('sendEvent: fires event to CloudWatchEvents', async () => {
    const eventName = 'testing'
    const eventData = { hello: 'is it me you\'re lookin for' }
    return sendEvent(eventName, eventData)
      .then((result) => {
        expect(result).toEqual(eventData)
        expect(mocks.putEvents).toHaveBeenCalledTimes(1)
        expect(mocks.putEvents).toHaveBeenCalledWith({
          Entries: [{
            Detail: JSON.stringify(eventData),
            DetailType: 'testing',
            Source: 'io.morninglight',
          }],
        })
        mocks.putEvents.mockClear()
      })
  })

  test('setCronEvent: sets event with payload in the future based on date', async () => {
    const cronEventName = 'someEventName'
    process.env.CRON_NAME = cronEventName

    const when = new Date()
    const cronDate = getCronFromDateTime(when)
    const eventData = { hello: 'from the otherside' }

    mockReturns.listTargetsByRule.promise.mockResolvedValue({
      Targets: [{
        Input: 'testing',
      }],
    })

    return setCronEvent(when, eventData)
      .then((result) => {
        expect(result).toEqual(eventData)
        expect(mocks.listTargetsByRule).toHaveBeenCalledTimes(1)
        expect(mocks.putTargets).toHaveBeenCalledTimes(1)
        expect(mocks.putRule).toHaveBeenCalledTimes(1)
        expect(mocks.listTargetsByRule).toHaveBeenCalledWith({
          Rule: cronEventName,
        })
        expect(mocks.putTargets).toHaveBeenCalledWith({
          Rule: cronEventName,
          Targets: [{
            Input: JSON.stringify(eventData),
          }],
        })
        expect(mocks.putRule).toHaveBeenCalledWith({
          Name: cronEventName,
          ScheduleExpression: `cron(${cronDate})`,
        })
        mocks.listTargetsByRule.mockClear()
        mocks.putTargets.mockClear()
        mocks.putRule.mockClear()
      })
  })

  test('setCronEvent: rejects if no tarets exist', async () => {
    const cronEventName = 'someEventName'
    process.env.CRON_NAME = cronEventName

    const when = new Date()
    const eventData = { hello: 'from the otherside' }

    mockReturns.listTargetsByRule.promise.mockResolvedValue({
      Targets: undefined,
    })

    return setCronEvent(when, eventData)
      .then((result) => {
        expect(result).toEqual(undefined)
      })
      .catch((e) => {
        expect(e).toEqual(new Error('Rule has no targets'))
        expect(mocks.listTargetsByRule).toHaveBeenCalledTimes(1)
        expect(mocks.putTargets).not.toHaveBeenCalled()
        expect(mocks.putRule).not.toHaveBeenCalled()
        expect(mocks.listTargetsByRule).toHaveBeenCalledWith({
          Rule: cronEventName,
        })
        mocks.listTargetsByRule.mockClear()
      })
  })
})
