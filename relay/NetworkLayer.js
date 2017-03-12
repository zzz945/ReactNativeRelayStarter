/* eslint-disable no-console */

import Relay from 'react-relay';
import io from 'socket.io-client';

class NetworkLayer extends Relay.DefaultNetworkLayer {
  constructor(...args) {
    super(...args);
    console.log('NetworkLayer');

    //window.navigator.userAgent = 'ReactNative';
    this._socket = io('http://localhost:8080', {
      transports: ['websocket'] // you need to explicitly tell it to use websockets
    });

    this._requests = Object.create(null);

    this._socket.on('subscription update', ({ id, data, errors }) => {
      console.log('subscription update');
      console.log({ id, data, errors });
      const request = this._requests[id];
      if (!request) {
        return;
      }

      if (errors) {
        request.onError(errors);
      } else {
        request.onNext(data);
      }
    });

    this._socket.on('subscription closed', (id) => {
      const request = this._requests[id];
      if (!request) {
        return;
      }

      console.log(`Subscription ${id} is completed`);
      request.onCompleted();
      delete this._requests[id];
    });

    this._socket.on('error', (error) => {
      Object.values(this._requests).forEach((request) => {
        request.onError(error);
      });
    });
  }

  sendSubscription(request) {
    console.log('sendSubscription');
    const id = request.getClientSubscriptionId();
    this._requests[id] = request;

    this._socket.emit('subscribe', {
      id,
      query: request.getQueryString(),
      variables: request.getVariables(),
    });

    return {
      dispose: () => {
        console.log(`disposing ${request.getDebugName()}:${id}`);
        this._socket.emit('unsubscribe', id);
      },
    };
  }

  disconnect() {
    this._socket.disconnect();

    this._requests.forEach(request => {
      request.onCompleted();
    });
  }
}

export default NetworkLayer;
