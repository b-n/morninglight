import React, { PropTypes } from 'react'
import {
  Text,
  View,
  Switch,
} from 'react-native'

import style from '../styles/main'

const ScheduleHeader = (props) => {
  const { uuid, time, enabled, onToggle } = props

  return (
    <View style={style.scheduler__row}>
      <Text style={style.text_title}>{time}</Text>
      <Switch
        disabled={false}
        value={enabled}
        onValueChange={() => { onToggle(uuid) }}
      />
    </View>
  )
}

ScheduleHeader.propTypes = {
  uuid: PropTypes.string,
  time: PropTypes.string,
  enabled: PropTypes.bool,
  onToggle: PropTypes.func,
}

export default ScheduleHeader
