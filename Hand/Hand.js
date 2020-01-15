import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Animated,
  Dimensions,
  PixelRatio,
  Platform
} from 'react-native';
import Card from '../Card';

const { width, height } = Dimensions.get('window');
const centerScreen = width / 2;

export default class Hand extends Component {
  constructor(props) {
    super(props);
    var cards = props.cards;
    cards = cards.map((card) => {
      card.rotation = new Animated.Value(0);
      card.position = new Animated.Value(0);
      card.positionX = new Animated.Value(0);
      card.moving = false;
      return card;
    });
    this.state = {
      scrollPosition: 0,
      cards,
      tick: 0,
    };
  }

  componentDidUpdate() {
    if (this.props.tick > this.state.tick) {
      var cards = [...this.props.cards];
      cards = cards.map((card) => {
        card.rotation = new Animated.Value(0);
        card.position = new Animated.Value(0);
        card.positionX = new Animated.Value(0);
        card.moving = false;
        return card;
      });
      try {
        this.setState({
          cards,
          tick: this.props.tick
        });
      } catch (e) { }

      this.handleScroll();
    }
  }

  _onSelectCard(id) {
    for (let i = 0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].id == id) {
        Animated.timing(
          this.state.cards[i].position,
          {
            toValue: 2500,
            duration: 250,
          },
        ).start(() => {
          var anims = [];

          if (Platform.OS === 'ios') {
            for (let j = 1; j <= 3; j++) {
              if (i < this.state.cards.length - j) {
                anims.push(Animated.timing(
                  this.state.cards[i + j].positionX, {
                  toValue: -150,
                  duration: 250,
                }
                ));
                anims.push(Animated.timing(
                  this.state.cards[i + j].position, {
                  toValue: 0,
                  duration: 250,
                }
                ));
                anims.push(Animated.timing(
                  this.state.cards[i + j].rotation, {
                  toValue: 0,
                  duration: 250,
                }
                ));
              } else {
                break;
              }
            }
            if (i > 0) {
              anims.push(Animated.timing(
                this.state.cards[i - 1].position, {
                toValue: 0,
                duration: 400,
              }
              ));
              anims.push(Animated.timing(
                this.state.cards[i - 1].rotation, {
                toValue: 0,
                duration: 400,
              }
              ));
              if (i > 1) {
                anims.push(Animated.timing(
                  this.state.cards[i - 2].position, {
                  toValue: 0,
                  duration: 400,
                }
                ));
                anims.push(Animated.timing(
                  this.state.cards[i - 2].rotation, {
                  toValue: 0,
                  duration: 400,
                }
                ));
              }
            }
          }
          if (anims.length) {
            Animated.parallel(anims).start(() => {
              this.props.onSelectCard(id, () => {
                this.handleScroll();
              });
            });
          } else {
            this.props.onSelectCard(id, () => {
              this.handleScroll();
            });
          }
        });
        break;
      }
    }
  }

  componentDidMount() {
    this.handleScroll();
  }

  handleScroll(e) {
    if (Platform.OS !== 'ios') {
      return;
    }

    var scrollX = e ? e.nativeEvent.contentOffset.x : 0;

    var anims = [];

    for (var i = 0; i < this.state.cards.length; i++) {
      var myDistance = (150 * i) - centerScreen + 75;
      var number = Math.floor(myDistance - scrollX);

      anims.push(Animated.spring(
        this.state.cards[i].rotation, // The value to drive
        {
          toValue: number,
          speed: 25,
        },
      ));
      anims.push(Animated.spring(
        this.state.cards[i].position, // The value to drive
        {
          toValue: number,
          speed: 20,
        },
      ));
    }

    Animated.parallel(anims).start();
  }

  render() {
    return (
      <View>
        {this.state.cards.length &&
          <FlatList
            onScroll={(ev) => this.handleScroll(ev)}
            style={styles.handList}
            horizontal={true}
            data={this.state.cards}
            renderItem={
              (card, i) => (
                <Animated.View style={{
                  transform: [{
                    rotateZ: card.item.rotation.interpolate({
                      inputRange: [-1000, 1000],
                      outputRange: ['-45deg', '45deg']
                    })
                  }, {
                    translateY: card.item.position.interpolate({
                      inputRange: [-1000, 0, 1000],
                      outputRange: [100, 0, 100]
                    })
                  }, {
                    translateX: card.item.positionX || new Animated.Value(0),
                  }],
                  margin: Platform.OS === 'ios' ? 0 : 5
                }}>
                  {card.item.moving ||
                    <TouchableHighlight style={styles.card} underlayColor={'#CCC'} onPress={() => this._onSelectCard(card.item.id)}>
                      <Card data={card.item} />
                    </TouchableHighlight>
                  }
                </Animated.View>
              )
            }
            keyExtractor={
              (item, i) => i.toString()
            }
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  handList: {
    paddingTop: 20,
  },
  card: {
    // margin: -5,
    // transform: [{ rotateZ: '10deg' }],
  }
});