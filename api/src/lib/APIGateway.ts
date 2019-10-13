interface APIGatewayResponse {
  statusCode: number,
  body: string,
  headers: {
    [name: string]: any
  }
}

const getCORSResponse = (body: Array<any> | Record<any, any>, statusCode = 200): APIGatewayResponse => ({
  statusCode: statusCode,
  body: JSON.stringify(body),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

export {
  APIGatewayResponse,
  getCORSResponse,
}
