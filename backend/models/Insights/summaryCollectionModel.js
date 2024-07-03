import mongoose, { Schema } from "mongoose";

export const summaryCollectionSchema = new Schema({
  summaryContent: { type: String, required: true },
  reference: { type: String },
  date: { type: Date, required: true },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCollection",
    required: true,
  },
});

const summaryCollectionModel = mongoose.model(
  "SummaryCollection",
  summaryCollectionSchema
);

export { summaryCollectionModel };
