import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { initDBConnection } from "../lib/azure-cosmosdb-mongodb";
import { Model as Bike } from "../lib/bike.model";
import { verifyToken } from "../lib/jwt";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    await verifyToken(req.headers.authorization);
  } catch (error) {
    context.res = { status: 401, body: { message: error.message } };
    return;
  }
  await initDBConnection();

  const longestRides = await Bike.find().sort("-distance").limit(10);

  context.res = {
    body: {
      code: 0,
      data: longestRides,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;