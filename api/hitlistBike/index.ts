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

  const rides = await Bike.aggregate([
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
        //totalAmount: { $sum: { $round: [ "$distance", 2 ] } }, (rundet die Einzelzahlen, wenn dann das Endergebnis runden)
        elevgain: { $sum: "$elevgain" },
        count: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      code: 0,
      data: rides,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export default httpTrigger;