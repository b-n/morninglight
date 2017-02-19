import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Switch,
  TouchableHighlight,
  Animated
} from 'react-native';

import style from '../styles/main';
import ScheduleHeader from './schedule-header';
import ScheduleCollapsed from './schedule-collapsed';
import ScheduleExpanded from './schedule-expanded';

class Schedule extends Component {

  constructor(props) {
    super(props);

    const height = this._calculateHeightFromProp(this.props.isExpanded);
    const animation = new Animated.Value(height);

    this.state = {
      animation
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isExpanded != this.props.isExpanded) {
      this._runAnimations(newProps);
    }
  }

  _runAnimations(newProps) {
    const toValue = this._calculateHeightFromProp(newProps.isExpanded);

    Animated.spring(
      this.state.animation,
      { toValue }
    ).start();
  }

  _calculateHeightFromProp(isExpanded) {
    return isExpanded
      ? 100 :
      30;
  }

  render() {
    const { isExpanded, enabled, time, title, dow, uuid } = this.props;
    const { onSelect, onToggle } = this.props;

    const scheduleStyles = isExpanded
    ? [ style.schedule, style.schedule__expanded ]
    : [ style.schedule ]

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
          <Animated.View style={{height: this.state.animation}}>
            {isExpanded
                ?  <ScheduleExpanded
                  title={title}
                  dow={dow}
                  uuid={uuid}
                  onToggle={onToggle}
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

export default Schedule;
