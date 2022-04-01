import { Context } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { DummySuffix, isDummyActivity } from "../lib/TRunSettings";
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

  await createDummy(stravaClient);

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
}

async function createDummy(stravaClient) {
  const Activities = await stravaClient.athlete.listActivities({});
  const maxDate = getLatestDummyActivityDate(Activities);

  console.info(
    `Highest dummy date found ${maxDate.toISOString().substring(0, 10)}`
  );

  if (IsDummyCreateRequired(maxDate, stravaClient) === true) {
    createDummyActivity(maxDate, stravaClient);
  } else {
    console.info("Nothing to do dummy activites exist");
  }
}

async function createDummyActivity(maxDate, stravaClient) {
  const currentDate = new Date();
  let bCount = 0;

  maxDate.setUTCDate(maxDate.getUTCDate() + 1); // since its the highest date that exists start createion 1 day in the future
  maxDate.setUTCHours(23, 59, 59, 999); // at 23:59 at the end of day create dummy acitvity

  while (maxDate.getUTCDate() < currentDate.getUTCDate() ||
         maxDate.getUTCMonth() < currentDate.getUTCMonth() ||
         maxDate.getUTCFullYear() < currentDate.getUTCFullYear()) {

    // no dummy activity for current day Grabber uses that day as default
    // prevent endless loop at all cost due to API limits
    if (
      maxDate.toISOString().substring(0, 10) ===
        currentDate.toISOString().substring(0, 10) ||
      bCount > 15
    ) {
      break;
    }

    const ActivityData = {
      name: `${maxDate.toISOString().substring(0, 10)}#${DummySuffix}`,
      type: "Run",
      description: "Dummy Activity for date determination",
      elapsed_time: 1,
      distance: 1,
      start_date_local: maxDate.toISOString(),
      hide_from_home: true,
      private: true,
    };

    const createdActivity = await stravaClient.activities.create(ActivityData);

    bCount += 1;
    console.info(
      `Dummy Activity created for ${maxDate.toISOString().substring(0, 10)}`
    );
    maxDate.setUTCDate(maxDate.getUTCDate() + 1);
  }
}

function IsDummyCreateRequired(maxDate, stravaClient) {
  var bRequired = true;
  if (
    new Date().toISOString().substring(0, 10) ===
    maxDate.toISOString().substring(0, 10)
  ) {
    bRequired = false;
  }

  return bRequired;
}

function getLatestDummyActivityDate(Activities) {
  const aDates = [];

  for (let i = 0; i < Activities.length; i++) {
    // 7 days into the past thats the maximum amount of dummies we create
    const DummyEarliest = new Date();
    DummyEarliest.setDate(DummyEarliest.getDate() - 7);
    aDates.push(DummyEarliest);

    if (isDummyActivity(Activities[i])) {
      const ActivityDate = new Date(Activities[i].name.substring(0, 10));
      aDates.push(ActivityDate);
    }
  }

  return new Date(Math.max.apply(null, aDates));
}
