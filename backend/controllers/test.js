import { bookCollectionModel } from "../models/bookCollectionModel.js";
import { sessionCollectionModel } from "../models/sessionCollectionModel.js";
import { handleRequest, sendResponse } from "../utils/controlHelpers.js";

export const deleteAllProductivityData = async (req, res) => {
  handleRequest(req, res, async () => {
    await sessionCollectionModel.deleteMany({});
  });
  sendResponse(res, 200, "OK");
};

export const deleteAllBookCollectionData = async (req, res) => {
  handleRequest(req, res, async () => {
    await bookCollectionModel.deleteMany({});
  });
  sendResponse(res, 200, "OK");
};

export const getAllBookCollectionDataTest = async (req, res) => {
  handleRequest(req, res, async () => {
    const userId = req.user._id;

    const data = await bookCollectionModel.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: "productivitydatas",
          localField: "_id",
          foreignField: "bookId",
          as: "productivityData",
        },
      },
      {
        $addFields: {
          totalDurationInSeconds: {
            $sum: "$productivityData.durationInSeconds",
          },
          totalPageReadCount: {
            $sum: "$productivityData.pageReadCount",
          },
          totalPageCountPerMinute: {
            $sum: "$productivityData.pageCountPerMinute",
          },
          latestReadDate: {
            $max: "$productivityData.date",
          },
        },
      },
    ]);

    sendResponse(res, 200, "Book collection data fetched successfully", data);
  });
};
