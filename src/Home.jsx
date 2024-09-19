import React from 'react';
import { Heading } from "@aws-amplify/ui-react";

function Home() {
  return (
    <div>
      <Heading level={2}>Welcome to the Home Page</Heading>
      <p>This is the content of your Home page.</p>
    </div>
  );
}

export default Home;
