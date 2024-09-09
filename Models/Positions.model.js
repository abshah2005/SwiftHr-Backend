import mongoose,{Schema} from "mongoose";

const positionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
},{timestamps:true});

export const Positions=mongoose.model("Positions",positionSchema)
