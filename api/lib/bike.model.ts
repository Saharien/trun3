import { Schema as MongooseSchema, model as MongooseModel } from "mongoose";

export interface Bike {
  activity: string;
  url: string;
  timestamp: Date;
  name: string;
  distance: number;
  elevgain: number;
  type: string;
  date: Date;

  kmh: number;
  pace: number;
  nameconflict: boolean;
}

export const Schema = new MongooseSchema({
  activity: String,
  url: String,
  timestamp: String,
  name: String,
  distance: Number,
  elevgain: Number,
  type: String,
  date: Date,

  kmh: Number,
  pace: Number,
  nameconflict: Boolean,
});

Schema.index({
  distance: -1,
});

export const Model = MongooseModel("Biking", Schema);
