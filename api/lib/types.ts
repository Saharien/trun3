export interface IActivity {
  date: Date;
  dummyid: string;
  nameconflict: boolean;
  maintype: string;
  distanceinkm: Number;
  cent: Number;
  elapsed_time_in_minutes: Number;
  moving_time_in_minutes: Number;
  elapsed_duration: string;
  moving_time_duration: string;
  pace: Number;
  minimum_pace_exceeded: boolean;
  maximum_pace_exceeded: boolean;
  kmh: Number;
}
