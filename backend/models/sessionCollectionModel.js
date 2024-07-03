import mongoose from "mongoose";
const { Schema } = mongoose;

export const businessMetricsSchema = new Schema(
  {
    durationInSeconds: { type: Number, required: true },
    pagesRead: { type: Number, required: true },
    pagesReadPerMinute: { type: Number, required: true },
  },
  { _id: false }
);

const sessionCollectionSchema = new Schema({
  ...businessMetricsSchema.obj,
  date: { type: Date, default: Date.now, required: true },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCollection",
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

const sessionCollectionModel = mongoose.model(
  "SessionCollection",
  sessionCollectionSchema
);
export { sessionCollectionModel };
