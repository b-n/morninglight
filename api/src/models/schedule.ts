import uuidv4 from 'uuid/v4'

import { put, query, scan } from '../lib/DynamoDB'

const getActiveRecords = async (): Promise<Array<Schedule>> => {
  return scan({
    isActive: [true],
  }) as Promise<Array<Schedule>>
}

const getById = async (id: string): Promise<Schedule> => {
  return query(id) as Promise<Schedule>
}

const upsertRecord = async (item: Schedule | NewSchedule): Promise<Schedule> => {
  const record = (item as Schedule).id !== undefined
    ? { ...item }
    : { ...item, id: uuidv4() }

  return put(record)
    .then(() => record as Schedule)
}

export {
  getActiveRecords,
  getById,
  upsertRecord,
}
