const { Router } = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
