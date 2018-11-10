import AWS from 'aws-sdk'

export default class DynamoDB {

  constructor(tableName) {
    AWS.config.update({region: process.env.REGION})
    this.dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
    this.table = tableName
  }

  async getActiveItems() {
    return this.dynamodb.scan({
      TableName: this.table,
      ScanFilter: {
        isActive: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [ true ]
        }
      }
    }).promise()
  }

  async scan(filters) {
    const dynamoFilters = Object.keys(filters).reduce((newFilters,  key) => {
      newFilters[key] = {
        ComparisonOperator: 'EQ',
        AttributeValueList: filters[key].constructor === Array
          ? filters[key]
          : [filters[key]]
      }
      return newFilters
    }, {})

    return this.dynamodb.scan({
      TableName: this.table,
      ScanFilter: dynamoFilters
    }).promise()
    .then(result => result.Items)
  }

  async get(id) {
    return this.dynamodb.query({
      TableName: this.table,
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

  async put(item) {
    return this.dynamodb.put({
      TableName: this.table,
      Item: item
    }).promise()
  }
}
