import React, { Component } from 'react';
import {
  Text,
  View,
  Switch
} from 'react-native';

import style from '../styles/main'

class ScheduleHeader extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { uuid, time, enabled, onToggle } = this.props;

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
}

export default ScheduleHeader;
