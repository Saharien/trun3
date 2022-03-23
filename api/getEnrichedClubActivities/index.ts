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
import { ClubActivity } from "strava-v3";
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

  const Activities: ClubActivity[] = await stravaClient.clubs.listActivities({
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
      aActivities.filter((activity) => activity.mainType === mainTypeEnum.Run)
    ),
    BikeModel.insertMany(
      aActivities.filter((activity) => activity.mainType === mainTypeEnum.Bike)
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
      "WARNING - Anzahl Mitglieder überschreitet Paging von 200! Es fehlen vermutlich welche!"
    );
  } else {
    console.info("Count Club members " + Members.length);
  }

  return Members;
}

function enrichActivies(Activities: ClubActivity[], members): IActivity[] {
  let trunActivities: IActivity[] = [];
  let currentDate = new Date();

  for (const clubActivity of Activities) {
    if (isDummyActivity(clubActivity) === true) {
      currentDate = new Date(clubActivity.name.substring(0, 10));
    } else {
      const activityMainType = getMainType(clubActivity.type).maintype;
      const mainTypeSettings = getMainTypeSettings(activityMainType);
      const normalizedDistance = clubActivity.distance / 1000;
      const normalizedMovingTime = clubActivity.moving_time / 60;
      const normalizedElapsedTime = clubActivity.elapsed_time / 60;
      const pace = calculatePace(normalizedMovingTime, normalizedDistance);

      const trunActivity: IActivity = {
        mainType: activityMainType,
        name: `${clubActivity.athlete.firstname} ${clubActivity.athlete.lastname}`,
        elevgain: clubActivity.total_elevation_gain,
        date: currentDate,
        dummyid: buildUniqueId({
          type: activityMainType,
          firstname: clubActivity.athlete.firstname,
          lastname: clubActivity.athlete.lastname,
          elapsed_time: normalizedElapsedTime,
          distance: clubActivity.distance,
          date: currentDate,
        }),
        nameconflict: getClubMemberNameConflict(members, clubActivity),
        distance: normalizedDistance,
        cent: normalizedDistance * mainTypeSettings.centprokm,
        elapsed_time: normalizedElapsedTime,
        moving_time: normalizedMovingTime,
        elapsed_duration: timeConvert(normalizedElapsedTime),
        moving_time_duration: timeConvert(normalizedMovingTime),
        pace: pace,
        kmh: 60 / pace,
        minimum_pace_exceeded:
          pace > mainTypeSettings.minimum_pace ? true : false,
        maximum_pace_exceeded:
          pace < mainTypeSettings.maximum_pace ? true : false,
      };

      trunActivities.push(trunActivity);
    }
  }

  return trunActivities;
}

// gets Club member
function getClubMemberNameConflict(
  members: { firstname: string; lastname: string; nameconflict: boolean }[],
  activity: ClubActivity
): boolean {
  let nameConflict = false;
  for (const member of members) {
    if (
      member.firstname === activity.athlete.firstname &&
      member.lastname === activity.athlete.lastname
    ) {
      nameConflict = member.nameconflict;
    }
  }

  return nameConflict;
}
