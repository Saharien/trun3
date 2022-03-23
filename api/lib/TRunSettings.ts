import { ClubActivity } from "strava-v3";

export const DummySuffix = "ClubStats_Date";

const mappingMainType: IMainTypeMapping[] = [
  { type: "Run", maintype: "Run" },
  { type: "Ride", maintype: "Bike" },
  { type: "VirtualRun", maintype: "Run" },
  { type: "VirtualRide", maintype: "Bike" },
  { type: "Walk", maintype: "Walking" },
  { type: "Hike", maintype: "Walking" },
  { type: "EBikeRide", maintype: "Bike" },
  { type: "Handcycle", maintype: "Bike" },
  { type: "Snowshoe", maintype: "Walking" },
];

export enum mainTypeEnum {
  Run = "Run",
  Bike = "Bike",
  Walking = "Walking",
  Others = "Others",
}

const mainType: IMaintType[] = [
  {
    maintype: mainTypeEnum.Run,
    centprokm: 20,
    minimum_pace: 9.5,
    maximum_pace: 3,
  },
  {
    maintype: mainTypeEnum.Bike,
    centprokm: 5,
    minimum_pace: 7,
    maximum_pace: 2,
  },
  {
    maintype: mainTypeEnum.Walking,
    centprokm: 20,
    minimum_pace: 0,
    maximum_pace: 9.5,
  },
  {
    maintype: mainTypeEnum.Others,
    centprokm: 0,
    minimum_pace: 0,
    maximum_pace: 0,
  },
];

export function getTechnicalUser() {
  return { firstname: "Team", lastname: "R." };
}

export function isDummyActivity(Activity: ClubActivity): boolean {
  if (
    Activity.name.substring(11, 26) === DummySuffix ||
    (Activity.athlete.firstname === getTechnicalUser().firstname &&
      Activity.athlete.firstname === getTechnicalUser().lastname)
  ) {
    return true;
  } else {
    return false;
  }
}

export function getMainType(ActivityType: string): IMainTypeMapping {
  let maintype = { type: "Default", maintype: "Others" }; // Default

  for (let i = 0; i < mappingMainType.length; i++) {
    if (mappingMainType[i].type === ActivityType) {
      maintype = mappingMainType[i];
    }
  }

  return maintype;
}

export function getMainTypeSettings(activityMainType: string): IMaintType {
  for (let i = 0; i < mainType.length; i++) {
    if (mainType[i].maintype === activityMainType) {
      return mainType[i];
    }
  }
}

export function buildUniqueId(idFields: {
  type: string;
  firstname: string;
  lastname: string;
  elapsed_time: number;
  distance: number;
  date: Date;
}): string {
  return [
    idFields.type,
    idFields.firstname,
    idFields.lastname,
    idFields.elapsed_time.toFixed(5),
    idFields.distance,
    idFields.date.toISOString().substring(0, 10),
  ].join("#");
}

interface IMaintType {
  maintype: mainTypeEnum;
  centprokm: number;
  minimum_pace: number;
  maximum_pace: number;
}

interface IMainTypeMapping {
  type: string;
  maintype: string;
}
