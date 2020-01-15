import React, { Component } from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';

export default class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[
        styles.card,
        {
          backgroundColor: this.props.background || 'white',
          shadowOpacity: this.props.shadow === false ? 0 : 1
        }
      ]}>
        <Text style={{ fontSize: 20, color: this.props.textColor || 'black' }}>
          {this.props.data.value}
        </Text>
        <View style={styles.creator}>
          <Text style={{ color: '#AAA', paddingRight: 3 }}>
            by
          </Text>
          <Text style={[styles.user, { color: this.props.textColor }]}>
            {this.props.data.created_by && this.props.data.created_by.split(" ")[0]}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 250,
    justifyContent: 'center',
    marginHorizontal: 'auto',
    borderRadius: 4,
    marginHorizontal: 0,
    padding: 10,
    shadowOffset:{  width: 0,  height: 5,  },
    shadowColor: 'black',
  },
  creator: {
    position: 'absolute',
    elevation: 1,
    bottom: 0,
    right: 0,
    flexDirection: 'row'
  },
  user: {
    // color: '#1b73d0',
  }
});