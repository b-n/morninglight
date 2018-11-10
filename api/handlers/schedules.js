import Schedules from '../controllers/Schedules'

export const handler = async (event, context) => {
  const { httpMethod } = event
  const service = new Schedules()

  if (httpMethod == 'GET') {
    const body = await service.doGet(event)
    return getResponse(200, body)
  }

  if (httpMethod == 'POST') {
    const body = await service.doPost(event)
    return getResponse(200, body)
  }

  return getResponse(200, {message: "success-met-niks"})
}

function getResponse(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}
