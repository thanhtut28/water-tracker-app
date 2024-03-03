export function convertDate(date: Date) {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

export function convertDateTimeToDate(datetime: string) {
  return datetime.split(' ')[0]
}
