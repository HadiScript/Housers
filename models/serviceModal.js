const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },

    city: { type: String, required: true },
    area: { type: String, required: true },
    fullAddress: { type: String, required: true },
    coords: [{ lat: {}, lng: {} }],

    rooms: { type: Number, required: true },
    type: { type: String, required: true },
    dimensions: { type: Number, required: true },

    featuredImages: [],
    category: { type: String, required: true },
    published: { type: Boolean, default: true },
    postedBy: { type: ObjectId, ref: "User" },
    likes: [{ type: ObjectId, ref: "User" }],
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
