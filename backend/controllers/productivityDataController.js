import { bookCollectionModel } from "../models/bookCollectionModel.js";
import { sessionCollectionModel } from "../models/sessionCollectionModel.js";
import { handleRequest, sendResponse } from "../utils/controlHelpers.js";
import { positiveNumberCheck } from "./errorFilter.js";
import passport from "../auth/auth.js";
import mongoose from "mongoose";

export const getAllProductivityData = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await sessionCollectionModel.aggregate([
      {
        $match: {
          bookId: {
            $in: await bookCollectionModel.find({ userId }).distinct("_id"),
          },
        },
      },
      {
        $lookup: {
          from: "bookcollections",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: {
          path: "$book",
        },
      },
      {
        $project: {
          _id: 1,
          bookId: 1,
          pageReadCount: 1,
          pageCountPerMinute: 1,
          durationInSeconds: 1,
          date: 1,
          bookImageURL: "$book.book.bookImageURL",
        },
      },
    ]);

    sendResponse(res, 200, "SUCCESS", data);
  } catch (error) {
    console.error("Error fetching productivity data:", error);
    sendResponse(res, 500, "ERROR", []);
  }
};

function recordProductivityDataErrorFilter(
  durationInSeconds,
  pagesRead,
  pagesReadPerMinute,
  bookImageURL
) {
  const errors = [];

  const durationError = positiveNumberCheck(
    durationInSeconds,
    "durationInSeconds"
  );
  if (durationError) {
    errors.push(durationError);
  }

  const pageReadError = positiveNumberCheck(pagesRead, "pageReadCount");
  if (pageReadError) {
    errors.push(pageReadError);
  }

  const pageCountError = positiveNumberCheck(
    pagesReadPerMinute,
    "pageCountPerMinute"
  );
  if (pageCountError) {
    errors.push(pageCountError);
  }
  if (bookImageURL === undefined) {
    errors.push("bookImageURL missing from request body");
  }

  return errors;
}

export const recordProductivityData = async (req, res) => {
  handleRequest(req, res, async () => {
    const {
      durationInSeconds,
      pagesRead,
      pagesReadPerMinute,
      bookImageURL,
      bookId,
    } = req.body;

    const errors = recordProductivityDataErrorFilter(
      durationInSeconds,
      pagesRead,
      pagesReadPerMinute,
      bookImageURL
    );

    if (errors.length > 0) {
      return sendResponse(res, 400, errors.join(", "));
    }

    const newProductivityData = new sessionCollectionModel({
      durationInSeconds,
      pagesRead,
      pagesReadPerMinute,
      date: Date.now(),
      imageURL: bookImageURL,
      id: bookId,
    });

    await bookCollectionModel.findByIdAndUpdate(bookId, {
      $set: {
        "book.latestReadDate": Date.now(),
      },
    });

    await newProductivityData.save();
    sendResponse(res, 200, newProductivityData);
  });
};
