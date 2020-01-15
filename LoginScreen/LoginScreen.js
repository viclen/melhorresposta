import React, { Component } from "react";

import styles from "./style";
import {
  Switch,
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Global from "../global.js";

// const appId = "1047121222092614";
const server = Global.server;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      remember: true,
      loginError: '',
      isLoading: true,
    }
  }

  static navigationOptions = {
    title: 'Login',
    headerShown: false
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <LinearGradient colors={['#4f9f4c', '#3b983b', '#196a19']} style={styles.main}>
          <StatusBar
            backgroundColor="#196a19"
            barStyle="light-content"
          />
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
              <Text style={styles.logoText}>Cartas VS Humanidade</Text>
              <View style={styles.loginFormView}>
                <TextInput placeholderTextColor={'#333'} onChangeText={(text) => this.setState({ email: text })} value={this.state.email} placeholder="Email" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} />
                <TextInput placeholderTextColor={'#333'} onChangeText={(text) => this.setState({ password: text })} value={this.state.password} placeholder="Senha" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} />

                <View style={{ flexDirection: 'row', margin: 20, justifyContent: 'center' }}>
                  <Switch onValueChange={(value) => this.setState({ remember: value })} value={this.state.remember} />
                  <TouchableHighlight underlayColor={'transparent'} style={{ paddingLeft: 5, justifyContent: 'center' }} onPress={() => this.setState({ remember: !this.state.remember })}>
                    <Text style={{ color: 'white', fontSize: 24 }}>
                      Manter conectado
                    </Text>
                  </TouchableHighlight>
                </View>

                {this.state.loginError != '' &&
                  <View style={{ margin: 20, backgroundColor: '#cc6464', borderRadius: 5, padding: 5 }}>
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 18 }}>
                      {this.state.loginError}
                    </Text>
                  </View>
                }

                {/* <TouchableHighlight underlayColor={'#88d186'} style={styles.loginButton} onPress={() => this.onLoginPress()}>
                  <Text style={{ textAlign: 'center', fontSize: 18, color: 'white' }}>
                    Login
                  </Text>
                </TouchableHighlight> */}

                {/* <Button
                buttonStyle={styles.fbLoginButton}
                onPress={() => this.onFbLoginPress()}
                title="Login with Facebook"
                color="#3897f1" 
                /> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>

        <TouchableHighlight
          underlayColor={'#88d186'}
          style={styles.loginButton}
          onPress={() => this.onLoginPress()}>
          <Text style={{ textAlign: 'center', fontSize: 30, color: 'white' }}>
            Login
          </Text>
        </TouchableHighlight>

        {this.state.isLoading &&
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        }
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    AsyncStorage.getItem('email').then((email) => {
      this.setState({ email });
    });

    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        fetch(server + "/login/verify", {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token
          })
        })
          .then(r => r.json())
          .then(r => {
            this.setState({ isLoading: false });
            if (r.result == '1') {
              Global.token = token;
              this.props.navigation.navigate('MainMenu', { token });
            }
          })
          .catch((e) => {
          });
      }
    });
  }

  componentWillUnmount() {
  }

  onLoginPress() {
    if (this.state.email && this.state.password) {
      fetch(server + "/login", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        })
      })
        .then(r => r.json())
        .then(r => {
          this.setState({ isLoading: false });
          // console.log(r);
          try {
            if (r.token) {
              Keyboard.dismiss();
              if (this.state.remember) {
                Global.token = r.token;
                AsyncStorage.setItem('email', this.state.email).then(() => {
                  AsyncStorage.setItem('token', r.token).then(() => {
                    this.props.navigation.navigate('MainMenu', { token: r.token });
                  });
                });
              } else {
                this.props.navigation.navigate('MainMenu', { token: r.token });
              }
            } else {
              this.loginError();
            }
          } catch (e) {
            this.loginError();
          }
        }).catch((e) => {
          this.loginError();
        });
    }
  }

  loginError() {
    this.setState({ loginError: 'Dados de login inválidos' });
  }

  // async onFbLoginPress() {
  //   const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(appId, {
  //     permissions: ['public_profile', 'email'],
  //   });
  //   if (type === 'success') {
  //     const response = await fetch(
  //       `https://graph.facebook.com/me?access_token=${token}`);
  //     Alert.alert(
  //       'Logged in!',
  //       `Hi ${(await response.json()).name}!`,
  //     );
  //   }
  // }
}