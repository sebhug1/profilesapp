import React, { useState, useEffect } from "react";
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

export default function InputForm() {
    const [user, setUser] = useState({ helmet_id: "", force: "", direction: "" });
    const [formDatas, setFormDatas] = useState([]);

    const fetchFormDatas = async () => {
      const { data: items, errors } = await client.models.FormData.list();
      console.log(items);
      setFormDatas(items);
    };
  
    useEffect(() => {
      fetchFormDatas();
    }, []);
  
    const handleCreateFormData = async (userData) => {
        const success = await createFormData(userData.helmet_id, userData.force, userData.direction);
        if (success) {
          console.log("FormData created successfully");
          fetchFormDatas();
        } else {
          console.log("Failed to create todo or operation cancelled");
        }
      };
      const createFormData = async (helmet_id, force, direction) => {
        if (helmet_id && force && direction) {
          try {
            await client.models.FormData.create({
            helmet_id: helmet_id,
            force: force,
            direction: direction,              
            isDone: false,
            });
            return true; // Indicate success
          } catch (error) {
            console.error('Error creating todo:', error);
            return false; // Indicate failure
          }
        }
        return false; // No content provided
      };

    const handleChange = (event) => {
      setUser({ ...user, [event.target.name]: event.target.value });
    };
    const handleSubmit = (event) => {
      event.preventDefault();
      handleCreateFormData(user);
        // Clear the form inputs
        console.log("user created", user);
        setUser({ helmet_id: "", force: "", direction: "" });
    };
    return (
      <div className="container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="helmet_id">Helmet Id</label>
            <input
              type="text"
              name="helmet_id"
              value={user.helmet_id}
              onChange={handleChange}
              autoComplete="off"
            /> 
            <label htmlFor="force">Force</label>
            <input
              type="force"
              name="force"
              value={user.force}
              onChange={handleChange}
              autoComplete="off"
            />
            <label htmlFor="direction">Direction</label>
            <input
              type="direction"
              name="direction"
              value={user.direction}
              onChange={handleChange}
              autoComplete="off"
            />
            <div className="submit-btn">
              <button type="submit">Submit</button>
              <div>
      {/* <button onClick={createTodo}>Add new todo</button> */}
      <ul>
        {formDatas.map(({ id, helmet_id, force, direction, createdAt}) => (
          <li key={id}>Helmet Id: {helmet_id} - Force: {force} - Direction: {direction} - Created at: {createdAt}</li>
        ))}
      </ul>
    </div>
            </div>
          </form>
        </div>
      </div>
    );
  }