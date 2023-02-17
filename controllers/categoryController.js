const Category = require("../models/categoryModel");
const slugify = require("slugify");

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.json(category);
  } catch (error) {
    console.log(err);
  }
};

const categories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.log(err);
  }
};

const removeCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });
    res.json(category);
  } catch (err) {
    console.log(err);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    console.log(err);
  }
};

// const postsByCategory = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const category = await Category.findOne({ slug });

//     const posts = await Post.find({ categories: category._id })
//       .populate("featuredImage postedBy")
//       .limit(20);

//     res.json({ posts, category });
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports = {
//   postsByCategory,
  create,
  categories,
  removeCategory,
  updateCategory,
};
