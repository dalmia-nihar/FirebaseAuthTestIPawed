import React, { Component } from 'react';
import { StyleSheet, Text, View, AppRegistry, Button, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import * as firebase from 'firebase'

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager, 
  AccessToken
} = FBSDK;




export default class UserLoginScreen extends Component {

  state = {
    email: '',
    password: '',
    authenticating: false,
    user: null,
    error: '',
  }

  componentDidMount(){
    const firebaseConfig = {
      apiKey: 'AIzaSyAf_7aaE6f-nYrHcjEHnd09U6HxiCK5LUw',
      authDomain: 'fir-authtest-49464.firebaseapp.com',
      databaseURL: "https://fir-authtest-49464.firebaseio.com",
    }

    firebase.initializeApp(firebaseConfig);
  }

  onPressSignIn() {
    this.setState({
      authenticating: true,
    });

    const { email, password } = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => this.setState({
        authenticating: false,
        user,
        error: '',
      }))
      .catch(() => {
        // Login was not successful
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => this.setState({
            authenticating: false,
            user,
            error: '',
            // console.log("Created New User")
          }))
          .catch(() => this.setState({
            authenticating: false,
            user: null,
            error: 'Authentication Failure',
            // console.log("Log in error")
          }))
      })
  }

  onPressFacebookSignIn() {
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
    function(result) {
      if (result.isCancelled) {
        alert('Login cancelled');
      } else {
        
        AccessToken.getCurrentAccessToken().then((AccessTokenData) => {
          const credential = firebase.auth.FacebookAuthProvider.credential(AccessTokenData.accessToken)
          firebase.auth().signInWithCredential(credential).then((result) => {


          }, (error) => {
            console.log(error)
          })
        }, (error) => {
          console.log("Some error occured: " + error)
        })
      }
    },
    function(error) {
      alert('Login fail with error: ' + error);
    }
  );
  }


  renderCurrentState() {
    if (this.state.authenticating) {
      return (
        <View style={styles.form}>
          <ActivityIndicator size='large' />
        </View>
      )
    }

    if (this.state.user !== null) {
      console.log(this.state.user);
      return (
        <View >
          <Text>Logged In</Text>
                 
        </View>
      )
    }

    if (this.state.error !== '') {
      return (
        <View >
          <Text>{this.state.error}</Text>          
        </View>
      )
    }

    return (
      <View>
        <View>
            <Text style={styles.descriptionText}>
              {"Please enter your email address\nand create a password:\n"}
            </Text>
            <View style={styles.formContainer}>
              <TextInput
                style={styles.formTextInput}
                placeholder="Name"
                placeholderTextColor='grey'
              />
              <View style={{borderColor: 'lightgrey', borderWidth: 1, alignSelf:'stretch'}}/>
              <TextInput
                style={styles.formTextInput}
                placeholder="E-mail address"
                placeholderTextColor='grey'
                keyboardType='email-address'
                onChangeText={email => this.setState({ email })}
                value={ this.state.email }
              />
              <View style={{borderColor: 'lightgrey', borderWidth: 1, alignSelf:'stretch'}}/>
              <TextInput
                style={styles.formTextInput}
                placeholder="Password"
                placeholderTextColor='grey'
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
                value={ this.state.password }
              />
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={ () => this.onPressSignIn() }>
              <Text style={styles.textButtonStyle}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={ () => this.onPressFacebookSignIn() }>
              <Text style={styles.textButtonStyle}>
                Facebook Login
              </Text>
            </TouchableOpacity>
          </View>

        </View>
    )

  }



  render() {
    return (
      <View style={styles.screenContainer}>
        
        {this.renderCurrentState()}
    
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    alignSelf: 'stretch',
    justifyContent: 'space-around'
  },
  logoStyle: {
    width:150,
    height:150
  },
  descriptionText: {
    color: 'black',
    fontSize: 14,
    marginHorizontal: 30,
    textAlign: 'center',
    // fontFamily: 'Century Gothic'
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'lightgrey',
    backgroundColor: '#F0F0F0',
    borderRadius: 7,
  },
  formTextInput: {
    height: 40,
    width: 200,
    fontSize: 14,
    // fontFamily: 'Century Gothic'
  },
  buttonStyle: {
    width: 130,
    backgroundColor: '#5AC8B0',
    borderRadius: 7,
    shadowOffset:{height: 2},
    shadowColor: 'grey',
    shadowOpacity: 1.0,
    shadowRadius: 2
  },
  textButtonStyle: {
    margin: 8,
    textAlign: 'center',
    fontSize: 13,
    color: 'white',
    // fontFamily: 'Century Gothic'
  }
});
