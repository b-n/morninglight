import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableHighlight,
  Animated,
} from 'react-native'

import style from '../styles/main'
import ScheduleHeader from './schedule-header'
import ScheduleCollapsed from './schedule-collapsed'
import ScheduleExpanded from './schedule-expanded'

function calculateHeightFromProp(props) {
  return props.isExpanded
    ? 100
    : 30
}

class Schedule extends Component {

  constructor(props) {
    super(props)

    const height = calculateHeightFromProp(this.props)
    const animation = new Animated.Value(height)

    this.state = {
      animation,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isExpanded !== this.props.isExpanded) {
      this.runAnimations(newProps)
    }
  }

  runAnimations(newProps) {
    const toValue = calculateHeightFromProp(newProps)

    Animated.spring(
      this.state.animation,
      { toValue },
    ).start()
  }

  render() {
    const { isExpanded, enabled, time, title, dow, uuid } = this.props
    const { onSelect, onToggle, onTitleChanged } = this.props

    const scheduleStyles = isExpanded
    ? [style.schedule, style.schedule__expanded]
    : [style.schedule]

    return (
      <TouchableHighlight
        underlayColor="#7889b0"
        activeOpacity={0.85}
        onPress={() => { onSelect(uuid) }}
      >
        <View style={scheduleStyles}>
          <ScheduleHeader
            uuid={uuid}
            enabled={enabled}
            onToggle={onToggle}
            time={time}
          />
          <Animated.View style={{ height: this.state.animation }}>
            {isExpanded
                ? <ScheduleExpanded
                  title={title}
                  dow={dow}
                  uuid={uuid}
                  onToggle={onToggle}
                  onTitleChanged={onTitleChanged}
                />
                : <ScheduleCollapsed
                  title={title}
                  dow={dow}
                  uuid={uuid}
                  onToggle={onToggle}
                />
            }
          </Animated.View>
        </View>
      </TouchableHighlight>
    )
  }
}

Schedule.propTypes = {
  dow: PropTypes.string,
  uuid: PropTypes.string,
  enabled: PropTypes.bool,
  isExpanded: PropTypes.bool,
  title: PropTypes.string,
  time: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  onToggle: PropTypes.func,
  onTitleChanged: PropTypes.func,
}


export default Schedule
