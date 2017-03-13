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

export class User {}

// Mock authenticated ID
const VIEWER_ID = 'me';

// Mock user data
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer,
};

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const TodoModel = mongoose.model('TodoModel', { text: String, complete: Boolean });
//addTodo('hello', false);

const notifiers = [];

export function notifyChange(topic, data) {
  // Delay the change notification to avoid the subscription update hitting the
  // client before the mutation response.
  setTimeout(() => {
    notifiers.forEach(notifier => notifier({ topic, data }));
  }, 100);
}

export function addNotifier(cb) {
  notifiers.push(cb);

  return () => {
    const index = notifiers.indexOf(cb);
    if (index !== -1) {
      notifiers.splice(index, 1);
    }
  };
}

export function addTodo(text, complete) {
  console.log('addTodo');
  let todo = new TodoModel({ text: text, complete: !!complete });
  return new Promise((resolve, reject) => {
    todo.save().then(todo => {
      notifyChange('add_todo', todo.toObject({ getters: true }));//The todo passed to notifyChange function will be used by 'graphql-relay-subscription', it is required to be plain object.
      resolve(todo);
    });
  });
}

export function changeTodoStatus(id, complete) {
  console.log('changeTodoStatus');
  return new Promise((resolve, reject) => {
    TodoModel.findOneAndUpdate({_id: id}, {$set: {complete: !!complete}}, {new: true}).then(todo => {
      notifyChange(`update_todo_${id}`, todo.toObject({ getters: true }));
      resolve(todo);
    });
  });
}

export function renameTodo(id, text) {
  console.log('renameTodo');
  return new Promise((resolve, reject) => {
    TodoModel.findOneAndUpdate({_id: id}, {$set: {text: text}}, {new: true}).then(todo => {
      notifyChange(`update_todo_${id}`, todo.toObject({ getters: true }));
      resolve(todo);
    });
  });
}

export function getTodo(id) {
  console.log('getTodo');
  return TodoModel.findById(id).exec();
}

export function getTodos(status = 'any') {
  console.log('getTodos:' + status);
  if (status === 'any') {
    return TodoModel.find({}).exec();
  } 
  return TodoModel.find({complete: (status === 'completed')}).exec();
}

export function getUser(id) {
  console.log('getUser');
  return usersById[id];
}

export function getViewer() {
  console.log('getViewer');
  return getUser(VIEWER_ID);
}

export function markAllTodos(complete) {
  console.log('markAllTodos');
  return new Promise((resolve, reject) => {
    TodoModel.find({}, (err, todos) => {
      if (err) {
        reject(err)
        return
      }

      if (!todos) {
        reject('NOT found')
        return
      } else {
        todos.forEach(todo => {
          if (todo.complete !== complete) {
            todo.complete = complete;
            todo.save();
          }
        });
        resolve(todos.map(todo => todo.id));
      }
    })
  });
}

export function removeTodo(id) {
  console.log('removeTodo');
  TodoModel.findByIdAndRemove(id).then(_ => {
    notifyChange('delete_todo', { id });
  });  
}

export function removeCompletedTodos() {
  console.log('removeCompletedTodos');
  return new Promise((resolve, reject) => {
    TodoModel.find({complete: true}, (err, todos) => {
      if (err) {
        reject(err)
        return
      }
      if (!todos) {
        reject('NOT found')
        return
      }
      TodoModel.remove({complete: true}).exec();
      resolve(todos.map(todo => todo.id));
    });
  });
}
