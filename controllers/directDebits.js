const Customer = require("../models/customers");
const ObjectID = require("mongodb").ObjectId;

exports.createDirectDebitByCustomerId = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    console.log("the body", req.body, req.params.id);
    if (!customer) {
      res
        .status(400)
        .json({ message: `customer with id ${req.params.id} not found` });
    } else {
      console.log("Inside the update direct debit");
      const updatedDirectDebit = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { directDebit: req.body } },
        {
          new: true,
        }
      );

      console.log("after update", updatedDirectDebit);
      res.status(200).json(updatedDirectDebit);
    }
  } catch (error) {
    next(error);
  }
};
exports.getDirectDebitByCustomerId = async (req, res, next) => {
  const id = req.params.id;

  try {
    const pipeline = [
      {
        $unwind: {
          path: "$directDebit",
        },
      },
      {
        $match: {
          _id: new ObjectID(id),
        },
      },
      {
        $project: {
          description: "$directDebit.description",
          startDate: "$directDebit.startDate",
          amount: "$directDebit.amount",
          frequency: "$directDebit.frequency",
          active: "$directDebit.active",
          _id: "$directDebit._id",
        },
      },
      {
        $sort: {
          description: 1,
        },
      },
    ];

    const directDebit = await Customer.aggregate(pipeline);

    if (directDebit) {
      res.status(200).json(directDebit);
    } else {
      res.status(404).json({ message: `customer with id ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteDirectDebitById = async (req, res, next) => {
  const custId = req.params.id;
  const ddId = req.params.ddId;
  try {
    const directDebit = await Customer.updateOne(
      { _id: custId },
      { $pull: { directDebit: { _id: ddId } } }
    );

    console.log("the Direct Debit", directDebit);
    if (!directDebit) {
      res
        .status(400)
        .json({ message: `Direct Debit with id ${req.params.ddId} not found` });
    } else {
      res.status(200).json({ id: ddId });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateDirectDebitById = async (req, res, next) => {
  try {
    console.log("Direct Debit data", req.body);
    const directDebit = await Customer.updateOne(
      { "directDebit._id": req.params.id },
      {
        $set: {
          "directDebit.$.description": req.body.description,
          "directDebit.$.startDate": req.body.startDate,
          "directDebit.$.amount": req.body.amount,
          "directDebit.$.frequency": req.body.frequency,
          "directDebit.$.active": req.body.active,
        },
      }
    );

    res.status(202).json(directDebit);
  } catch (error) {
    next(error);
  }
};
