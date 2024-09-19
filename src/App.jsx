// import { useState, useEffect } from "react";
// import {
//   Button,
//   Heading,
//   Flex,
//   View,
//   Grid,
//   Divider,
// } from "@aws-amplify/ui-react";
// import { useAuthenticator } from "@aws-amplify/ui-react";
// import { Amplify } from "aws-amplify";
// import "@aws-amplify/ui-react/styles.css";
// import { generateClient } from "aws-amplify/data";
// import outputs from "../amplify_outputs.json";
// /**
//  * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
//  */

// Amplify.configure(outputs);
// const client = generateClient({
//   authMode: "userPool",
// });

// export default function App() {

//   const [userprofiles, setUserProfiles] = useState([]);
//   const { signOut } = useAuthenticator((context) => [context.user]);

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   async function todoList() {
//     const createTodo = await client.models.Todo.create({
//       content: window.prompt("Todo content?"),
//       isDone: false
//     })
//   }
 
//   // async function TodoList() {
//   //   const createTodo = async () => {
//   //     console.log("Test");
//   //      await client.models.Todo.create({
//   //        content: window.prompt("Todo content?"),
//   //        isDone: false
//   //      })
//   //   }
    
//   async function fetchUserProfile() {
//     const { data: profiles } = await client.models.UserProfile.list();
//     setUserProfiles(profiles);
//   }
//   return (
//     <Flex
//       className="App"
//       justifyContent="center"
//       alignItems="center"
//       direction="column"
//       width="70%"
//       margin="0 auto"
//     >
//       <Heading level={1}>My Profile</Heading>

//       <Divider />

//       <Grid
//         margin="3rem 0"
//         autoFlow="column"
//         justifyContent="center"
//         gap="2rem"
//         alignContent="center"
//       >
//         {userprofiles.map((userprofile) => (
//           <Flex
//             key={userprofile.id || userprofile.email}
//             direction="column"
//             justifyContent="center"
//             alignItems="center"
//             gap="2rem"
//             border="1px solid #ccc"
//             padding="2rem"
//             borderRadius="5%"
//             className="box"
//           >
//             <View>
//               <Heading level="3">{userprofile.email}</Heading>
//             </View>
//           </Flex>
//         ))}
//       </Grid>
//       <Button onClick={signOut}>Sign Out</Button>
//       <Button onClick={todoList}>Add new todo</Button>

//     </Flex>
//   );
// }
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import Home from "./Home"; // Import the Home component

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  async function todoList() {
    const createTodo = await client.models.Todo.create({
      content: window.prompt("Todo content?"),
      isDone: false
    });
  }

  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

  return (
    <Router>
      <Flex
        className="App"
        justifyContent="center"
        alignItems="center"
        direction="column"
        width="70%"
        margin="0 auto"
      >
        <Heading level={1}>My Profile</Heading>
        <Divider />
        <nav>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <Grid
              margin="3rem 0"
              autoFlow="column"
              justifyContent="center"
              gap="2rem"
              alignContent="center"
            >
              {userprofiles.map((userprofile) => (
                <Flex
                  key={userprofile.id || userprofile.email}
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  gap="2rem"
                  border="1px solid #ccc"
                  padding="2rem"
                  borderRadius="5%"
                  className="box"
                >
                  <View>
                    <Heading level="3">{userprofile.email}</Heading>
                  </View>
                </Flex>
              ))}
            </Grid>
          } />
        </Routes>
        <Button onClick={signOut}>Sign Out</Button>
        <Button onClick={todoList}>Add new todo</Button>
      </Flex>
    </Router>
  );
}
