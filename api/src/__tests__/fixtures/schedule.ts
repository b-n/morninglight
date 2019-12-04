/* istanbul ignore file  */

const schedule: Schedule = {
  action: 'TEMP_ANIMATE',
  cron: '0 0 * * *',
  data: {
    bool: true,
    num: 1,
    str: 'string',
  },
  id: '12345678-9012-3456-7890-123456789012',
  isActive: true,
  name: 'stubbed',
  type: 'PARTICLE' as ScheduleActionType,
  tz: 'Europe/Amsterdam',
}

export default schedule
