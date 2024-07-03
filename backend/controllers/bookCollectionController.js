import mongoose from "mongoose";
import { bookCollectionModel } from "../models/bookCollectionModel.js";
import { handleRequest, sendResponse } from "../utils/controlHelpers.js";

export const getAllBookCollectionData = async (req, res) => {
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
          from: "sessioncollections",
          localField: "_id",
          foreignField: "id",
          as: "sessions",
        },
      },
      {
        $lookup: {
          from: "summarycollections",
          localField: "_id",
          foreignField: "id",
          as: "summaryInsights",
        },
      },
      {
        $lookup: {
          from: "termcollections",
          localField: "_id",
          foreignField: "id",
          as: "termInsights",
        },
      },
      {
        $lookup: {
          from: "quotecollections",
          localField: "_id",
          foreignField: "id",
          as: "quoteInsights",
        },
      },
      {
        $addFields: {
          totalDurationInSeconds: {
            $sum: "$sessions.durationInSeconds",
          },
          totalPagesRead: {
            $sum: "$sessions.pagesRead",
          },
          totalPagesReadPerMinute: {
            $sum: "$sessions.pagesReadPerMinute",
          },
          latestReadDate: {
            $max: "$sessions.date",
          },
        },
      },
    ]);

    sendResponse(res, 200, "Book collection data fetched successfully", data);
  });
};

export const deleteOneBookCollectionData = async (req, res) => {
  handleRequest(req, res, async () => {
    const { id } = req.params;
    const deletedData = await bookCollectionModel.findByIdAndDelete(id);
    if (!deletedData) {
      return sendResponse(res, 404, "Book collection data not found");
    }
    sendResponse(
      res,
      200,
      "Book collection data deleted successfully",
      deletedData
    );
  });
};

function bookErrorFilter(book) {
  const errors = [];

  // Check if required properties are missing
  if (!book.title) {
    errors.push("Book title is required.");
  }
  if (!book.id) {
    errors.push("Book ID is required.");
  }
  // Additional checks or validations can be added here

  return errors;
}

export const addOneBookCollectionData = async (req, res) => {
  handleRequest(req, res, async () => {
    const { book } = req.body;
    const errors = bookErrorFilter(book);
    if (errors.length > 0) {
      return sendResponse(res, 400, errors.join(", "));
    }
    const newBookCollectionData = new bookCollectionModel({
      book,
      userId: req.user._id,
    });

    await newBookCollectionData.save();

    sendResponse(
      res,
      201,
      "Book collection data created successfully",
      newBookCollectionData
    );
  });
};
