import { APIGatewayProxyEvent } from 'aws-lambda'

import { getCORSResponse, APIGatewayResponse } from './lib/APIGateway'

import { getById, getActiveRecords, upsertRecord } from './models/schedule'

const handler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayResponse> => {
  const { httpMethod, body, pathParameters } = event;

  if (httpMethod == 'GET') {
    const id = pathParameters && pathParameters.id;

    const result = id
      ? await getById(id)
      : await getActiveRecords();

    return getCORSResponse(result)
  }

  if (httpMethod == 'POST') {
    if (body === null) {
      return getCORSResponse({ message: 'Method requires a body' }, 400);
    }
    try {
      const result = await upsertRecord(JSON.parse(body) as Schedule);
      return getCORSResponse(result)
    } catch (e) {
      return getCORSResponse({
        message: 'Failed to save record',
        trace: e 
      }, 400)
    }
  }

  return getCORSResponse({ message: "Unknown request type" }, 400)
}

export {
  handler
}
