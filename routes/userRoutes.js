const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserById,
  createUser,
  deleteUserById,
  userLogin,
} = require("../controllers/users");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getUsers).post(protect, createUser);
router
  .route("/:id")
  .put(protect, updateUserById)
  .get(protect, getUserById)
  .delete(protect, deleteUserById);
router.route("/login").post(userLogin);

module.exports = router;
