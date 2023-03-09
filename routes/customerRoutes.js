const express = require("express");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} = require("../controllers/customers");

const {
  createWorkstationByCustomerId,
  deleteWorkstationById,
  getWorkstationByCustomerId,
  updateWorkstationById,
} = require("../controllers/Workstations");

const {
  createDirectDebitByCustomerId,
  getDirectDebitByCustomerId,
  deleteDirectDebitById,
  updateDirectDebitById,
} = require("../controllers/directDebits");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getCustomers).post(createCustomer);
router
  .route("/:id")
  .get(getCustomerById)
  .put(updateCustomerById)
  .delete(deleteCustomerById);

router
  .route("/:id/workstation")
  .post(createWorkstationByCustomerId)
  .get(getWorkstationByCustomerId);
router.route("/:id/workstation/:wsId").delete(deleteWorkstationById);
router.route("/workstation/:id").patch(updateWorkstationById);

router
  .route("/:id/directdebit")
  .post(createDirectDebitByCustomerId)
  .get(getDirectDebitByCustomerId);
router.route("/:id/directdebit/:ddId").delete(deleteDirectDebitById);
router.route("/directdebit/:id").patch(updateDirectDebitById);

module.exports = router;
