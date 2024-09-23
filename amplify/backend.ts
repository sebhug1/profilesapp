import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { Stack, aws_lambda, aws_iam } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { myApiFunction } from "./functions/api-function/resource";
import { myHelmetApiFunction } from "./functions/helmet-api/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
// defineBackend({
//   auth,
//   data
// });

const backend = defineBackend({
  auth,
  data,
  myApiFunction,
  myHelmetApiFunction
});

// create a new API stack
const apiStack = backend.createStack("api-stack");

// create a new REST API
const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "myRestApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// create a new Lambda integration
const lambdaIntegration = new LambdaIntegration(
  backend.myApiFunction.resources.lambda
);
// create a new resource path with IAM authorization
const itemsPath = myRestApi.root.addResource("items", {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.IAM,
  },
});

// add methods you would like to create to the resource path
itemsPath.addMethod("GET", lambdaIntegration);
itemsPath.addMethod("POST", lambdaIntegration);
itemsPath.addMethod("DELETE", lambdaIntegration);
itemsPath.addMethod("PUT", lambdaIntegration);

// let cfnPermission = new aws_lambda.CfnPermission(apiStack, "ApiLambdaPermission", {
//   action: "lambda:InvokeFunction",
//   functionName: backend.myApiFunction.resources.lambda.functionArn,
//   principal: "apigateway.amazonaws.com",
//   sourceArn: `arn:aws:execute-api:${Stack.of(apiStack).region}:${
//     Stack.of(apiStack).account
//   }:${myRestApi.restApiId}/*/*/*`,
// });

// add a proxy resource path to the API
itemsPath.addProxy({
  anyMethod: true,
  defaultIntegration: lambdaIntegration,
});

// create a new Cognito User Pools authorizer
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// create a new resource path with Cognito authorization
const booksPath = myRestApi.root.addResource("cognito-auth-path");
booksPath.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

// create a new IAM policy to allow Invoke access to the API
const apiRestPolicy = new Policy(apiStack, "RestApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${myRestApi.arnForExecuteApi("*", "/items", "dev")}`,
        `${myRestApi.arnForExecuteApi("*", "/items/*", "dev")}`,
        `${myRestApi.arnForExecuteApi("*", "/cognito-auth-path", "dev")}`,
      ],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
});


// create a new REST API
const myHelmetApi = new RestApi(apiStack, "HelmetApi", {
  restApiName: "myHelmetApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// create a new Lambda integration
const helmetLambdaIntegration = new LambdaIntegration(
  backend.myHelmetApiFunction.resources.lambda
);

// create a new resource path with IAM authorization
const helmetsPath = myHelmetApi.root.addResource("helmets", {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.IAM,
  },
});

// add methods you would like to create to the resource path
helmetsPath.addMethod("GET", helmetLambdaIntegration);
helmetsPath.addMethod("POST", helmetLambdaIntegration);
helmetsPath.addMethod("DELETE", helmetLambdaIntegration);
helmetsPath.addMethod("PUT", helmetLambdaIntegration);

// add a proxy resource path to the API
helmetsPath.addProxy({
  anyMethod: true,
  defaultIntegration: helmetLambdaIntegration,
});

// create a new Cognito User Pools authorizer
const cognitoAuth2 = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth2", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// create a new resource path with Cognito authorization
const booksPath2 = myHelmetApi.root.addResource("cognito-auth-path");
booksPath2.addMethod("GET", helmetLambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth2,
});

// create a new IAM policy to allow Invoke access to the API
const helmetApiRestPolicy = new Policy(apiStack, "HelmetApiPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["execute-api:Invoke",
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Query',
        'dynamodb:Scan',
        'lambda:InvokeFunction',
        'lambda:InvokeAsync',
      ],
      resources: [
        `${myHelmetApi.arnForExecuteApi("*", "/helmets", "dev")}`,
        `${myHelmetApi.arnForExecuteApi("*", "/helmets/*", "dev")}`,
        `${myHelmetApi.arnForExecuteApi("*", "/cognito-auth-path", "dev")}`,
        'arn:aws:dynamodb:*:*:table/HelmetPocTable',
        'arn:aws:lambda:eu-north-1:*:* '
      ],
    }),
  ],
});
// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  helmetApiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  helmetApiRestPolicy
);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [myHelmetApi.restApiName]: {
        endpoint: myHelmetApi.url,
        region: Stack.of(myHelmetApi).region,
        apiName: myHelmetApi.restApiName,
      },
    },
  },
});