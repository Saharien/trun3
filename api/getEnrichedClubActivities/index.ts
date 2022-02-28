import { Context } from "@azure/functions";
import { calculatePace, timeConvert } from "../lib/StatsUtility";
import {
  isDummyActivity,
  buildUniqueId,
  getMainType,
  getMainTypeSettings,
  mainTypeEnum,
} from "../lib/TRunSettings";
import { Model as RunModel } from "../lib/run.model";
import { Model as BikeModel } from "../lib/bike.model";
import { IActivity } from "../lib/types";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
const strava = require("strava-v3");

export default async function (context: Context, myTimer?: any): Promise<void> {
  try {
    await initDBConnection();
  } catch (error) {
    return;
  }

  const token = await strava.oauth.refreshToken(
    process.env.STRAVA_REFRESH_TOKEN
  );
  const stravaClient = new strava.client(token.access_token);

  const Activities = await stravaClient.clubs.listActivities({
    id: process.env.STRAVA_CLUB_ID,
    page: 1,
    per_page: 200,
  });
  const Members = await stravaClient.clubs.listMembers({
    id: process.env.STRAVA_CLUB_ID,
    page: 1,
    per_page: 200,
  });

  const aEnrichedClubMembers = enrichClubMembers(Members);
  const aEnrichtedActivity = enrichActivies(Activities, aEnrichedClubMembers);

  console.info("Count Activities found " + aEnrichtedActivity.length);

  if (stravaClient.rateLimiting.exceeded()) {
    console.error(
      `ERROR - RateLimitExceeded: ${stravaClient.rateLimiting.exceeded()}`
    );
  }
  if (stravaClient.rateLimiting.fractionReached()) {
    console.warn(
      `WARNING - RateLimitFractionReached: ${stravaClient.rateLimiting.fractionReached()}`
    );
  }

  return saveActivities(aEnrichtedActivity);
}

async function saveActivities(aActivities: IActivity[]): Promise<any> {
  return Promise.all([
    RunModel.insertMany(
      aActivities.filter((activity) => activity.maintype === mainTypeEnum.Run)
    ),
    BikeModel.insertMany(
      aActivities.filter((activity) => activity.maintype === mainTypeEnum.Bike)
    ),
  ]);
}

function enrichClubMembers(Members) {
  for (let i = 0; i < Members.length; i++) {
    let iCount = 0;
    for (let j = 0; j < Members.length; j++) {
      if (
        Members[i].firstname === Members[j].firstname &&
        Members[i].lastname === Members[j].lastname
      ) {
        iCount += 1;
      }
    }

    if (iCount > 1) {
      Members[i].nameconflict = true;
      console.warn(
        `WARNING - Name Conflict ${Members[i].firstname} ${Members[i].lastname}`
      );
    } else {
      Members[i].nameconflict = false;
    }
  }

  if (Members.length === 200) {
    console.warn(
      "WARNING - Anzahl Mitglieder überschreitet Paging von 200! Es fehlen vermutlich welche"
    );
  } else {
    console.info("Count Club members " + Members.length);
  }

  return Members;
}

function enrichActivies(Activities, Members): IActivity[] {
  let aEnrichedActivity: IActivity[] = [];
  let currentDate = new Date();

  for (let i = 0; i < Activities.length; i++) {
    let oActivity = Activities[i];

    if (isDummyActivity(oActivity) === true) {
      const ActivityDate = new Date(oActivity.name.substring(0, 10));
      currentDate = ActivityDate;
    } else {
      // new Properties
      oActivity.maintype = getMainType(oActivity.type).maintype;
      const maintype_setting = getMainTypeSettings(oActivity.maintype);

      oActivity.date = currentDate;
      oActivity.dummyid = buildUniqueId(oActivity);
      oActivity.nameconflict = getClubMemberNameConflict(Members, oActivity);
      oActivity.distanceinkm = oActivity.distance / 1000;
      oActivity.cent = oActivity.distanceinkm * maintype_setting.centprokm;
      oActivity.elapsed_time_in_minutes = oActivity.elapsed_time / 60;
      oActivity.moving_time_in_minutes = oActivity.moving_time / 60;
      oActivity.elapsed_duration = timeConvert(
        oActivity.elapsed_time_in_minutes
      );
      oActivity.moving_time_duration = timeConvert(
        oActivity.moving_time_in_minutes
      );
      oActivity.pace = calculatePace(
        oActivity.moving_time_in_minutes,
        oActivity.distanceinkm
      );
      oActivity.minimum_pace_exceeded = false;
      oActivity.maximum_pace_exceeded = false;
      oActivity.kmh = 60 / oActivity.pace;

      if (oActivity.pace > maintype_setting.minimum_pace) {
        oActivity.minimum_pace_exceeded = true;
      }

      if (oActivity.pace < maintype_setting.maximum_pace) {
        oActivity.maximum_pace_exceeded = true;
      }

      aEnrichedActivity.push(oActivity);
    }
  }

  return aEnrichedActivity;
}

// gets Club member
function getClubMemberNameConflict(Members, Activity) {
  let bNameConflict = false;
  for (let j = 0; j < Members.length; j++) {
    if (
      Members[j].firstname === Activity.athlete.firstname &&
      Members[j].lastname === Activity.athlete.lastname
    ) {
      bNameConflict = Members[j].nameconflict;
    }
  }

  return bNameConflict;
}
