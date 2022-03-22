import { Schema as MongooseSchema, model as MongooseModel } from "mongoose";

export interface Run {
  activity: string;
  url: string;
  timestamp: Date;
  name: string;
  distance: number;
  date: Date;

  kmh: number;
  pace: number;
  nameconflict: boolean;
}

export const Schema = new MongooseSchema<Run>({
  activity: String,
  url: String,
  timestamp: String,
  name: String,
  distance: Number,
  date: Date,

  kmh: Number,
  pace: Number,
  nameconflict: Boolean,
});

Schema.index({
  distance: -1,
});

export const Model = MongooseModel<Run>("Run", Schema);
