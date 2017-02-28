import React from 'react';
import Relay from 'react-relay';
import {
    Button,
} from 'react-native';

export default class MyHomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('TodoApp')}
        title="Navigate to Todos"
      />
    );
  }
}
