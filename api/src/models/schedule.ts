import DynamoDB from '../lib/DynamoDB'
import uuidv4 from 'uuid/v4'

const db = new DynamoDB(process.env.DYNAMODB_TABLE);

const getActiveRecords = async () => {
  return db.scan({
    isActive: [ true ]
  })
}

const getById = async (id) => {
  return db.get(id)
}

const upsertRecord = async (item) => {
  const record = {
    ...item,
    id: item.id || generateId()
  }
  const dbItem = await db.put(record);
  return record
}

const generateId = () => uuidv4();

export {
  getActiveRecords,
  getById,
  upsertRecord
}
