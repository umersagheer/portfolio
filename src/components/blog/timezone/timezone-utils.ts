type WallTimeParts = {
  year: number
  month: number
  day: number
  hour: number
  minute?: number
  second?: number
}

export type SimpleTimeValue = {
  hour: number
  minute: number
  second: number
  millisecond: number
  copy(): SimpleTimeValue
}

export function createTimeValue(
  hour: number,
  minute = 0,
  second = 0,
  millisecond = 0
): SimpleTimeValue {
  return {
    hour,
    minute,
    second,
    millisecond,
    copy: () => createTimeValue(hour, minute, second, millisecond)
  }
}

function getTimeZonePart(
  date: Date,
  timeZone: string,
  timeZoneName: 'short' | 'shortOffset'
) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName
  })

  return (
    formatter.formatToParts(date).find(part => part.type === 'timeZoneName')
      ?.value ?? ''
  )
}

function parseOffsetMinutes(offsetLabel: string) {
  const normalized = offsetLabel.replace('UTC', 'GMT')

  if (normalized === 'GMT') {
    return 0
  }

  const match = normalized.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/)

  if (!match) {
    return 0
  }

  const [, sign, hours, minutes] = match
  const direction = sign === '-' ? -1 : 1
  const totalMinutes = Number(hours) * 60 + Number(minutes ?? '0')

  return direction * totalMinutes
}

export function getTimeZoneShortName(date: Date, timeZone: string) {
  return getTimeZonePart(date, timeZone, 'short')
}

export function getTimeZoneOffsetLabel(date: Date, timeZone: string) {
  return getTimeZonePart(date, timeZone, 'shortOffset').replace('GMT', 'UTC')
}

export function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  return parseOffsetMinutes(getTimeZonePart(date, timeZone, 'shortOffset'))
}

export function wallTimeToUTCDate(
  { year, month, day, hour, minute = 0, second = 0 }: WallTimeParts,
  timeZone: string
) {
  const initialGuess = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second)
  )
  const initialOffset = getTimeZoneOffsetMinutes(initialGuess, timeZone)
  const firstPass = new Date(initialGuess.getTime() - initialOffset * 60_000)
  const correctedOffset = getTimeZoneOffsetMinutes(firstPass, timeZone)

  if (correctedOffset === initialOffset) {
    return firstPass
  }

  return new Date(initialGuess.getTime() - correctedOffset * 60_000)
}

export function formatMonthDay(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatHourMinute(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}
