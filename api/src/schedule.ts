import { getCORSResponse } from './lib/APIGateway'
import { getById, getActiveRecords, upsertRecord } from './models/schedule'
import { getNextRunTime } from './lib/time'
import min from 'date-fns/min'
import { CloudWatchEvents } from './lib/CloudWatchEvents'

const handler = async (event, context) => {
  const { httpMethod, body, pathParameters, lastRun } = event;

  if (httpMethod != null) {
    if (httpMethod == 'GET') {
      const id = pathParameters && pathParameters.id;

      const result = id
        ? getById(id)
        : getActiveRecords();

      return getCORSResponse(result)
    }

    if (httpMethod == 'POST') {
      const result = upsertRecord(JSON.parse(body));
      
      return getCORSResponse(result)
    }

    return getCORSResponse({ message: "Unknown request type" }, 400)
  }

  if (lastRun != null) {
    const from = lastRun || new Date().getTime()

    const allSchedules = await getActiveRecords();

    const nextRun = min(
      allSchedules
        .map(({cron, tz}) => getNextRunTime(cron, tz, from).toString())
    );

    return new CloudWatchEvents()
      .setCronEvent(nextRun, { lastRun: from, scheduledTime: nextRun })
  }

  throw new Error('unknown execution')
}

