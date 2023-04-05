import mongoose from "mongoose";

const { Schema } = mongoose;

const societySchema = new Schema(
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

export default mongoose.model("Society", societySchema);
