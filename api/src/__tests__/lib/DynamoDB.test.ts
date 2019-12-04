import AWS from 'aws-sdk'

jest.mock('aws-sdk')

const mockReturns = {
  put: { promise: jest.fn() },
  query: { promise: jest.fn() },
  scan: { promise: jest.fn() },
}

const mocks = {
  put: jest.fn().mockReturnValue(mockReturns.put),
  query: jest.fn().mockReturnValue(mockReturns.query),
  scan: jest.fn().mockReturnValue(mockReturns.scan),
}

AWS.DynamoDB.DocumentClient.mockImplementation(() => ({ ...mocks }))

import { put, query, scan } from '../../lib/DynamoDB'

describe('Lib: DynamoDB', () => {
  test('scan: can query records without filters', async () => {
    const scanResult = {
      Items: [
        { test: 'result' },
      ],
    }
    mockReturns.scan.promise.mockResolvedValue(scanResult)

    return scan()
      .then((result) => {
        expect(result).toEqual(scanResult.Items)
        expect(mocks.scan).toHaveBeenCalledTimes(1)
        expect(mocks.scan).toHaveBeenCalledWith({
          ScanFilter: {},
          TableName: process.env.DYNAMODB_TABLE,
        })
        mocks.scan.mockClear()
      })
  })

  test('scan: with filters', async () => {
    const scanResult = {
      Items: [
        { test: 'result' },
      ],
    }
    mockReturns.scan.promise.mockResolvedValue(scanResult)
    const filters = {
      active: [true],
      id: ['123', '234'],
    }

    return scan(filters)
      .then((result) => {
        expect(result).toEqual(scanResult.Items)
        expect(mocks.scan).toHaveBeenCalledTimes(1)
        expect(mocks.scan).toHaveBeenCalledWith({
          ScanFilter: {
            active: {
              AttributeValueList: [true],
              ComparisonOperator: 'EQ',
            },
            id: {
              AttributeValueList: ['123', '234'],
              ComparisonOperator: 'EQ',
            },
          },
          TableName: process.env.DYNAMODB_TABLE,
        })
        mocks.scan.mockClear()
      })
  })

  test('query: can query by Id', async () => {
    const id = 'testing'

    const mockResult = {
      hello: 'are you there caller?',
      id,
    }

    mockReturns.query.promise.mockResolvedValue({ Items: [mockResult] })

    return query(id)
      .then((result) => {
        expect(result).toEqual(mockResult)
        expect(mocks.query).toHaveBeenCalledTimes(1)
        expect(mocks.query).toHaveBeenCalledWith({
          KeyConditions: {
            id: { ComparisonOperator: 'EQ', AttributeValueList: [id] },
          },
          TableName: process.env.DYNAMODB_TABLE,
        })
        mocks.query.mockClear()
      })
  })

  test('put: updates a record', async () => {
    const record = {
      hello: 'olleh',
    }

    mockReturns.put.promise.mockResolvedValue({ Attributes: record })

    return put(record)
      .then((result) => {
        expect(result).toEqual(record)
        expect(mocks.put).toHaveBeenCalledTimes(1)
        expect(mocks.put).toHaveBeenCalledWith({
          Item: record,
          TableName: process.env.DYNAMODB_TABLE,
        })
        mocks.put.mockClear()
      })
  })
})
