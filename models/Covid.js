import mongoose from "mongoose";

const { Schema } = mongoose;

const covidSchema = new Schema(
  {
    title: {
      type: String,
      // required: true,
    },
    imageUrl: {
      type: String,
      // required: true,
    },
    link: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Covid", covidSchema);
