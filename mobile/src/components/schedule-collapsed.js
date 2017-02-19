import React, { PropTypes } from 'react'
import {
  Text,
  View,
} from 'react-native'

import style from '../styles/main'

const ScheduleCollapsed = (props) => {
  const { title, dow } = props

  return (
    <View style={[style.scheduler__row, style.row__padding]}>
      <Text style={style.text_subTitle}>{title}</Text>
      <Text style={style.text_info}>{dow}</Text>
    </View>
  )
}

ScheduleCollapsed.propTypes = {
  title: PropTypes.string,
  dow: PropTypes.string,
}

export default ScheduleCollapsed
