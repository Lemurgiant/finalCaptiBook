import { handleRequest, sendResponse } from "../utils/controlHelpers";

export const addOneTermCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const { term, definition } = req.body;
    sendResponse(res, 200, "");
  });
};

export const addOneQuoteCollectionData = (req, res) => {
  handleRequest(req, res, async () => {
    const { quoteContent, reference } = req.body;
    sendResponse(res, 200, "");
  });
};
