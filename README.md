# React Native / Relay TodoMVC

## Installation (Make sure MongoDB is installed: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

```
npm install -g react-native-cli && npm install
```

## Running

### Start the GraphQL server:

```
mongod  # run MongoDB local
npm start   # run GraphQL server local
```

## Test the server

```
open http://localhost:8080 to test MongoDB and GraphQL server
```

### Run on simulator:

```
ios: react-native run-ios
android: adb reverse tcp:8080 tcp:8080  # forward requests from the device to your computer
         react-native run-android
```

## Developing

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm run update-schema
npm start
```

## License

    This file provided by Facebook is for non-commercial testing and evaluation
    purposes only.  Facebook reserves all rights not expressly granted.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
