import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Run } from "../lib/run.model";
import { verifyToken } from "../lib/jwt";
import { buildResponseContext } from "../lib/context";

const httpTrigger: AzureFunction = async function (
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

  const longestRides = await Run.find().sort("-distance").limit(10);
  context.res = buildResponseContext({ data: longestRides });
};

export default httpTrigger;
