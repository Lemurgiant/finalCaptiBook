import { quoteCollectionModel } from "../../models/Insights/quoteCollectionModel.js";
import { handleRequest, sendResponse } from "../../utils/controlHelpers.js";

const validateQuoteCollectionData = (data) => {
  const { quoteContent, reference, bookId } = data;
  const errors = [];

  if (typeof quoteContent === "undefined") {
    errors.push("quoteContent is required");
  }

  if (typeof reference === "undefined") {
    errors.push("reference is required");
  }

  if (typeof bookId === "undefined") {
    errors.push("bookId is required");
  }

  return errors;
};

export const addOneQuoteCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const errors = validateQuoteCollectionData(req.body);

    if (errors.length > 0) {
      sendResponse(res, 400, errors.join(","));
    } else {
      const newQuoteCollectionData = new quoteCollectionModel({
        quoteContent: req.body.quoteContent,
        reference: req.body.reference,
        id: req.body.bookId,
        date: Date.now(),
      });

      await newQuoteCollectionData.save();
      sendResponse(res, 200, "");
    }
  });
};

export const updateOneQuoteCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const errors = validateQuoteCollectionData(req.body);

    if (errors.length > 0) {
      sendResponse(res, 400, errors.join(","));
    } else {
      const data = await quoteCollectionModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            quoteContent: req.body.quoteContent,
            reference: req.body.reference,
            bookId: req.body.bookId,
            date: Date.now(),
          },
        },
        { new: true }
      );

      sendResponse(res, 200, "");
    }
  });
};

export const deleteOneQuoteCollectionData = async (req, res) => {
  handleRequest(req, res, async () => {
    const { id } = req.params;
    const deletedData = await quoteCollectionModel.findByIdAndDelete(id);
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
