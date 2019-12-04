import uuidv4 from 'uuid/v4'

import schedule from '../../__tests__/fixtures/schedule'

const getActiveRecords = async (): Promise<Array<Schedule>> => {
  return Promise.resolve([schedule])
}

const getById = async (id: string): Promise<Schedule> => {
  return Promise.resolve({
    ...schedule,
    id,
  })
}

const upsertRecord = async (item: Schedule): Promise<Schedule> => {
  return Promise.resolve({
    ...item,
    id: item.id || uuidv4(),
  })
}

export {
  getActiveRecords,
  getById,
  upsertRecord,
}
