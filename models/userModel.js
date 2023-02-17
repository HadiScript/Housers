const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    confirm: { type: String, default: "notConfirm" },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "subscriber",
    },
    about: { type: String },
    agencyAddress: { type: String },
    phNumber: { type: String },
    image: {},

    agencyType: { type: String },

    resetCode: "",
    services: [{ type: ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
