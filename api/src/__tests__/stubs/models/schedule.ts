const schedule : Schedule = {
  id: "12345678-9012-3456-7890-123456789012",
  action: "TEMP_ANIMATE",
  cron: "0 12 * * ? *",
  data: {
    bool: true,
    str: "string",
    num: 1
  },
  isActive: true,
  name: "stubbed",
  type: 'PARTICLE' as ScheduleActionType,
  tz: "Europe/Amsterdam"
}

export {
  schedule
}
