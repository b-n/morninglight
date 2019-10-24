interface Schedule {
  id: string
  action: string
  cron: string
  data: {
    [key: string]: any
  }
  isActive: boolean
  name: string
  type: ScheduleActionType
  tz: string
}

declare enum ScheduleActionType {
  particle = 'PARTICLE'
}
