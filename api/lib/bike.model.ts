import { Schema as MongooseSchema, model as MongooseModel } from "mongoose";

export interface IBike {
  dummyid: string;
  mainType: string;
  name: string;
  distance: number;
  date: Date;
  elevgain: number;

  kmh: number;
  pace: number;
  nameconflict: boolean;
  cent: number;
  minimum_pace_exceeded: boolean;
  maximum_pace_exceeded: boolean;
}

export const Schema = new MongooseSchema<IBike>({
  dummyid: String,
  mainType: String,
  name: String,
  distance: Number,
  elevgain: Number,
  date: Date,

  kmh: Number,
  pace: Number,
  nameconflict: Boolean,
  cent: Number,
  minimum_pace_exceeded: Boolean,
  maximum_pace_exceeded: Boolean,
});

Schema.index({
  distance: -1,
});

export const Model = MongooseModel<IBike>("Biking", Schema);
