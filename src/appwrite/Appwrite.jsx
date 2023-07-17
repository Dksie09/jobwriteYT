import { Client, Account, ID, Functions, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64a2397f42a2b73da9e4");

export const account = new Account(client);
export const functions = new Functions(client);
export const databases = new Databases(client);
