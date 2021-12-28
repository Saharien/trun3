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

  const month = req.query.timeSpan;
  let monthInt: number;
  let nextMonthInt: number;

  if (month == "S") {
    monthInt = 4;
    nextMonthInt = 7;
  } else {
    monthInt = parseInt(month);
    nextMonthInt = monthInt + 1;
  }
  const monthString = monthInt.toString().padStart(2, "0");
  const nextMonthString = nextMonthInt.toString().padStart(2, "0");

  const runs = await Run.aggregate([
    {
      $match: {
        date: {
          $gte: new Date("2021-" + monthString + "-01"),
          $lt: new Date("2021-" + nextMonthString + "-01"),
        },
      },
    },

    {
      $group: {
        _id: { name: "$name", url: "$url" },
        totalAmount: { $sum: "$distance" },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  context.res = buildResponseContext({ data: runs });
};

export default httpTrigger;
