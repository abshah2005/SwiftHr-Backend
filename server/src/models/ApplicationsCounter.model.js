import mongoose,{Schema} from 'mongoose';

const applicationCounterSchema = new Schema({
  currentNumber: { type: Number, default: 0 },
});


export const ApplicationCounter = mongoose.model('ApplicationCounter', applicationCounterSchema);

