import { handler } from '../schedule'

import * as scheduleModel from '../models/schedule'

import eventHttp from './stubs/eventHttp.json'
import { schedule } from './stubs/models/schedule'

jest.mock('../models/schedule')

describe('Service has an API for checking and maintaining schedules', () => {

  test('GET: all active schedules', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'GET',
    }

    const activeRecords = [ schedule ];
    const modelMock = jest.spyOn(scheduleModel, "getActiveRecords")
      .mockImplementation(() => Promise.resolve(activeRecords));

    return handler(event)
      .then(result => {
        expect(modelMock).toHaveBeenCalled();
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toStrictEqual(activeRecords);
      })
  })

  test('GET: by id', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'GET',
      pathParameters: {
        id: schedule.id
      }
    }

    const modelMock = jest.spyOn(scheduleModel, "getById")
      .mockImplementation(() => Promise.resolve(schedule));

    return handler(event)
      .then(result => {
        expect(modelMock).toHaveBeenCalled();
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toStrictEqual(schedule);
      });
  })

  test('POST: requires body', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'POST',
      body: null,
      pathParameters: {
        id: schedule.id
      }
    }

    return handler(event)
      .then(result => {
        expect(result.statusCode).toEqual(400);
      })
  })

  test('POST: upserts a record', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'POST',
      body: JSON.stringify(schedule)
    }

    const modelMock = jest.spyOn(scheduleModel, "upsertRecord")
      .mockImplementation(() => Promise.resolve(schedule));

    return handler(event)
      .then(result => {
        expect(modelMock).toBeCalled();
        expect(result.statusCode).toEqual(200)
        expect(JSON.parse(result.body)).toStrictEqual(schedule)
      })
  })

  test('POST: handles validation gracefully', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'POST',
      body: JSON.stringify(schedule)
    }

    const modelMock = jest.spyOn(scheduleModel, "upsertRecord")
      .mockImplementation(() => Promise.reject('fail'));

    return handler(event)
      .then(result => {
        expect(modelMock).toBeCalled();
        expect(result.statusCode).toEqual(400)
      })
  })

  test('UNKNOWN: graceful return', () => {
    const event = {
      ...eventHttp,
      httpMethod: 'UNKNOWN'
    }

    return handler(event)
      .then(result => {
        expect(result.statusCode).toEqual(400);
      })
  })
})
