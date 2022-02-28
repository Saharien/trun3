import { Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Bike } from "../lib/bike.model";
import { verifyToken } from "../lib/jwt";
import { buildResponseContext } from "../lib/context";

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
  try {
    await initDBConnection();
  } catch (error) {
    context.res = buildResponseContext({ status: 500, message: error.message });
    return;
  }

  const longestRides = await Bike.find().sort("-distance").limit(10);
  context.res = buildResponseContext({ data: longestRides });
}
