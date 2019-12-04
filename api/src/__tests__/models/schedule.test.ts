import { getActiveRecords, getById, upsertRecord } from '../../models/schedule'

import * as libDynamodDB from '../../lib/DynamoDB'
import schedule from '../fixtures/schedule'

jest.mock('../../lib/DynamoDB')

describe('Schedule Model is handy', () => {
  const spies = {
    put: jest.spyOn(libDynamodDB, 'put'),
    query: jest.spyOn(libDynamodDB, 'query'),
    scan: jest.spyOn(libDynamodDB, 'scan'),
  }

  test('getActiveRecords', async () => {
    return getActiveRecords()
      .then((records: Array<Schedule>) => {
        expect(records.length).toEqual(1)
        expect(records[0]).toEqual(schedule)
        expect(spies.scan).toHaveBeenCalledTimes(1)
        spies.scan.mockClear()
      })
  })

  test('getById', async () => {
    return getById('testing')
      .then((record: Schedule) => {
        expect(record).toEqual({ ...schedule, id: 'testing' })
        expect(spies.query).toHaveBeenCalledTimes(1)
        spies.query.mockClear()
      })
  })

  test('upsertRecord: new record', async () => {
    const { id, ...newRecord } = schedule
    expect(id).toEqual(schedule.id)
    return upsertRecord(newRecord)
      .then((record: Schedule) => {
        const newId = record.id
        expect(newId).not.toBeNull()
        expect(record).toEqual({ ...newRecord, id: newId })
        expect(spies.put).toHaveBeenCalledTimes(1)
        spies.put.mockClear()
      })
  })

  test('upsertRecord: existing record', async () => {
    return upsertRecord(schedule)
      .then((record: Schedule) => {
        expect(record).toEqual(schedule)
        expect(spies.put).toHaveBeenCalledTimes(1)
        spies.put.mockClear()
      })
  })
})
