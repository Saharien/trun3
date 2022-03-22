import { ClubActivity } from "strava-v3";

var trun_settings = {};
export const DummySuffix = "ClubStats_Date";

const mappingMainType = [
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

const mainType = [
  {
    maintype: mainTypeEnum.Run,
    centprokm: 0.2,
    minimum_pace: 9.5,
    maximum_pace: 3,
  },
  {
    maintype: mainTypeEnum.Bike,
    centprokm: 0.05,
    minimum_pace: 7,
    maximum_pace: 2,
  },
  { maintype: mainTypeEnum.Walking, centprokm: 0.2, maximum_pace: 9.5 },
  { maintype: mainTypeEnum.Others, centprokm: 0 },
];

const technicalUser = { firstname: "Team", lastname: "R." };

export function getTechnicalUser() {
  return { firstname: "Team", lastname: "R." };
}

export function isDummyActivity(Activity: ClubActivity) {
  if (
    Activity.name.substring(11, 26) === DummySuffix ||
    (Activity.athlete.firstname === technicalUser.firstname &&
      Activity.athlete.firstname === technicalUser.lastname)
  ) {
    return true;
  } else {
    return false;
  }
}

export function getMainType(ActivityType) {
  var maintype = { type: "Default", maintype: "Others" }; // Default

  for (let i = 0; i < mappingMainType.length; i++) {
    if (mappingMainType[i].type === ActivityType) {
      maintype = mappingMainType[i];
    }
  }

  return maintype;
}

export function getMainTypeSettings(maintype) {
  for (let i = 0; i < mainType.length; i++) {
    if (mainType[i].maintype === maintype) {
      return mainType[i];
    }
  }
}

export function buildUniqueId(Activity) {
  const fieldsForId = [
    Activity.type,
    Activity.athlete.firstname,
    Activity.athlete.lastname,
    Activity.elapsed_time,
    Activity.distance,
    Activity.date.toISOString().substring(0, 10),
  ];

  return fieldsForId.join("#");
}
