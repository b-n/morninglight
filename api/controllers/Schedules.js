import { getActiveRecords, getRecord, updateRecord } from '../models/schedule'

export default class Schedules {

  constructor() {}

  async doGet(event) {
    const { pathParameters } = event;
    if (pathParameters == null || pathParameters.id == null || pathParameters.id == "") {
      console.log(getActiveRecords);
      return getActiveRecords();
    }
    const { id } = pathParameters;
    return getRecord(id);
  }

  async doPost(event) {
    const item = JSON.parse(event.body)
    return putItem(item)
  }

  async doPut(event) {
    const item = JSON.parse(event.body)
    return putItem(item)
  }

}
