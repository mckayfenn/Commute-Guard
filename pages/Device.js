import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

export default class Device extends Component {

  state = {
    selected: this.props.selected
  }

  onItemPress = () => {
    this.setState({ selected: !this.state.selected });
    this.props.onPress(this.props.accessToken);
  }

  render() {
    return (
      <TouchableHighlight underlayColor="#aaa" onPress={this.onItemPress}>
        <View style={styles.container}>
          <View style={styles.checkBox}>
            {this.state.selected ? <View style={styles.checkBoxCenter} /> : null}
          </View>
          <View style={styles.deviceText}>
            <Text style={styles.item}>{this.props.name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = {
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(152, 175, 199,0.5)"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  deviceText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10
  },
  checkBox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  },
  checkBoxCenter: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#000"
  }
};
