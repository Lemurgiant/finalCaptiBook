import User from "../models/userModel.js";
import { handleRequest, sendResponse } from "../utils/controlHelpers.js";

export const updateUserImage = (req, res) => {
  handleRequest(req, res, async () => {
    const { base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ error: "Base64 image data is required." });
    }

    // Update user model (assuming User is your Mongoose model)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { image: base64 },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      sendResponse(res, 404, "");
    }
    sendResponse(res, 200, "");
  });
};

export const updateUserDisplayName = (req, res) => {
  handleRequest(req, res, async () => {
    const { displayName } = req.body;
    if (!displayName) {
      return res.status(400).json({ error: "DisplayName is required." });
    }

    // Update user model (assuming User is your Mongoose model)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { displayName: displayName },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      sendResponse(res, 404, "");
    }
    sendResponse(res, 200, "");
  });
};

export const updateUserTheme = (req, res) => {
  handleRequest(req, res, async () => {
    const { theme } = req.body;
    if (theme === undefined) {
      return sendResponse(res, 400, "");
    }

    if (theme !== 0 && theme !== 1) {
      return sendResponse(res, 400, "");
    }

    // Update user model (assuming User is your Mongoose model)
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { theme: theme },
      { new: true } // Return the updated document
    );

    sendResponse(res, 200, "");
  });
};
