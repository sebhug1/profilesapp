import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    UserProfile: a
      .model({
        email: a.string(),
        profileOwner: a.string(),
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
      FormData: a.model({
        helmet_id: a.string(),
        force: a.string(),
        direction: a.string(),
        isDone: a.boolean()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
      Todo: a.model({
        content: a.string(),
        isDone: a.boolean()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
      BackendHelmet: a.model({
        Helmet_ID: a.integer(),
        Force: a.integer(),
        Direction: a.integer(),
        isDone: a.boolean()
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner"),
      ]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);
  
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});