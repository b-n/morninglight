interface APIGatewayResponse {
  statusCode: number
  body: string
  headers: {
    [name: string]: any
  }
}

const getCORSResponse = (body: Array<any> | Record<any, any>, statusCode = 200): APIGatewayResponse => ({
  body: JSON.stringify(body),
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
  },
  statusCode,
})

export {
  APIGatewayResponse,
  getCORSResponse,
}
