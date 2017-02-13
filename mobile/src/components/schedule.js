import React, { Component } from 'react';
import {
  Text,
  View,
  Switch,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import style from '../styles/main'

class Schedule extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { enabled, time, title, dow, uuid } = this.props;
    const { onSelect, onToggle } = this.props;

    return (
      <TouchableHighlight
        underlayColor="#0000d6"
        activeOpacity={0.85}
        onPress={() => { onSelect(uuid) }}
      >
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
      </TouchableHighlight>
    )
  }
}

export default Schedule;
