import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import style from '../styles/main'

class ScheduleCollapsed extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { uuid, title, dow } = this.props;

    return (
      <View style={[style.scheduler__row, style.row__padding]}>
        <Text style={style.text_subTitle}>{title}</Text>
        <Text style={style.text_info}>{dow}</Text>
      </View>
    )
  }
}



export default ScheduleCollapsed;
