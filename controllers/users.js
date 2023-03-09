const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    // check for the username
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res
        .status(400)
        .json({ message: `user with username ${username} not found` });
    }

    // console.log("user pending", user.pending);

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user && user.pending) {
        return res.status(402).json({ message: `user account still pending` });
      }

      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "invalid username or password" });
    }
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  // check that the user dosen't exist
  const duplicate = await User.findOne({ email }).exec();

  if (duplicate)
    return res
      .status(409)
      .json({ message: `user with email ${email} already exists.` }); // conflict

  try {
    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create and store new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).catch((err) => {
      next(err);
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      res.status(400).json({ message: "users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res
        .status(400)
        .json({ message: `user with id ${req.params.id} not found` });
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserById = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .exec()
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `user with id ${id} not found` });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: `user with id ${id} not found` });
    });
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res
        .status(400)
        .json({ message: `user with id ${req.params.id} not found` });
    } else {
      res.status(200).json({ id: req.params.id });
    }
  } catch (error) {
    next(error);
  }
};
