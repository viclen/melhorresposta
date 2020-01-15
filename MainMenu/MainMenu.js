import React, { Component } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Global from "../global.js";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle, faGamepad, faPlus, faPlusCircle, faPlusSquare, faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const server = Global.server;

export default class MainMenu extends Component {
  static navigationOptions = {
    title: 'Menu',
    headerShown: false
  };

  constructor(props) {
    super(props);
    let token = props.navigation.getParam('token');
    this.state = {
      token,
      matchCode: '1234567890123',
      createCode: '',
      erroLoad: false,
      erroCreate: '',
      isLoading: true,
    };
  }

  // componentWillMount(){}
  componentDidMount() {
    this.setLoading(false);
  }
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  loadGame() {
    this.setState({ erroLoad: false });
    this.setLoading(true);
    fetch(server + "/game/" + this.state.matchCode, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: this.state.token
      })
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        // return;

        if (r.status == 1) {
          this.props.navigation.navigate('Game', { token: this.state.token, matchCode: this.state.matchCode });
        } else {
          this.setState({ erroLoad: true });
        }

        this.setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        this.setState({ erroLoad: true });
        this.setLoading(false);
      });
  }

  setCreateCode(createCode) {
    let allowed = "1234567890qwertyuiopasdfghjklzxcvbnm";
    for (var i = 0; i < createCode.length; i++) {
      if (!allowed.includes(createCode.charAt(i).toLowerCase())) {
        createCode = createCode.split(createCode.charAt(i)).join('');
      }
    }
    this.setState({ createCode });
  }

  createGame() {
    if (this.state.createCode.length < 5) {
      this.setState({ erroCreate: 'O código deve ter no mínimo 5 caracteres.' });
      return;
    } else if (this.state.createCode.length > 20) {
      this.setState({ erroCreate: 'O código deve ter no máximo 20 caracteres.' });
      return;
    }

    this.setState({ erroCreate: '' });
    this.setLoading(true);
    fetch(server + "/new/" + this.state.createCode, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: this.state.token
      })
    })
      .then(r => r.json())
      .then(r => {
        // console.log(r);
        // return;

        if (r.status == 1) {
          this.props.navigation.navigate('Game', { token: this.state.token, matchCode: this.state.createCode });
        } else {
          this.setState({ erroCreate: 'Uma partida com esse código já existe.' });
        }

        this.setLoading(false);
      })
      .catch((e) => {
        this.setState({ erroCreate: 'Não foi possível criar a partida.' });
        this.setLoading(false);
      });
  }

  setLoading(value) {
    this.setState({ isLoading: value });
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <LinearGradient colors={['#4f9f4c', '#3b983b', '#196a19']} style={styles.main}>
          <StatusBar
            backgroundColor="#196a19"
            barStyle="light-content"
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.main}>
            <ScrollView>
              <Text style={styles.logoText}>Cartas VS Humanidade</Text>
              <Text style={styles.label}>
                Jogar partida
              </Text>
              <View style={styles.matchCodeContainer}>
                <TextInput placeholder={'Código'} style={styles.matchCode} onChangeText={(matchCode) => this.setState({ matchCode })} value={this.state.matchCode} />
                <TouchableHighlight style={styles.matchCodeButton} onPress={() => this.loadGame()}>
                  <View style={styles.buttonIcon}>
                    <FontAwesomeIcon icon={faPlayCircle} color={'white'} size={30} />
                  </View>
                </TouchableHighlight>
              </View>

              {this.state.erroLoad &&
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>
                    <FontAwesomeIcon icon={faExclamationCircle} color={'white'} style={{ marginRight: 10 }} />
                    A partida não existe ou já está cheia
                </Text>
                </View>
              }

              <Text style={styles.label}>
                Criar partida
              </Text>
              <View style={styles.matchCodeContainer}>
                <TextInput placeholder={'Código'} style={styles.matchCode}
                  onChangeText={(createCode) => this.setCreateCode(createCode)}
                  value={this.state.createCode} />
                <TouchableHighlight style={styles.matchCodeButton} onPress={() => this.createGame()}>
                  <View style={styles.buttonIcon}>
                    <FontAwesomeIcon icon={faGamepad} color={'white'} size={30} />
                  </View>
                </TouchableHighlight>
              </View>

              {this.state.erroCreate.length > 0 &&
                <View style={styles.errorView}>
                  <Text style={styles.errorText}>
                    <FontAwesomeIcon icon={faExclamationCircle} color={'white'} style={{ marginRight: 10 }} />
                    {this.state.erroCreate}
                  </Text>
                </View>
              }

              <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonText}>
                  Sair
                </Text>
              </TouchableHighlight>
            </ScrollView>
          </TouchableWithoutFeedback>

          {this.state.isLoading &&
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          }
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 130,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  matchCodeContainer: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 5,
  },
  matchCode: {
    fontSize: 18,
    height: 50,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    flex: 5,
    padding: 5,
    textAlign: 'center'
  },
  matchCodeButton: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    margin: 0
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  errorView: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#cc6464',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    elevation: 10,
  },
  buttonIcon: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  label: {
    color: 'white',
    margin: 10,
    marginBottom: -5,
    fontSize: 18,
  },
});