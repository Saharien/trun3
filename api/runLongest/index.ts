import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Run } from "../lib/run.model";
import { verifyToken } from "../lib/jwt";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await verifyToken(req);
  } catch (error) {
    context.res = { status: 401, body: { message: error.message } };
    return;
  }
  await initDBConnection();

  const longestRides = await Run.find().sort("-distance").limit(10);

  context.res = {
    body: {
      code: 0,
      data: longestRides,
    },
    headers: {
      "content-type": "application/json",
    },
  };
};

export default httpTrigger;
