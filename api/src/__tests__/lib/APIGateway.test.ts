import { getCORSResponse } from '../../lib/APIGateway'

describe('Lib: APIGateway', () => {
  test('Response is stringified and has cors', () => {
    const body = { hello: 'darkness my old friend' }

    const response = getCORSResponse(body, 9001)

    expect(response).toEqual({
      body: JSON.stringify(body),
      headers: expect.objectContaining({
        'Access-Control-Allow-Credentials': expect.any(Boolean),
        'Access-Control-Allow-Origin': expect.any(String),
      }),
      statusCode: 9001,
    })
  })
})
