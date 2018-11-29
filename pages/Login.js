import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import LoginForm from './LoginForm';

export default class Login extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <LoginForm navigate={ navigate } />
          </View>
        </View>
    )
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#2c3e50',
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#2c3e50',
  }
})