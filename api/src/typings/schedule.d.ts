interface NewSchedule {
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

interface Schedule extends NewSchedule {
  id: string
}

declare const enum ScheduleActionType {
  particle = 'PARTICLE'
}
