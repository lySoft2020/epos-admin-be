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
// const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getUsers).post(createUser);
router
  .route("/:id")
  .put(updateUserById)
  .get(getUserById)
  .delete(deleteUserById);
router.route("/login").post(userLogin);

module.exports = router;
