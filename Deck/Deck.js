import React, { Component } from 'react';
import {
  TouchableHighlight, StyleSheet, View, Text,
} from 'react-native';
import Card from '../Card';

export default class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  topCard() {
    if (this.props.topCard) {
      return this.props.topCard;
    } else {
      return { id: "", value: "" };
    }
  }

  render() {
    return (
      <View style={styles.deck}>
        {
          this.props.visible ?
            <Card data={this.topCard()} onSelect={() => this.props.onPress()} />
          :
            <TouchableHighlight
              style={[styles.card, {
                backgroundColor: this.props.visible ? 'white' : '#b32424'
              }]}>
              <View></View>
            </TouchableHighlight>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deck: {
    marginTop: 100,
    marginLeft: 50,
  },
  card: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d6d7da',
    height: 120,
    width: 120,
    justifyContent: 'center',
  }
});