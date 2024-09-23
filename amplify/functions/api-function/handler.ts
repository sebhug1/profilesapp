import type { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

const handleGet = async (event: any): Promise<APIGatewayProxyResult> => {
  console.log("GET request", event);
  // Implement your GET logic here
  return {
    statusCode: 200,
    headers: getCorsHeaders(),
    body: JSON.stringify({ message: "This is a GET request" }),
  };
};

const handlePost = async (event: any): Promise<APIGatewayProxyResult> => {
  console.log("POST request", event);
  // Implement your POST logic here
  const body = JSON.parse(event.body || '{}');
  return {
    statusCode: 200,
    headers: getCorsHeaders(),
    body: JSON.stringify({ message: "This is a POST request", receivedData: body }),
  };
};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Received event", event);

  try {
    switch (event.httpMethod) {
      case "GET":
        return await handleGet(event);
      case "POST":
        return await handlePost(event);
      default:
        return {
          statusCode: 405,
          headers: getCorsHeaders(),
          body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  };
}
