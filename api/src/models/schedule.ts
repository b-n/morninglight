import uuidv4 from 'uuid/v4'

import { query, put, scan } from '../lib/DynamoDB'

const getActiveRecords = async () : Promise<Array<Schedule>> => {
  return scan({
    isActive: [ true ]
  }) as Promise<Array<Schedule>>
}

const getById = async (id: string) : Promise<Schedule> => {
  return query(id) as Promise<Schedule>;
}

const upsertRecord = async (item: Schedule) : Promise<Schedule> => {
  const record = {
    ...item,
    id: item.id || uuidv4()
  }

  return put(record)
    .then(() => record);
}

export {
  getActiveRecords,
  getById,
  upsertRecord
}
