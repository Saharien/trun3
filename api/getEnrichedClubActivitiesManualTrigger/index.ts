import { Context, HttpRequest } from "@azure/functions";
import getEnrichedClubActivities from "../getEnrichedClubActivities";
import { buildResponseContext } from "../lib/context";
import { verifyToken } from "../lib/jwt";

export default async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await verifyToken(req);
  } catch (error) {
    context.res = buildResponseContext({ status: 401, message: error.message });
    return;
  }

  getEnrichedClubActivities(context);

  context.res = buildResponseContext({ data: { jobStarted: true } });
}
