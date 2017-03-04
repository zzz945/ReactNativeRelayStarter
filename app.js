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
  DefaultNetworkLayer,
} from 'react-relay';
import Home from './components/Home';
import TodoApp from './components/TodoApp'

Relay.injectNetworkLayer(
  new DefaultNetworkLayer('http://localhost:8080/graphql')
);

const SimpleApp = StackNavigator({
  Home: { screen: Home },
  TodoApp: { screen: TodoApp },
}, {
  initialRouteName: 'Home',
});

export default SimpleApp;