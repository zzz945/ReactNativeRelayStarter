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
addTodo('hello', false);

export function addTodo(text, complete) {
  console.log('addTodo');
  let todo = new TodoModel({ text: text, complete: !!complete });
  return todo.save();
}

export function changeTodoStatus(id, complete) {
  console.log('changeTodoStatus');
  return TodoModel.findOneAndUpdate({_id: id}, {$set: {complete: !!complete}}).exec();
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

export async function markAllTodos(complete) {
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
        console.log(todos.length);
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
  TodoModel.findByIdAndRemove(id).exec();
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

export function renameTodo(id, text) {
  console.log('renameTodo');
  TodoModel.findOneAndUpdate({_id: id}, {$set: {text: text}}).exec();
}
