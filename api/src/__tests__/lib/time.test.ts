import { getCronFromDateTime, getNextRunTime, isCronInRange } from '../../lib/time'

describe('Lib: time', () => {
  test('getCronFromDateTime: makes your life easier', () => {
    expect(
      getCronFromDateTime(new Date('1970-02-01 03:04:05'))
    ).toEqual('4 03 1 2 ? 1970')
  })

  test('isCronInRange: returns false if before', () => {
    expect(
      isCronInRange(
        '0 0 12 * * *',
        'UTC',
        new Date('1970-01-01T11:59:58Z'),
        new Date('1970-01-01T11:59:59Z')
      )
    ).toEqual(false)
  })

  test('isCronInRange: returns false if on the boundary start', () => {
    expect(
      isCronInRange(
        '1 0 12 * * *',
        'UTC',
        new Date('1970-01-01T12:00:00Z'),
        new Date('1970-01-01T13:00:00Z')
      )
    ).toEqual(true)
  })

  test('isCronInRange: returns true in the middle of range', () => {
    expect(
      isCronInRange(
        '0 0 12 * * *',
        'UTC',
        new Date('1970-01-01T11:30:00Z'),
        new Date('1970-01-01T12:30:00Z')
      )
    ).toEqual(true)
  })

  test('isCronInRange: returns true at the end of a boundary', () => {
    expect(
      isCronInRange(
        '0 0 12 * * *',
        'UTC',
        new Date('1970-01-01T11:00:00Z'),
        new Date('1970-01-01T12:00:00Z')
      )
    ).toEqual(true)
  })

  test('isCronInRange: returns false over the end of a boundary', () => {
    expect(
      isCronInRange(
        '0 0 12 * * *',
        'UTC',
        new Date('1970-01-01T12:00:01Z'),
        new Date('1970-01-01T12:00:02Z')
      )
    ).toEqual(false)
  })

  test('getNextRunTime: gets next runtime', () => {
    expect(
      getNextRunTime(
        '0 0 12 * * *',
        'UTC',
        new Date('1970-01-01T12:00:00Z')
      )
    ).toEqual(new Date('1970-01-02T12:00:00Z'))
  })

  test('getNextRunTime: gets next run from now', () => {
    const nextRun = new Date().getTime() / 10000
    expect(
      getNextRunTime(
        '* * * * * *',
        'UTC'
      ).getTime() / 10000
    ).toBeCloseTo(nextRun, 0)
  })
})
