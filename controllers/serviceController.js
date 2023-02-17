const cloudinary = require("cloudinary");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const mediaModel = require("../models/mediaModel");
const serviceModal = require("../models/serviceModal");
const Service = require("../models/serviceModal");
const userModel = require("../models/userModel");
const User = require("../models/userModel");

// ussing ascripter configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadImage = async (req, res) => {
  try {
    // console.log(req.body);
    const result = await cloudinary.uploader.upload(req.body.image);
    // console.log(result);
    res.json(result.secure_url);
  } catch (err) {
    console.log(err);
  }
};

const uploadImageFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.files.file.path);
    // save to db
    const media = await new mediaModel({
      url: result.secure_url,
      public_id: result.public_id,
      postedBy: req.user._id,
    }).save();
    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

const createService = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      fullAddress,
      city,
      coords,
      rooms,
      type,
      featuredImages,
      area,
      dimensions,
    } = req.body;

    console.log(featuredImages, "from creating images");

    if (!city) return res.json({ error: "City is required" });
    if (!fullAddress) return res.json({ error: "Full address is required" });
    if (!title) return res.json({ error: "Title is required" });
    if (!rooms) return res.json({ error: "Rooms is required" });
    if (!type) return res.json({ error: "Type is required" });
    if (!content) return res.json({ error: "Description is required" });
    if (!area) return res.json({ error: "Area is required" });
    if (!featuredImages) return res.json({ error: "please upload images" });
    if (!dimensions) return res.json({ error: "Dimnesions are important" });

    try {
      const newService = await new Service({
        title,
        content,
        fullAddress,
        city,
        coords,
        rooms,
        type,
        dimensions,
        featuredImages,
        area,
        slug: slugify(title),
        category,
        postedBy: req.user._id,
      }).save();

      // push service id to service's posts array
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { services: newService._id },
      });
      return res.json(newService);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const media = async (req, res) => {
  try {
    console.log("am hitting this");
    const media = await mediaModel
      .find()
      .populate("postedBy", "_id")
      .sort({ createdAt: -1 });

    console.log("after getting data from db");

    res.json(media);
  } catch (err) {
    console.log(err);
  }
};

const removeMedia = async (req, res) => {
  try {
    const media = await mediaModel.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const removePost = async (req, res) => {
  try {
    const media = await serviceModal.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const gettingAllServices = async (req, res) => {
  try {
    const all = await serviceModal
      .find()
      .populate("featuredImages")
      .populate("postedBy", "name")
      .populate("category")
      .sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const MyServices = async (req, res) => {
  try {
    const all = await serviceModal
      .find({ postedBy: req.user._id })
      .populate("featuredImages")
      .populate("postedBy", "name")
      .populate("categories")
      .sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const singleService = async (req, res) => {
  try {
    const { Id } = req.params;

    const service = await serviceModal
      .findOne({ _id: Id })
      .populate("postedBy", "_id about email name")
      .populate("category", "name slug")
      .populate("featuredImages", "url");
    res.json(service);
    console.log("touch 3", service);
  } catch (err) {
    console.log(err);
  }
};

const editService = async (req, res) => {
  try {
    const { Id } = req.params;
    const {
      title,
      content,
      categories,
      fullAddress,
      city,
      coords,
      rooms,
      type,
      dimensions,
      featuredImages,
    } = req.body;

    const service = await serviceModal
      .findByIdAndUpdate(
        Id,
        {
          title,
          dimensions,
          slug: slugify(title),
          content,
          categories,
          featuredImages,
          ...req.body,
        },
        { new: true }
      )
      .populate("postedBy", "name")
      .populate("categories", "name slug")
      .populate("featuredImages", "url");

    res.json(service);
  } catch (err) {
    console.log(err);
  }
};

const filteredServices = async (req, res) => {
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  let term = req.body.searchTerm;

  console.log(req.body.filters);

  try {
    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === "price") {
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1],
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }

    console.log(findArgs.city);

    if (term) {
      serviceModal
        .find(findArgs)
        .find({ $text: { $search: term } })
        .populate("featuredImages")
        .populate("postedBy", "name")
        .populate("category")
        .sort([[sortBy]])
        .skip(skip)
        .limit(limit)
        .exec((err, properties) => {
          if (err) return res.status(400).json({ success: false, err });
          res
            .status(200)
            .json({ success: true, properties, postSize: properties.length });
        });
    } else {
      serviceModal
        .find(findArgs)
        .populate("featuredImages")
        .populate("postedBy", "name")
        .populate("category")
        .sort([[sortBy]])
        .skip(skip)
        .limit(limit)
        .exec((err, properties) => {
          if (err) return res.status(400).json({ success: false, err });
          res
            .status(200)
            .json({ success: true, properties, postSize: properties.length });
        });
    }
  } catch (error) {
    console.log(error);
  }
};

const AllAgency = async (req, res) => {
  try {
    const all = await userModel.find({
      $or: [{ role: "Vendor" }, { role: "Admin" }],
    });
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const LikeService = async (req, res) => {
  try {
    // console.log(req.body);
    const post = await serviceModal.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );

    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

const UnlikeService = async (req, res) => {
  try {
    // console.log(req.body);
    const post = await serviceModal.findByIdAndUpdate(
      req.body._id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

const MyLikes = async (req, res) => {
  try {
    // console.log(req.body);
    const post = await serviceModal
      .find({
        likes: { $elemMatch: { $eq: req.user._id } },
      })
      .populate("title content featuredImages _id");

    res.json(post);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadImage,
  uploadImageFile,
  createService,
  media,
  removeMedia,
  gettingAllServices,
  singleService,
  editService,
  MyServices,
  filteredServices,
  AllAgency,
  LikeService,
  UnlikeService,
  MyLikes,
  removePost,
};
