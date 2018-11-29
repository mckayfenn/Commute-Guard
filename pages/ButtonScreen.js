import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
  StyleSheet,
  Statu,
  Dimensions,
  Image,
  AsyncStorage
} from "react-native";

const blank = require('../assets/blank.png');
// const cancel = {{uri: 'https://i.imgur.com/5aFej6X.png'}};

const NUM_SECONDS = 5;

export default class ButtonScreen extends Component {
  timer = null;

  state = {
    number: NUM_SECONDS,
    message: null,
    active: false
  };

  getItems = async key => {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return;
  };

  sendAlert = async (accessCode) => {
    console.log("sending alert to echo");
    try {
      const response = await fetch(
        `https://api.notifymyecho.com/v1/NotifyMe?notification=Commute%20guard%20activated%20alert!&accessCode=${accessCode}`
      );
      if (response.ok) {
        console.log("this was ok");
        return true;
      } else {
        console.log("this was not ok");
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  sendAlertWrapper = async () => {
    console.log('send alert wrapper');
    const items = await this.getItems("BAMDevices");
    if (items == null) {
      console.log("shouldn't be null");
    } else {
      let success = true;
      items.forEach(item => {
        console.log('this is: ' + item.key);
        this.sendAlert(item.key).then((res) => {
          success = success && res;
        });
      });
      this.setState({
        active: false,
        message: success ? "ALERT SENT" : "ALERT FAILED"
      });
    }
  }

  navigateToDevices = () => {
    this.props.navigation.navigate("Devices");
  };

  addDevice = () => {
    this.props.navigation.navigate("Home", { fromButton: true });
  };

  startTimer = () => {
    this.timer = setInterval(this.decrement, 1000);
    this.setState({
      number: NUM_SECONDS,
      message: null,
      active: true
    });
  };

  decrement = () => {
    const num = this.state.number - 1;
    if (num === -1) {
      this.stopTimer();
      this.sendAlertWrapper();
    } else {
      this.setState({
        number: num
      });
    }
  };

  stopTimer = () => {
    clearInterval(this.timer);
    this.setState({
      number: NUM_SECONDS,
      active: false
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={this.addDevice}>
            <Image
              style={styles.addButton}
              source={{uri: 'https://i.imgur.com/z4c6x8H.png'}}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.stopTimer}>
            <Image
              style={styles.addButton}
              source={{
                uri: this.state.active
                  ? 'https://i.imgur.com/5aFej6X.png'
                  : blank
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.navigateToDevices}>
            <Image
              style={styles.addButton}
              source={{uri: 'https://i.imgur.com/dVO4F0Z.png'}}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.countContainer]}>
          <Text style={[styles.countText]}>
            {this.state.message ? this.state.message : this.state.number}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            disabled={this.state.alertSent}
            style={styles.buttonContainer}
            onPressIn={this.stopTimer}
            onPressOut={this.startTimer}
          >
            <Text style={styles.buttonText}>HOLD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#D3D3D3",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  countContainer: {
    justifyContent: "space-between"
  },
  buttonContainer: {
    backgroundColor: "#2980b6",
    borderRadius:
      Math.round(
        Dimensions.get("window").width + Dimensions.get("window").height
      ) / 2,
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 30
  },
  countText: {
    color: "#ff0000",
    textAlign: "center",
    fontSize: 100
  },
  addButton: {
    width: 50,
    height: 50,
    marginLeft: 50,
    marginRight: 50
  }
});
