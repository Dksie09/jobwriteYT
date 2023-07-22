import { Client, Account, ID, Functions, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_ENDPOINT)
  .setProject(process.env.REACT_APP_PROJECT_ID);

export const account = new Account(client);
export const functions = new Functions(client);
export const databases = new Databases(client);
