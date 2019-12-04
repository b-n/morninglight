import { handler } from '../schedule'

import * as scheduleModel from '../models/schedule'

import eventHttp from './fixtures/eventHttp.json'
import schedule from './fixtures/schedule'

jest.mock('../models/schedule')

describe('Service has an API for checking and maintaining schedules', () => {
  const spies = {
    getActiveRecords: jest.spyOn(scheduleModel, 'getActiveRecords'),
    getById: jest.spyOn(scheduleModel, 'getById'),
    upsertRecord: jest.spyOn(scheduleModel, 'upsertRecord'),
  }

  test('GET: all active schedules', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'GET',
    }

    return handler(event)
      .then((result) => {
        expect(spies.getActiveRecords).toHaveBeenCalledTimes(1)
        expect(result.statusCode).toEqual(200)
        expect(JSON.parse(result.body)).toStrictEqual([schedule])
        spies.getActiveRecords.mockClear()
      })
  })

  test('GET: by id', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'GET',
      pathParameters: {
        id: schedule.id,
      },
    }

    return handler(event)
      .then((result) => {
        expect(spies.getById).toHaveBeenCalled()
        expect(spies.getById).toHaveBeenCalledWith(schedule.id)
        expect(result.statusCode).toEqual(200)
        expect(JSON.parse(result.body)).toStrictEqual(schedule)
        spies.getById.mockClear()
      })
  })

  test('POST: requires body', () => {
    const event = {
      ...eventHttp,
      body: null,
      httpMethod: 'POST',
      pathParameters: {
        id: schedule.id,
      },
    }

    return handler(event)
      .then((result) => {
        expect(result.statusCode).toEqual(400)
      })
  })

  test('POST: upserts a record', () => {
    const event = {
      ...eventHttp,
      body: JSON.stringify(schedule),
      httpMethod: 'POST',
    }

    return handler(event)
      .then((result) => {
        expect(spies.upsertRecord).toBeCalled()
        expect(result.statusCode).toEqual(200)
        expect(JSON.parse(result.body)).toStrictEqual(schedule)
        spies.upsertRecord.mockClear()
      })
  })

  test('POST: handles validation gracefully', () => {
    const event = {
      ...eventHttp,
      body: JSON.stringify(schedule),
      httpMethod: 'POST',
    }

    spies.upsertRecord
      .mockImplementation(() => Promise.reject(new Error('fail')))

    return handler(event)
      .then((result) => {
        expect(spies.upsertRecord).toBeCalled()
        expect(result.statusCode).toEqual(400)
        spies.upsertRecord.mockClear()
      })
  })

  test('UNKNOWN: graceful return', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'UNKNOWN',
    }

    return handler(event)
      .then((result) => {
        expect(result.statusCode).toEqual(400)
      })
  })
})
