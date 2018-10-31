import format from 'date-fns/format'

const getCronFromDateTime = (dt) => {
  return format(dt, 'm HH d M ? yyyy')
}

export {
  getCronFromDateTime,
}
