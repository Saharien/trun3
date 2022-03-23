import { IBike } from "./bike.model";
import { IRun } from "./run.model";

export interface IActivity extends IRun, IBike {
  dummyid: string;
  elapsed_time: number;
  moving_time: number;
  elapsed_duration: string;
  moving_time_duration: string;
}
