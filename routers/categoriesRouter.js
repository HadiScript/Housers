const express = require("express");
const { requireSignin, isAdmin } = require("../functions/middleware");
const {
  create,
  categories,
  removeCategory,
  updateCategory,
} = require("../controllers/categoryController");


const router = express.Router();

router.post("/category", requireSignin, isAdmin, create);
router.get("/categories", categories);
router.delete("/category/:slug", requireSignin, isAdmin, removeCategory);
router.put("/category/:slug", requireSignin, isAdmin, updateCategory);
// router.get("/posts-by-category/:slug", postsByCategory);

module.exports = router;
