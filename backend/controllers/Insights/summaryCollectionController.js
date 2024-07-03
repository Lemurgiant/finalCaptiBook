import { summaryCollectionModel } from "../../models/Insights/summaryCollectionModel.js";
import { handleRequest, sendResponse } from "../../utils/controlHelpers.js";

const validateSummaryCollectionData = (data) => {
  const { summaryContent, reference, bookId } = data;
  const errors = [];

  if (typeof summaryContent === "undefined") {
    errors.push("summaryContent is required");
  }

  if (typeof reference === "undefined") {
    errors.push("reference is required");
  }

  if (typeof bookId === "undefined") {
    errors.push("bookId is required");
  }

  return errors;
};

export const addOneSummaryCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const errors = validateSummaryCollectionData(req.body);

    if (errors.length > 0) {
      sendResponse(res, 400, errors.join(","));
    } else {
      const newSummaryCollectionData = new summaryCollectionModel({
        summaryContent: req.body.summaryContent,
        reference: req.body.reference,
        id: req.body.bookId,
        date: Date.now(),
      });

      await newSummaryCollectionData.save();
      sendResponse(res, 200, "");
    }
  });
};

export const updateOneSummaryCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const errors = validateSummaryCollectionData(req.body);

    if (errors.length > 0) {
      sendResponse(res, 400, errors.join(","));
    } else {
      const data = await summaryCollectionModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            summaryContent: req.body.summaryContent,
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

export const deleteOneSummaryCollectionData = async (req, res) => {
  handleRequest(req, res, async () => {
    const { id } = req.params;
    const deletedData = await summaryCollectionModel.findByIdAndDelete(id);
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
