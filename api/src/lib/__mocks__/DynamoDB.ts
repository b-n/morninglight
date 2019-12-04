import { DBRecord, Filters } from '../DynamoDB'

import schedule from '../../__tests__/fixtures/schedule'

const scan = async (_filters: Filters = {}): Promise<Array<DBRecord>> => {
  return Promise.resolve([schedule])
}

const query = async (id: string): Promise<DBRecord> => {
  return Promise.resolve({
    ...schedule,
    id,
  })
}

const put = async (_item: DBRecord): Promise<void> => {
  return Promise.resolve()
}

export {
  scan,
  query,
  put,
  Filters,
}
