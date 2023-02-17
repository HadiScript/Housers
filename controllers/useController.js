const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../functions/auth");
const nanoid = require("nanoid");
const emailValidator = require("email-validator");
const serviceModal = require("../models/serviceModal");

const signup = async (req, res) => {
  console.log("HIT SIGNUP");
  try {
    // validation
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      //   console.log(user);
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const signin = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

const currentUser = async (req, res) => {
  try {
    console.log("am here1");
    const user = await User.findById(req.user._id);
    console.log("am here2");
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, checked, website } = req.body;
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    // if user exist
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "Email is taken" });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    // if checked, send email with login details
    // if (checked) {
    //   // prepare email
    //   const emailData = {
    //     to: email,
    //     from: process.env.EMAIL_FROM,
    //     subject: "Account created",
    //     html: `
    //     <h1>Hi ${name}</h1>
    //     <p>Your CMS account has been created successfully.</p>
    //     <h3>Your login details</h3>
    //     <p style="color:red;">Email: ${email}</p>
    //     <p style="color:red;">Password: ${password}</p>
    //     <small>We recommend you to change your password after login.</small>
    //     `,
    //   };

    //   try {
    //     const data = await sgMail.send(emailData);
    //     console.log("email sent => ", data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
        website,
      }).save();

      const { password, ...rest } = user._doc;
      return res.json(rest);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

const users = async (req, res) => {
  try {
    const all = await User.find().select("-password -secret -resetCode");
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const vendorServices = async (req, res) => {
  const { id } = req.params;
  try {
    const all = await serviceModal
      .find({ postedBy: id })
      .populate("title content featuredImages");
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const usersAdmin = async (req, res) => {
  try {
    const all = await User.find({ role: "Admin" }).select(
      "-password -secret -resetCode"
    );
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const usersSubscriber = async (req, res) => {
  try {
    const all = await User.find({ role: "subscriber" }).select(
      "-password -secret -resetCode"
    );
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const requestedUsers = async (req, res) => {
  try {
    const all = await User.find({ confirm: "requested" }).select(
      "-password -secret -resetCode"
    );
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const usersVendors = async (req, res) => {
  try {
    const all = await User.find({ role: "Vendor" }).select(
      "-password -secret -resetCode"
    );
    res.json(all);
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user._id) return;
    const user = await User.findByIdAndDelete(userId);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("image")
      .select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const currentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("image")
      .select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const { id, name, email, password, about, confirm, role, image, phNumber, agencyAddress  } = req.body;

    const userFromDb = await User.findById(id);

    // check valid email
    if (!emailValidator.validate(email)) {
      return res.json({ error: "Invalid email" });
    }
    // check if email is taken
    const exist = await User.findOne({ email });
    if (exist && exist._id.toString() !== userFromDb._id.toString()) {
      return res.json({ error: "Email is taken" });
    }
    // check password length
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: name || userFromDb.name,
        email: email || userFromDb.email,
        password: hashedPassword || userFromDb.password,
        about: about || userFromDb.about,
        about: confirm || userFromDb.confirm,
        role: role || userFromDb.role,
        image: image || userFromDb.image,
        phNumber : phNumber || userFromDb.phNumber,
        agencyAddress : agencyAddress || userFromDb.agencyAddress,
      },
      { new: true }
    ).populate("image");

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

const updateUserByUser = async (req, res) => {
  try {
    const { id, name, email, password, about, image, phNumber, agencyAddress } = req.body;

    const userFromDb = await User.findById(id);

    // check if user is himself/herself
    if (userFromDb._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("You are not allowed to update this user");
    }

    // check valid email
    if (!emailValidator.validate(email)) {
      return res.json({ error: "Invalid email" });
    }
    // check if email is taken
    const exist = await User.findOne({ email });
    if (exist && exist._id.toString() !== userFromDb._id.toString()) {
      return res.json({ error: "Email is taken" });
    }
    // check password length
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: name || userFromDb.name,
        email: email || userFromDb.email,
        password: hashedPassword || userFromDb.password,
        website: userFromDb.confirm,
        about: about || userFromDb.about,
        role: userFromDb.role,
        image: image || userFromDb.image,
        phNumber : phNumber || userFromDb.phNumber,
        agencyAddress : agencyAddress || userFromDb.agencyAddress,
      },
      { new: true }
    ).populate("image");

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

const Apply = async (req, res) => {
  try {
    const { id, name, email, password, about, image, phNumber, agencyAddress } =
      req.body;

    if (!name) return res.json({ error: "Name of your agency requried" });
    if (!email) return res.json({ error: "Email of your agency requried" });
    if (!about) return res.json({ error: "Tell us about your agency" });
    if (!image) return res.json({ error: "Profile photo is requried" });
    if (!phNumber)
      return res.json({ error: "Phone Number of your company is requried" });
    if (!agencyAddress)
      return res.json({ error: "Address of your company is requried" });

    const userFromDb = await User.findById(id);

    // check if user is himself/herself
    if (userFromDb._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("You are not allowed to update this user");
    }

    // check valid email
    if (!emailValidator.validate(email)) {
      return res.json({ error: "Invalid email" });
    }
    // check if email is taken
    const exist = await User.findOne({ email });
    if (exist && exist._id.toString() !== userFromDb._id.toString()) {
      return res.json({ error: "Email is taken" });
    }
    // check password length
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updated = await User.findByIdAndUpdate(
      id,
      {
        name: name || userFromDb.name,
        email: email || userFromDb.email,
        password: hashedPassword || userFromDb.password,
        website: userFromDb.confirm,
        about: about || userFromDb.about,
        role: userFromDb.about,
        phNumber,
        confirm: "requested",
        agencyAddress,
        image: image || userFromDb.image,
      },
      { new: true }
    ).populate("image");

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

const updateComfirmation = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.body.id,
      {
        confirm: req.body.confirm,
        role: "Vendor",
      },
      { new: true }
    ).populate("image");

    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signin,
  signup,
  currentUser,
  createUser,
  users,
  deleteUser,
  getUser,
  updateUserByAdmin,
  currentUserProfile,
  updateUserByUser,
  usersAdmin,
  usersVendors,
  usersSubscriber,
  requestedUsers,
  updateComfirmation,
  Apply,
  vendorServices,
};
