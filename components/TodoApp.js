/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';
import StatusButton from './StatusButton';
import TodoList from './TodoList';
import TodoListFooter from './TodoListFooter';
import React, { Component } from 'react';
import Relay from 'react-relay'; 
import {
  Platform,
  View, 
  Text, 
} from 'react-native';

import RelaySubscriptions from 'relay-subscriptions';

import AddTodoSubscription from '../subscriptions/AddTodoSubscription';
import RemoveTodoSubscription from '../subscriptions/RemoveTodoSubscription';

import { Container } from 'native-base';

class TodoApp extends Component {
  static navigationOptions = {
    title: 'Todos',
  }
  constructor(props, context) {
    super(props, context);
    this._handleStatusChange = this._handleStatusChange.bind(this);
  }
  _handleStatusChange(status) {
    this.props.relay.setVariables({status});
  }
  render() {
    return (
      <Container style={styles.container}>
        <Text style={styles.header}>todos</Text>
        <View style={styles.actionList}>
          <StatusButton
            active={this.props.relay.variables.status === 'any'}
            onPress={this._handleStatusChange.bind(null, 'any')}>
            All
          </StatusButton>
          <StatusButton
            active={this.props.relay.variables.status === 'active'}
            onPress={this._handleStatusChange.bind(null, 'active')}>
            Active
          </StatusButton>
          <StatusButton
            active={this.props.relay.variables.status === 'completed'}
            onPress={this._handleStatusChange.bind(null, 'completed')}>
            Completed
          </StatusButton>
        </View>
        <TodoList
          status={this.props.relay.variables.status}
          style={styles.list}
          viewer={this.props.viewer}
        />
        <TodoListFooter
          status={this.props.relay.variables.status}
          style={styles.footer}
          viewer={this.props.viewer}
        />
      </Container>
    );
  }
}

const TodoAppContainer = RelaySubscriptions.createContainer(TodoApp, {
  initialVariables: {
    status: 'any',
  },
  fragments: {
    viewer: variables => Relay.QL`
      fragment on User {
        totalCount
        ${TodoList.getFragment('viewer', {status: variables.status})}
        ${TodoListFooter.getFragment('viewer', {status: variables.status})}
        ${AddTodoSubscription.getFragment('viewer')}
        ${RemoveTodoSubscription.getFragment('viewer')}
      }
    `,
  },
  subscriptions: [
    ({ viewer }) => new AddTodoSubscription({ viewer }),
    ({ viewer }) => new RemoveTodoSubscription({ viewer }),
  ],
});

export default TodoAppContainer;

const styles = {
  container: {
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignSelf: 'center',
    color: 'rgba(175, 47, 47, 0.15)',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    fontSize: 100,
    fontWeight: '100',
  },
  actionList: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  footer: {
    paddingHorizontal: 15,
  },
  list: {
    borderTopColor: 'rgba(0,0,0,0.1)',
    borderTopWidth: 1,
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {
      height: -2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
};
