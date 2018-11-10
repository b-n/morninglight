import DynamoDB from '../lib/DynamoDB'
import uuidv4 from 'uuid/v4'

const db = new DynamoDB(process.env.DYNAMODB_TABLE);

const getActiveRecords = async () => {
  return db.scan({
    isActive: [ true ]
  });
}

const getRecord = async (id) => {
  return db.get(id);
}

const updateRecord = async(item) => {
  const newItem = {
    ...item,
    id: item.id ? item.id : generateId()
  }
  const dbItem = await db.put(newItem);
  return newItem
}

function generateId() {
  return uuidv4();
}

export {
  getActiveRecords,
  getRecord,
  updateRecord
}
