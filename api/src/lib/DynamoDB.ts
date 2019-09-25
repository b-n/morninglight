import AWS from 'aws-sdk'

AWS.config.update({region: process.env.REGION})

const dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})

const scan = (filters = {}) => {
  const dynamoFilters = Object.keys(filters).reduce((newFilters, key) => {
    newFilters[key] = {
      ComparisonOperator: 'EQ',
      AttributeValueList: filters[key].constructor === Array
      ? filters[key]
      : [filters[key]]
    }
    return newFilters
  }, {})

  return dynamodb.scan({
    TableName: process.env.DYNAMODB_TABLE,
    ScanFilter: dynamoFilters
  }).promise()
    .then(result => result.Items)
}

const get = (id) => {
  return dynamodb.query({
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditions: {
      'id': {
        ComparisonOperator: 'EQ',
        AttributeValueList: [ id ]
      }
    }
  }).promise()
    .then(result => console.log)
    .catch(err => console.log)
}

const put = (item) => {
  return dynamodb.put({
    TableName: process.env.DYNAMODB_TABLE,
    Item: item
  }).promise()
}

export {
  scan,
  get,
  put,
}
