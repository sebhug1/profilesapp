import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Todo.list();
    setTodos(items);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false,
    });

    fetchTodos();
  }
  const clearAllTodos = async () => {
    try {
      const { data: allTodos } = await client.models.Todo.list();
      
      // Delete all todos
      await Promise.all(allTodos.map(todo => 
        client.models.Todo.delete({ id: todo.id })
      ));

      // Clear the local state
      setTodos([]);
      console.log("All todos cleared successfully");
    } catch (error) {
      console.error("Error clearing todos:", error);
    }
  };
  return (
    <div>
     <button onClick={createTodo}>Add new todo</button>
     <button onClick={clearAllTodos}>Delete all todos</button>
     <ul>
        {todos.map(({ id, content }) => (
          <li key={id}>{content}</li>
        ))}
      </ul>
    </div>
  );
}