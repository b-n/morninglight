import React, { PropTypes, Component } from 'react'
import {
  Text,
  TextInput,
  View,
} from 'react-native'

import style from '../styles/main'

class ScheduleExpanded extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
    }
    this.updateTitle = this.updateTitle.bind(this)
    this.sendTitleUpdate = this.sendTitleUpdate.bind(this)
  }

  updateTitle(text) {
    this.setState({ title: text })
  }

  sendTitleUpdate() {
    this.props.onTitleChanged(this.props.uuid, this.state.title)
  }

  render() {
    const { dow } = this.props

    return (
      <View>
        <View style={style.row__padding}>
          <Text style={style.text_info}>{dow}</Text>
        </View>
        <View>
          <TextInput
            style={style.text_info}
            value={this.state.title}
            onChangeText={this.updateTitle}
            onEndEditing={this.sendTitleUpdate}
            onSubmitEditing={this.sendTitleUpdate}
          />
        </View>
      </View>
    )
  }
}

ScheduleExpanded.propTypes = {
  title: PropTypes.string,
  uuid: PropTypes.string,
  dow: PropTypes.string,
  onTitleChanged: PropTypes.func,
}

export default ScheduleExpanded
