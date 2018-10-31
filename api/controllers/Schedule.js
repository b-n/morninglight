export default class Schedule {

  constructor() {

  }

  async handle(event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({message: "success"})
    }
  }
}

export const handle = new Schedule().handle
