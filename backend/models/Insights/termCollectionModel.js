import mongoose, { Schema } from "mongoose";

export const termCollectionSchema = new Schema({
  definition: { type: String },
  term: { type: String, required: true },
  date: { type: Date, required: true },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCollection",
    required: true,
  },
});

const termCollectionModel = mongoose.model(
  "TermCollection",
  termCollectionSchema
);

export { termCollectionModel };
