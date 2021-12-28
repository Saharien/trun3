import { Schema as MongooseSchema, model as MongooseModel } from "mongoose";

export interface Run {
  activity: string;
  url: string;
  timestamp: Date;
  name: string;
  distance: number;
  date: Date;
}

export const Schema = new MongooseSchema<Run>({
  activity: String,
  url: String,
  timestamp: String,
  name: String,
  distance: Number,
  date: Date,
});

Schema.index({
  distance: -1,
});

export const Model = MongooseModel<Run>("Run", Schema);
