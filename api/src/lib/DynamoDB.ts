import AWS from 'aws-sdk'
import {
  Condition,
  FilterConditionMap,
  PutItemOutput,
  QueryOutput,
  ScanOutput,
} from 'aws-sdk/clients/dynamodb'

AWS.config.update({ region: process.env.REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

interface Filters {
  [name: string]: Array<any>
}

interface DBRecord {
  [key: string]: any
}

const scan = (filters: Filters = {}): Promise<Array<DBRecord>> => {
  const dynamoFilters = Object.keys(filters).reduce((newFilters, key) => {
    newFilters[key] = {
      AttributeValueList: filters[key],
      ComparisonOperator: 'EQ',
    } as Condition
    return newFilters
  }, {} as FilterConditionMap)

  return dynamodb.scan({
    ScanFilter: dynamoFilters,
    TableName: process.env.DYNAMODB_TABLE,
  }).promise()
    .then((result: ScanOutput) => result.Items)
}

const query = (id: string): Promise<DBRecord> => {
  return dynamodb.query({
    KeyConditions: {
      id: {
        AttributeValueList: [id],
        ComparisonOperator: 'EQ',
      },
    },
    TableName: process.env.DYNAMODB_TABLE,
  }).promise()
    .then((result: QueryOutput) => result.Items![0])
}

const put = (item: DBRecord): Promise<DBRecord> => {
  return dynamodb.put({
    Item: item,
    TableName: process.env.DYNAMODB_TABLE,
  }).promise()
    .then((result: PutItemOutput) => result.Attributes as DBRecord)
}

export {
  scan,
  query,
  put,
  Filters,
  DBRecord,
}
