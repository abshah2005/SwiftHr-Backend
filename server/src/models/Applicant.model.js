import mongoose,{Schema} from "mongoose";
const ApplicantSchema = new Schema(
    {
      firstname:{
        type:String,
        required:true,
      },
      lastname:{
        type:String,
        required:true,
      },
      email:{
        type:String,
        required:true
      },
      phonenumber:{
        type:String,
        required:true
      },
      whatsappnumber:{
        type:String,
        required:true
      },
      gender:{
        type:String,
        enum: ['Male', 'Female', 'Others'],
        required:true
      },
      Country:{
        type:String,
        required:true
      },
      CV:{
        type:String,
        required:true
      },
      CoverLetter:{
        type:String,
        required:true
      }
    },
    { timestamps: true }
  );

  export const Applicants = mongoose.model("Applicants", ApplicantSchema);
