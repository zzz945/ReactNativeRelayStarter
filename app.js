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

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import Relay, {
  DefaultNetworkLayer, Renderer
} from 'react-relay';
import Home from './components/Home';
import TodoApp from './components/TodoApp'

import RelaySubscriptions from 'relay-subscriptions';
import NetworkLayer from './relay/NetworkLayer';
import TodoAppRoute from './relay/TodoAppRoute';

const envWithSubscription = new RelaySubscriptions.Environment();
envWithSubscription.injectNetworkLayer(new NetworkLayer('http://localhost:8080/graphql'));

class HomeRelayRootContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.route = new TodoAppRoute({status: 'any'}, this.props.navigation);
  }
  render() {
    return (
      <Renderer
        Container={Home}
        queryConfig={this.route}
        environment={envWithSubscription}
      />
    );
  }
} 

class TodoAppRelayRootContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.route = new TodoAppRoute({status: 'any'});
    this.route.navigation = this.props.navigation;
  }
  render() {
    return (
      <Renderer
        Container={TodoApp}
        queryConfig={this.route}
        environment={envWithSubscription}
      />
    );
  }
}

const AppNavigator = StackNavigator({
  Home: { screen: HomeRelayRootContainer },
  TodoApp: { screen: TodoAppRelayRootContainer },
}, {
  initialRouteName: 'TodoApp',
});

export default AppNavigator;
