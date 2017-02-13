import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  body: {
    backgroundColor: '#0000b8',
    flex: 1
  },

  schedule__container: {
    paddingVertical: 5
  },

  schedule: {
    marginHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'column'
  },

  scheduler__row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  row__padding: {
    paddingTop: 10
  },

  text_title: {
    fontSize: 36,
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
