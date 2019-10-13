import AWS from 'aws-sdk'
import {
  Condition,
  FilterConditionMap,
  QueryOutput,
  ScanOutput
} from 'aws-sdk/clients/dynamodb'

AWS.config.update({region: process.env.REGION})

const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})

interface Filters {
  [name: string]: Array<any>
}

interface DBRecord {
  [key: string]: any
}

const scan = (filters: Filters = {}): Promise<Array<DBRecord>> => {
  const dynamoFilters = Object.keys(filters).reduce((newFilters, key) => {
    newFilters[key] = {
      ComparisonOperator: 'EQ',
      AttributeValueList: filters[key]
    } as Condition
    return newFilters
  }, {} as FilterConditionMap)

  return dynamodb.scan({
    TableName: process.env.DYNAMODB_TABLE,
    ScanFilter: dynamoFilters
  }).promise()
    .then((result: ScanOutput) => result.Items)
}

const query = (id: string): Promise<DBRecord> => {
  return dynamodb.query({
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditions: {
      'id': {
        ComparisonOperator: 'EQ',
        AttributeValueList: [ id ]
      }
    }
  }).promise()
    .then((result: QueryOutput) => result.Items![0])
}

const put = (item: DBRecord) => {
  return dynamodb.put({
    TableName: process.env.DYNAMODB_TABLE,
    Item: item
  }).promise()
}

export {
  scan,
  query,
  put,
  Filters,
}
