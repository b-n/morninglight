import React, { Component } from 'react';
import {
  Text,
  View,
  ListView
} from 'react-native';
import { connect } from 'react-redux';


import Schedule from '../components/schedule';

import style from '../styles/main'
import * as actions from '../actions/actions'


class Scheduler extends Component {

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (oldRowValue, newRowValue) => oldRowValue !== newRowValue
    });

    this.state ={
      dataSource: dataSource.cloneWithRows(this.props.schedules)
    };

    this.selectSchedule = this.selectSchedule.bind(this);
    this.toggleSchedule = this.toggleSchedule.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.schedules !== this.props.schedules || newProps.selectedSchedule !== this.props.selectedSchedule) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newProps.schedules)
      })
    }
  }

  selectSchedule(uuid) {
    this.props.dispatch(actions.selectSchedule(uuid));
  }

  toggleSchedule(uuid) {
    this.props.dispatch(actions.toggleSchedule(uuid));
  }

  render() {
    const { schedules } = this.props;

    return(
      <View style={style.body}>
        <ListView
          style={style.schedule__container}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={row => {
            const { uuid, expanded, enabled, time, title, dow } = row;
            return (
              <Schedule
                uuid={uuid}
                isExpanded={expanded}
                enabled={enabled}
                time={time}
                title={title}
                dow={dow}
                onSelect={this.selectSchedule}
                onToggle={this.toggleSchedule}
              />
            )
          }}
        />
      </View>
    )
  }
}

export default connect(state => ({
  schedules: state.scheduleReducer.schedules
}))(Scheduler);
