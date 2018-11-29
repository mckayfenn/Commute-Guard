import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, AsyncStorage } from "react-native";
import Device from "./Device";

export default class Devices extends Component {
  devices = [];

  componentWillMount() {
    this.setState({devices: []});
    this.getItems("BAMDevices").then((values) => {
      if (values == null) {
        console.log("shouldn't be null");
      }
      else {
        this.devices = values;
        this.setState({devices: this.devices});
      }     
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error.message);
    }); 
  }

  async getItems(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  onPress = key => {
    const device = this.devices.find(item => {
      return item.key === key;
    });
    device.selected = !device.selected;
    this.storeItem("BAMDevices", this.devices);
    // AsyncStorage.setItem("BAMDevices", JSON.stringify(this.devices));
  };

  static navigationOptions = {
    title: 'Devices',
  };
 
  render() {
    console.log(this.state.devices);
    return (
      <View style={styles.outContainer}>
      <View style={styles.container}>
        <FlatList
          data={this.state.devices}
          // keyExtractor={(item) => {item.index}}
          renderItem={({ item }) => { 
            return (
            <Device  
              // key={item.index}
              name={item.name}
              accessToken={item.key}
              onPress={this.onPress}
              selected={item.selected}
            />
          )}}
        />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outContainer: {
    flex: 1,
    backgroundColor: '#D3D3D3'
  },
  container: {
    flex: 1,
    marginTop: 40,
    
    // borderColor: '#D3D3D3',
    borderTopWidth: 1,
    backgroundColor: '#D3D3D3'
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 5
  },
  headerText: {
    fontSize: 30
  }
});
