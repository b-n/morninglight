import { APIGatewayProxyEvent } from 'aws-lambda'

import { getCORSResponse, APIGatewayResponse } from './lib/APIGateway'

import { getById, getActiveRecords, upsertRecord } from './models/schedule'

interface Event extends APIGatewayProxyEvent {
  body: string
}

const handler = async (event: Event) : Promise<APIGatewayResponse> => {
  const { httpMethod, body, pathParameters } = event;

  if (httpMethod == 'GET') {
    const id = pathParameters && pathParameters.id;

    const result = id
      ? await getById(id)
      : await getActiveRecords();

    return getCORSResponse(result)
  }

  if (httpMethod == 'POST') {
    const result = await upsertRecord(JSON.parse(body) as Schedule);

    return getCORSResponse(result)
  }

  return getCORSResponse({ message: "Unknown request type" }, 400)
}

export {
  handler
}
