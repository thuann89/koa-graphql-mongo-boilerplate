const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql');
const { TodoType } = require('./types');
const mongoose = require('mongoose');
const Todo = mongoose.model('Todo');

exports.mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
      addTodo: {
          type: TodoType,
          description: 'Add a Todo',
          args: {
            text: {
              name: 'Todo title',
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: (parentValue, {text}) => {            
            const todo = new Todo({
              text,
            });              
            return todo.save()
              .then(res => res)
              .catch(e => Promise.reject());
          }
      },
      toggleDismiss: {
        type: TodoType,
        description: 'Toggle dismiss a todo task',
        args: {
          id: {
            name: 'Todo Id',
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve: async (parentValue, {id}) => {
          
          const todo = await Todo.findById(id);

          if(!todo) return Promise.reject;
          const changedTodo = {
            dismissed: !todo.dismissed,
            updatedAt: !todo.dismissed ? new Date() : null
          }
          
          return Todo.findByIdAndUpdate(id, { $set: changedTodo }, { new: true })
            .then(todo => todo)
            .catch(e => Promise.reject());
        }
      },
      removeTodo: {
        type: TodoType,
        description: 'Delete a todo',
        args: {
          id: {
            name: 'Todo Id',
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve: async (parentValue, {id}) => {
          return Todo.findByIdAndRemove(id)
            .then(todo => todo)
            .catch(e => Promise.reject());
        }
      }
    }
});
