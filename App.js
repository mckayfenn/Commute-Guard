import React, { Component } from "react";
//import Login Component
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from "react-native";
import { createStackNavigator } from "react-navigation";

//import Login Component
// import Login from './pages/Login';
import LoginForm from "./pages/LoginForm";
import Devices from "./pages/Devices";
import Device from "./pages/Device";
import ButtonScreen from "./pages/ButtonScreen.js";

const NewbStack = createStackNavigator(
  {
    Home: {
      screen: LoginForm,
      navigationOptions: {
        header: null
      }
    },
    Devices: { screen: Devices },
    ButtonScreen: {
      screen: ButtonScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "Home"
  }
);

const UsedStack = createStackNavigator(
  {
    Home: {
      screen: LoginForm,
      navigationOptions: {
        header: null
      }
    },
    Devices: { 
      screen: Devices,
      navigationOptions: {
        header: null
      } 
    },
    ButtonScreen: {
      screen: ButtonScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "ButtonScreen"
  }   
);

export default class App extends React.Component {

  componentWillMount() {
    this.setState({devices: []});
    this.getItems("BAMDevices")
      .then(values => {
        if (values == null) {
          this.storeItem("BAMDevices", [])
            .then(values => {
              console.log("saved new empty array");
            })
            .catch(error => {
              console.log("Save error");
            });
        } else {
          this.setState({devices: values});
        }
      })
      .catch(error => {
        console.log("Promise is rejected with error: " + error.message);
      });
  }

  async getItems(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log("couldn't get items");
    }
    return;
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log("couldnt store items");
    } 
  }

  render() {
    // has local entries
    console.log(this.state.devices.length); 
    if (this.state.devices.length > 0) {
      return (<UsedStack/>);
    }
    // no local entries
    else {
      return <NewbStack />;
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50"
  },
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: "#2c3e50"
  }
});
