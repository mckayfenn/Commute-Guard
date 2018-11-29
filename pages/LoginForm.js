import React, { Component, Keyboard } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Button,
  StyleSheet,
  Statu,
  AsyncStorage,
  KeyboardAvoidingView
} from "react-native";
import { createStackNavigator } from "react-navigation";

export default class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      locationName: "",
      accessCode: "",
    };
  }

  devices = [];

  origin = false;

  componentWillMount() {
    this.origin = this.props.navigation.getParam(
      "fromButton",
      false
    );
  }

  removeAll = async () => {
    await AsyncStorage.multiRemove(["BAMDevices"]);
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
          this.devices = values;
          let { replace } = this.props.navigation;
          replace("ButtonScreen");
        }
      })
      .catch(error => {
        console.log("Promise is rejected with error: " + error.message);
      });
  };

  showKeyAlert() {
    Alert.alert(
      "Alert",
      "Duplicate access code detected.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  showFieldAlert() {
    Alert.alert(
      "Alert",
      "Empty fields detected.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  addDeviceEntry = async () => {
    if (this.state.locationName == "" || this.state.accessCode == "" || this.state.phone == "") {
      this.showFieldAlert();
    } else {
      this.getItems("BAMDevices")
        .then(values => {
          if (values == null) {
            console.log("shouldn't be null");
          } else {
            console.log("exists and saving...");
            // checking for unique key
            if (
              values.find(value => {
                return value.key === this.state.accessCode;
              })
            ) {
              // alert user for duplicate accessKey
              this.showKeyAlert();
            } else {
              this.devices = values;
              let item = {
                name: this.state.locationName,
                key: this.state.accessCode,
                selected: true
              };
              this.devices.push(item);

              this.storeItem("BAMDevices", this.devices)
                .then(values => {
                  console.log("stored new values");
                  if (this.origin) {
                    let { goBack } = this.props.navigation;
                    goBack();
                  } else {
                    let { replace } = this.props.navigation;
                    replace("ButtonScreen");
                  }
                })
                .catch(error => {
                  console.log("Save error");
                });
            }
          }
        })
        .catch(error => {
          console.log("Promise is rejected with error: " + error.message);
        });
    }
  };

  async getItems(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  static navigationOptions = {
    title: "Home"
  };

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image 
          source={{uri: 'https://i.imgur.com/Q0Zjvny.png'}} 
          style={{width: 300, height: 300, padding: 40}} />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onChangeText={value => this.setState({ locationName: value })}
          onSubmitEditing={() => this.phoneInput.focus()}
          autoCorrect={true}
          keyboardType="email-address"
          returnKeyType="next"
          placeholder="Echo location name"
          placeholderTextColor="rgba(100,100,100,0.7)"
        />

        <TextInput
          style={styles.accessInput}
          returnKeyType="go"
          ref={input => (this.passwordInput = input)}
          onChangeText={value => this.setState({ accessCode: value })}
          blurOnSubmit={true}
          multiline={true}
          placeholder="Access code"
          onSubmitEditing={this.addDeviceEntry}
          placeholderTextColor="rgba(100,100,100 ,0.7)"
        />

        
        { this.origin ?
        <TouchableOpacity style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[styles.buttonContainerHalf, { marginRight: 5 }]}
            onPress={this.addDeviceEntry}
          >
            <Text style={styles.buttonText}>ADD DEVICE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ styles.buttonContainerHalf, { marginLeft: 5 } ]}
            onPress={this.goBack}
          >
            <Text style={styles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        :
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.addDeviceEntry}
          >
            <Text style={styles.buttonText}>ADD DEVICE</Text>
          </TouchableOpacity>
        }
        <View style={styles.spacing} />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.removeAll}
        >
          <Text style={styles.buttonText}>REMOVE ALL</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  spacing: {
    height: 10
  },
  container: {
   alignItems: 'center',
   justifyContent: 'center',
   flexGrow: 1,
   backgroundColor: '#D3D3D3',
  },
  input: {
    height: 40,
    backgroundColor: "rgba(152, 175, 199,0.5)",
    width: 300,
    marginBottom: 10,
    padding: 10,
    color: "#fff"
  },
  accessInput: {
    backgroundColor: "rgba(152, 175, 199,0.5)",
    width: 300,
    marginBottom: 10,
    padding: 10,
    color: "#fff"
  },
  buttonContainer: {
    backgroundColor: "#2980b6",
    paddingVertical: 15,
    width: 300
  },
  buttonContainerHalf: {
    backgroundColor: "#2980b6",
    paddingVertical: 15,
    width: 145
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  }
});
