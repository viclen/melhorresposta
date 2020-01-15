/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableHighlight,
  Button,
  Animated,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Hand from '../Hand';
import Card from '../Card';
import LinearGradient from 'react-native-linear-gradient';
import Global from '../global';

const { width, height } = Dimensions.get('window');
console.disableYellowBox = true;

const server = Global.server;

export default class Game extends Component {
  static navigationOptions = {
    title: 'carregando...',
    headerStyle: {
      backgroundColor: '#196a19',
    },
    headerTintColor: '#fff',
  };

  constructor(props) {
    super(props);

    this.state = {
      myHand: [],
      currentQuestion: { id: -1, value: '' },
      tableCards: [],
      selectedCard: { id: -1, value: "" },
      animatedCardPosition: new Animated.Value(0),
      showMyHand: false,
      showTableCards: false,
      handTick: 0,
      myTurn: false,
      pontos: 0,
      user_vez: '',
      showNames: false,
      winner: 0,
      myHandPosition: new Animated.Value(0)
    };

    this.token = props.navigation.getParam('token');
    this.matchCode = props.navigation.getParam('matchCode');

    this.lastUpdate = 0;
    this.user = {};

    this.selectCard = this.selectCard.bind(this);
  }

  componentDidMount() {
    this.getUser(this.token);

    Game.navigationOptions.title = this.matchCode;
  }

  componentWillUnmount() {
    this.lastUpdate = new Date().getTime() + 50000;
  }

  getUser(token) {
    token = token || this.token;

    fetch(server + "/me", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token
      })
    })
      .then(r => r.json())
      .then(r => {
        if (r) {
          this.user = r;
        }

        this.gameUpdate();
      })
      .catch(e => {
        console.log(e);
      });
  }

  gameUpdate(force, callback) {
    force = force || false;

    let now = new Date().getTime();
    if (now - this.lastUpdate < 3000 && !force) {
      return;
    }

    this.lastUpdate = now;
    setTimeout(() => this.gameUpdate(), 3000)

    fetch(server + "/game/" + this.matchCode + "/update", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: this.token
      })
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        // return;

        let tableCards = [];

        let showMyHand = true;
        let showTableCards = false;
        let myTurn = false;
        let showNames = false;

        r.cartasnamesa.forEach(item => {
          tableCards.push(item);
          if (item.user.id == this.user.id) {
            showMyHand = false;
            showTableCards = true;
          }
        });

        if (r.vez == this.user.id) {
          showMyHand = false;
          showTableCards = true;
          myTurn = true;
        } else {
          this.darAsCartas(() => callback != undefined ? callback() : undefined);
        }

        this.showMyHand(showMyHand);

        this.setState({
          currentQuestion: r.question,
          onlinePlayers: r.players,
          tableCards,
          showTableCards,
          myTurn,
          pontos: r.pontos,
          user_vez: r.user_vez,
          showNames
        });
      })
      .catch(e => {
        console.log("gameUpdate");
        console.log(e);
      });
  }

  darAsCartas(callback) {
    var url = server + "/game/" + this.matchCode + "/hand";

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: this.token
      })
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        // return;

        let myHand = [];
        let cartas = [...r];
        let changed = false;

        if (cartas.length != this.state.myHand.length) {
          changed = true;
        }

        for (let i in this.state.myHand) {
          for (let j in cartas) {
            if (this.state.myHand[i].id == cartas[j].id) {
              myHand.push(cartas[j]);
              cartas.splice(j, 1);
              break;
            }
          }
        }
        if (cartas.length > 0) {
          changed = true;
          for (let j in cartas) {
            myHand.push(cartas[j]);
          }
        }

        if (changed) {
          let handTick = new Date().getTime();
          this.setState({ myHand, handTick });
        }

        if (callback != undefined) {
          callback();
        }
      })
      .catch(e => {
        console.log("darAsCartas");
        console.log(e);
      });
  }

  selectCard(id, callback) {
    let selectedCard = {};
    let myHand = [...this.state.myHand];
    for (let i = 0; i < myHand.length; i++) {
      if (myHand[i].id == id) {
        selectedCard = myHand[i];
        break;
      }
    }
    this.setState({ selectedCard });
    this.showMyHand(false);

    Animated.timing(this.state.animatedCardPosition, {
      duration: 500,
      toValue: (-height / 2) - 75,
    }).start(() => {
      fetch(server + "/game/" + this.matchCode + "/play", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.token,
          carta: id
        })
      })
        .then(r => r.json())
        .then(r => {
          // console.log(r);
          // return;
          this.state.animatedCardPosition.setValue(0);

          this.gameUpdate(true, () => {
            callback();
          });
        })
        .catch(e => {
          console.log("selectCard");
          console.log(e);
        });
    });
  }

  nextQuestion(winner) {
    this.setState({ myTurn: false, showNames: true, winner });
    setTimeout(() => {
      fetch(server + "/game/" + this.matchCode + "/next", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.token,
          winner
        })
      })
        .then(r => r.json())
        .then(r => {
          this.gameUpdate(true);
          this.setState({ winner: 0 });
        })
        .catch(e => {
          this.setState({ winner: 0 });
          console.log("nextQuestion");
          console.log(e);
        });
    }, 3000);
  }

  selectWinningCard(user_id) {
    if (this.state.myTurn && this.state.onlinePlayers.length - 1 == this.state.tableCards.length) {
      this.nextQuestion(user_id);
    }
  }

  showMyHand(value) {
    if (this.state.showMyHand == value) {
      return;
    }

    if (value) {
      this.setState({ showMyHand: true });
    }

    Animated.timing(
      this.state.myHandPosition,
      {
        duration: 500,
        toValue: value ? 0 : 250
      }
    ).start(() => {
      if (!value) {
        this.setState({ showMyHand: false });
      }
    });
  }

  render() {
    return (
      //'#4c669f', '#3b5998', '#192f6a'
      <LinearGradient colors={['#4f9f4c', '#3b983b', '#196a19']} style={styles.main}>
        <Text style={{
          position: 'absolute',
          top: 0,
          right: 0,
          color: 'white',
          padding: 5,
        }}>
          Pontos:
          &nbsp;
           {this.state.pontos}
        </Text>

        <Text style={{
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'white',
          padding: 5,
        }}>
          Vez de:
        </Text>

        <Text style={{
          position: 'absolute',
          top: 20,
          left: 0,
          color: 'white',
          padding: 5,
        }}>
          {this.state.user_vez}
        </Text>

        <StatusBar
          backgroundColor="#196a19"
          barStyle="light-content"
        />
        <View style={styles.question}>
          <Card background={'black'} textColor={'white'} data={this.state.currentQuestion} />
        </View>
        {this.state.showTableCards &&
          <View style={{ flex: 1 }}>
            {this.state.tableCards.length > 0 &&
              <FlatList
                horizontal={true}
                data={this.state.tableCards}
                renderItem={
                  ({ item }) => (
                    <View style={{ margin: 5, marginTop: 0 }}>
                      <TouchableHighlight underlayColor={'transparent'} onPress={() => this.selectWinningCard(item.user.id)}>
                        <Card data={item.carta} shadow={false} />
                      </TouchableHighlight>
                      {(this.state.showNames || this.state.winner == item.user.id) &&
                        <Text style={[styles.cardUser, styles['cor' + item.user.cor]]}>
                          {item.user.nome}
                        </Text>
                      }
                    </View>
                  )
                }
                keyExtractor={
                  (item, i) => i.toString()
                }
              />
            }
            {this.state.tableCards.length > 0 ||
              <View>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center'
                }}>
                  Aguardando jogadores...
                </Text>
              </View>
            }
          </View>
        }
        {(this.state.showMyHand && this.state.myHand.length > 0) &&
          <Animated.View style={{
            transform: [
              {
                translateY: this.state.myHandPosition
              }
            ]
          }}>
            <Hand style={{ elevation: 5 }} tick={this.state.handTick} cards={this.state.myHand} onSelectCard={(id, callback) => this.selectCard(id, callback)} />
          </Animated.View>
        }
        <View style={styles.cardAnimation}>
          <Animated.View style={{ transform: [{ translateY: this.state.animatedCardPosition }] }}>
            <Card data={this.state.selectedCard} />
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#00955a'
  },
  question: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 10,
  },
  nextButton: {
    backgroundColor: "#3b99fc",
    position: 'absolute',
    top: -10,
    right: 10,
    elevation: 10,
    padding: 10,
  },
  cardAnimation: {
    position: 'absolute',
    elevation: 1,
    bottom: 0,
    transform: [
      { translateY: 250 },
      { translateX: width / 2 - 75 }
    ]
  },
  cardUser: {
    position: 'absolute',
    elevation: 6,
    textAlign: 'center',
    width: '100%',
    top: 5,
    // color: 'white',
    // fontSize: 20
  },
  cor0: {
    color: 'black',
  },
  cor1: {
    color: 'red',
  },
  cor2: {
    color: 'blue',
  },
  cor3: {
    color: 'orange',
  },
  cor4: {
    color: 'purple',
  },
  cor5: {
    color: 'green',
  }
});