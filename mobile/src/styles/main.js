import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  body: {
    backgroundColor: '#5b6f9b',
    flex: 1
  },

  schedule: {
    padding: 15,
    flexDirection: 'column'
  },

  schedule_divider: {
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },

  schedule__expanded: {
    backgroundColor: '#6b7ea8'
  },

  scheduler__row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  row__padding: {
    paddingTop: 10
  },

  text_title: {
    fontSize: 48,
    fontFamily: 'sans-serif-thin',
    color: 'white'
  },

  text_subTitle: {
    color: 'darkgray',
    fontSize: 16
  },

  text_info: {
    color: 'white',
    fontSize: 16
  }
});
