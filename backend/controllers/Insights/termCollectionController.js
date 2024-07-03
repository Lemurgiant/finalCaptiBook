import { termCollectionModel } from "../../models/Insights/termCollectionModel.js";
import { handleRequest, sendResponse } from "../../utils/controlHelpers.js";

const validateTermCollectionData = (data) => {
  const { definition, term, bookId } = data;
  const errors = [];

  if (typeof definition === "undefined") {
    errors.push("definition is required");
  }

  if (typeof term === "undefined") {
    errors.push("term is required");
  }

  if (typeof bookId === "undefined") {
    errors.push("bookId is required");
  }

  return errors;
};

export const addOneTermCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const errors = validateTermCollectionData(req.body);

    if (errors.length > 0) {
      sendResponse(res, 400, errors.join(","));
    } else {
      const newTermCollectionData = new termCollectionModel({
        term: req.body.term,
        definition: req.body.definition,
        id: req.body.bookId,
        date: Date.now(),
      });

      await newTermCollectionData.save();
      sendResponse(res, 200, "");
    }
  });
};

export const updateOneTermCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const errors = validateTermCollectionData(req.body);

    if (errors.length > 0) {
      sendResponse(res, 400, errors.join(","));
    } else {
      const data = await termCollectionModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            term: req.body.term,
            definition: req.body.definition,
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

export const deleteOneTermCollectionData = async (req, res) => {
  handleRequest(req, res, async () => {
    const { id } = req.params;
    const userId = req.user.id; // Assuming you have user ID in req.user from your authentication middleware

    const term = await termCollectionModel.findById(id).populate("id"); // Populate the book reference

    if (!term) {
      return sendResponse(res, 404, "Term collection data not found");
    }

    const book = term.id; // The populated book document
    if (!book) {
      return sendResponse(res, 404, "Associated book not found");
    }

    if (book.userId.toString() !== userId) {
      // Assuming the book schema has a userId field
      return sendResponse(
        res,
        403,
        "You do not have permission to delete this term"
      );
    }

    const deletedData = await termCollectionModel.findByIdAndDelete(id);
    sendResponse(
      res,
      200,
      "Term collection data deleted successfully",
      deletedData
    );
  });
};
