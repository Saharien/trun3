import { Context, HttpRequest } from "@azure/functions";
import getEnrichedClubActivities from "../getEnrichedClubActivities";
import { buildResponseContext } from "../lib/context";

export default async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const apiKey = new URL(req.url).searchParams.get("apiKey");
    if (!apiKey || apiKey !== process.env.cronApiKey) {
      throw new Error("API-Key is wrong!");
    }
  } catch (error) {
    context.res = buildResponseContext({ status: 401, message: error.message });
    return;
  }

  getEnrichedClubActivities(context);

  context.res = buildResponseContext({ data: { jobStarted: true } });
}
