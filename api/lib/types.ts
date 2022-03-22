export interface IActivity {
  name: string;
  date: Date;
  dummyid: string;
  nameconflict: boolean;
  type: string;
  distance: number;
  cent: number;
  elapsed_time: number;
  moving_time: number;
  elapsed_duration: string;
  moving_time_duration: string;
  pace: number;
  minimum_pace_exceeded: boolean;
  maximum_pace_exceeded: boolean;
  kmh: number;
  elevgain: number;
}
