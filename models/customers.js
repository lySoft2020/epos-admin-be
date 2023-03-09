const mongoose = require("mongoose");

const workstationSchema = new mongoose.Schema(
  {
    workstationName: {
      required: true,
      type: String,
    },
    anydeskId: {
      type: String,
    },
    teamviewerId: {
      type: String,
    },
    keyNumber: {
      type: String,
    },
    licenseExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const directDebitSchema = new mongoose.Schema({
  description: {
    required: true,
    type: String,
  },
  startDate: {
    required: true,
    type: Date,
  },
  amount: {
    required: true,
    type: Number,
  },
  frequency: {
    required: true,
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const customerSchema = new mongoose.Schema(
  {
    shopname: {
      required: true,
      type: String,
      unique: true,
    },
    address1: {
      required: true,
      type: String,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
    },
    postcode: {
      type: String,
    },
    telephone: {
      type: String,
    },
    contactName: {
      type: String,
    },
    websiteUrl: {
      type: String,
    },
    hasMobileApp: {
      type: Boolean,
    },
    workstation: [workstationSchema],
    directDebit: [directDebitSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
