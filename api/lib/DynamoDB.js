import AWS from 'aws-sdk'

export default class DynamoDB {

  constructor() {
    const { REGION, DYNAMODB_TABLE } = process.env
    AWS.config.update({region: REGION})
    this.dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'})
    this.table = DYNAMODB_TABLE
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

}
