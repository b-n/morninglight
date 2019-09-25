const getCORSResponse = (body, statusCode = 200) => ({
  statusCode: statusCode,
  body: JSON.stringify(body),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
})

export {
  getCORSResponse,
}
