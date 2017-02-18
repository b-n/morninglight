import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Switch,
  TouchableHighlight
} from 'react-native';

import style from '../styles/main'

class ScheduleCollapsed extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { time, enabled, uuid, title, dow, onToggle } = this.props;

    return (
      <View style={style.schedule}>
        <View style={style.scheduler__row}>
          <Text style={style.text_title}>{time}</Text>
          <Switch
            disabled={false}
            value={enabled}
            onValueChange={() => { onToggle(uuid) }}
          />
        </View>
        <View style={[style.scheduler__row, style.row__padding]}>
          <Text style={style.text_subTitle}>{title}</Text>
          <Text style={style.text_info}>{dow}</Text>
        </View>
      </View>
    )
  }
}



export default ScheduleCollapsed;
