import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Switch,
  TouchableHighlight
} from 'react-native';

import style from '../styles/main';
import ScheduleCollapsed from './schedule-collapsed';
import ScheduleExpanded from './schedule-expanded';

class Schedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    }
  }

  render() {
    const { isExpanded, enabled, time, title, dow, uuid } = this.props;
    const { onSelect, onToggle } = this.props;

    const scheduleView = isExpanded
      ?  <ScheduleExpanded
          time={time}
          title={title}
          dow={dow}
          uuid={uuid}
          enabled={enabled}
          onToggle={onToggle}
        />
      : <ScheduleCollapsed
          time={time}
          title={title}
          dow={dow}
          uuid={uuid}
          enabled={enabled}
          onToggle={onToggle}
        />;

    return (
      <TouchableHighlight
        underlayColor="#0000d6"
        activeOpacity={0.85}
        onPress={() => { onSelect(uuid) }}
      >
        <View>
          {scheduleView}
        </View>
      </TouchableHighlight>
    )
  }
}

export default Schedule;
