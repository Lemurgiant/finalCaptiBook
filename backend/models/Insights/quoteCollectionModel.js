import mongoose, { Schema } from "mongoose";

export const quoteCollectionSchema = new Schema({
  quoteContent: { type: String, required: true },
  reference: {
    type: String,
  },
  date: { type: Date, required: true },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCollection",
    required: true,
  },
});

const quoteCollectionModel = mongoose.model(
  "QuoteCollection",
  quoteCollectionSchema
);

export { quoteCollectionModel };
