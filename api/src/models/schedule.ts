import { get, put, scan } from '../lib/DynamoDB'
import uuidv4 from 'uuid/v4'

const getActiveRecords = async () => {
  return scan({
    isActive: [ true ]
  })
}

const getById = async (id) => {
  return get(id)
}

const upsertRecord = async (item) => {
  const record = {
    ...item,
    id: item.id || generateId()
  }
  return put(record)
    .then(() => (record));
}

const generateId = () => uuidv4();

export {
  getActiveRecords,
  getById,
  upsertRecord
}
