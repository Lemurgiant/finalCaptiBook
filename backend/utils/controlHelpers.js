export const handleRequest = async (req, res, callback) => {
  try {
    await callback();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendResponse = (res, statusCode, message, data = null) => {
  const response = { message };
  if (data) {
    response.data = data;
  }
  res.status(statusCode).json(response);
};

export const isMissing = (field) => field === undefined || null;
