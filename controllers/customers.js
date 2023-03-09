const Customer = require("../models/customers");

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().exec();
    if (customers) {
      res.status(200).json(customers);
    } else {
      res.status(404).json({ message: "No customers found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id).exec();
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: `customer with id ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  const {
    shopname,
    address1,
    address2,
    city,
    postcode,
    telephone,
    contactName,
    websiteUrl,
    hasMobileApp,
  } = req.body;

  if (!shopname || !address1) {
    return res
      .status(400)
      .json({ message: "shopname and address1 are required" });
  }

  // check that the customer dosen't exist
  const duplicate = await Customer.findOne({ shopname }).exec();

  if (duplicate)
    return res
      .status(409)
      .json({ message: `customer ${shopname} already exists.` }); // conflict

  try {
    //create and store new customer
    const customer = await Customer.create({
      shopname,
      address1,
      address2,
      city,
      postcode,
      telephone,
      contactName,
      websiteUrl,
      hasMobileApp,
    }).catch((err) => {
      next(err);
    });

    if (customer) {
      res.status(201).json({
        _id: customer._id,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res
        .status(400)
        .json({ message: `customer with id ${req.params.id} not found` });
    } else {
      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json(updatedCustomer);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
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
