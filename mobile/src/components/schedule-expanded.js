import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

import style from '../styles/main'

class ScheduleExpanded extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { time, enabled, uuid, title, dow, onToggle } = this.props;

    return (
      <View style={[style.scheduler__row, style.row__padding]}>
        <Text>Expanded</Text>
        <Text style={style.text_subTitle}>{title}</Text>
        <Text style={style.text_info}>{dow}</Text>
      </View>
    )
  }
}
    //<TextInput
    //style={style.text_subTitle}
    //value={this.state.title}
    //onChangeText={(text) => { this.setState({ title: text })}}
    ///>

export default ScheduleExpanded;
