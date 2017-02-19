import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View
} from 'react-native';

import style from '../styles/main'

class ScheduleExpanded extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    }
    this._updateTitle = this._updateTitle.bind(this);
  }

  _updateTitle(text) {
    this.setState({ title: text });
  }

  render() {
    const { uuid, dow, onToggle } = this.props;
    console.log(this.state.title);

    return (
      <View>
        <View style={style.row__padding}>
          <Text style={style.text_info}>{dow}</Text>
        </View>
        <View>
          <TextInput
            style={style.text_info}
            value={this.state.title}
            onChangeText={this._updateTitle}/>
        </View>
      </View>
    )
  }
}

export default ScheduleExpanded;
