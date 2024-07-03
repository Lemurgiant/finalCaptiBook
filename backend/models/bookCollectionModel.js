import mongoose from "mongoose";
import { businessMetricsSchema } from "./sessionCollectionModel.js";
const { Schema } = mongoose;

export const bookSchema = new Schema({
  title: { type: String, required: true },
  id: { type: String },
  authors: { type: [String] },
  imageURL: { type: String, default: null },
});

export const bookCollectionSchema = new Schema({
  book: { type: bookSchema, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const bookCollectionModel = mongoose.model(
  "BookCollection",
  bookCollectionSchema
);

export { bookCollectionModel };
