const Customer = require("../models/customers");

const ObjectID = require("mongodb").ObjectId;

exports.createWorkstationByCustomerId = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    console.log("the body", req.body, req.params.id);
    if (!customer) {
      res
        .status(400)
        .json({ message: `customer with id ${req.params.id} not found` });
    } else {
      console.log("Inside the update workstation");
      const updatedWorkstation = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { workstation: req.body } },
        {
          new: true,
        }
      );

      console.log("after update", updatedWorkstation);
      res.status(200).json(updatedWorkstation);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkstationById = async (req, res, next) => {
  const custId = req.params.id;
  const wsId = req.params.wsId;
  try {
    const customer = await Customer.updateOne(
      { _id: custId },
      { $pull: { workstation: { _id: wsId } } }
    );

    console.log("the workstation", customer);
    if (!customer) {
      res
        .status(400)
        .json({ message: `workstation with id ${req.params.wsId} not found` });
    } else {
      res.status(200).json({ id: wsId });
    }
  } catch (error) {
    next(error);
  }
};

exports.getWorkstationByCustomerId = async (req, res, next) => {
  const id = req.params.id;

  try {
    const pipeline = [
      {
        $unwind: {
          path: "$workstation",
        },
      },
      {
        $match: {
          _id: new ObjectID(id),
        },
      },
      {
        $project: {
          workstationName: "$workstation.workstationName",
          anydeskId: "$workstation.anydeskId",
          teamviewerId: "$workstation.teamviewerId",
          keyNumber: "$workstation.keyNumber",
          licenseExpiryDate: "$workstation.licenseExpiryDate",
          _id: "$workstation._id",
        },
      },
      {
        $sort: {
          workstationName: 1,
        },
      },
    ];

    const workstation = await Customer.aggregate(pipeline);

    if (workstation) {
      res.status(200).json(workstation);
    } else {
      res.status(404).json({ message: `customer with id ${id} not found` });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateWorkstationById = async (req, res, next) => {
  try {
    console.log("workstation data", req.body);
    const workstation = await Customer.updateOne(
      { "workstation._id": req.params.id },
      {
        $set: {
          "workstation.$.workstationName": req.body.workstationName,
          "workstation.$.anydeskId": req.body.anydeskId,
          "workstation.$.teamviewerId": req.body.teamviewerId,
          "workstation.$.keyNumber": req.body.keyNumber,
          "workstation.$.licenseExpiryDate": req.body.licenseExpiryDate,
        },
      }
    );

    res.status(202).json(workstation);
  } catch (error) {
    next(error);
  }
};
