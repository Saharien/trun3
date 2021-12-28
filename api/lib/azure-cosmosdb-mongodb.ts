import { connect } from "mongoose";

let db = null;

export const initDBConnection = async () => {
  if (!db) {
    db = await connect(process.env["CosmosDbConnectionString"]);
  }
};
