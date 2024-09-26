import { Positions } from "../models/Positions.model.js";
import { Applications } from "../models/Applications.model.js";

const createPosition = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newPosition =await Positions.create({ title, description });
    res.status(201).json({message:"Position created Successfully",data:newPosition});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePosition = async (req, res) => {
  const { PositionId } = req.params;
  const updateData = req.body;

  try {
    const position = await Positions.findById(PositionId);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    if (updateData.status && updateData.status === "Closed") {
      // Update the position status
      await Positions.findByIdAndUpdate(PositionId, { status: "Closed" }, { new: true });

      await Applications.updateMany(
        { positionId: PositionId },
        { $set: { status: "Rejected" } }
      );

      return res
        .status(200)
        .json({ message: "Position closed and applications updated" });
    }

    const updatedPosition = await Positions.findByIdAndUpdate(PositionId, updateData, {
      new: true,
    });
    res.status(200).json({message:`Position updated successfully`,data:updatedPosition});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllPositions = async (req, res) => {
  try {
    const positions = await Positions.find({status:"Open"});
    res.status(200).json({message:`Positions fetched successfully`,data:positions});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPositionById = async (req, res) => {
  const { PositionId } = req.params;
  try {
    const position = await Positions.findById(PositionId);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json({message:`Position with id : ${PositionId} fetched successfully`,data:position});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export {createPosition,getAllPositions,getPositionById,updatePosition}

