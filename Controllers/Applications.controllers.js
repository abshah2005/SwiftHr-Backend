import { Applications } from "../Models/Applications.model.js";
import { Positions } from "../Models/Positions.model.js";
import { Applicants } from "../Models/Applicant.model.js";
import { Apierror } from "../Utils/Apierror.js";
import { uploadonCloudinary } from "../Utils/Fileupload.js";
import { generateApplicationId } from "../Utils/GenerateTrackId.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const applyForPosition = async (req, res) => {
  const {
    positionId,
    firstname,
    lastname,
    email,
    phonenumber,
    whatsappnumber,
    gender,
    Country,
    Address,
    CoverLetter,
  } = req.body;

  const CVfile = req.file;
  if (!CVfile) {
    return res.status(400).json({ message: "No CV uploaded" });
  }

  const filepath = CVfile.path;
  const CVup = await uploadonCloudinary(filepath);

  if (!CVup || !CVup.url) {
    return res.status(400).json({ message: "File not uploaded to Cloudinary" });
  }

  const fileurl = CVup.url;

  try {
    const position = await Positions.findById(positionId);
    if (!position || position.status === "Closed") {
      return res.status(400).json({ message: "Position is not available" });
    }

    // Check if the applicant already exists based on the email
    let applicant = await Applicants.findOne({ email });

    // Check if the applicant has already applied for this position
    if (applicant) {
      const existingApplication = await Applications.findOne({
        ApplicantId: applicant._id,
        positionId: positionId,
      });

      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "You have already applied for this position" });
      }
    }

    if (!applicant) {
      applicant = await Applicants.create({
        firstname,
        lastname,
        email,
        phonenumber,
        whatsappnumber,
        gender,
        Country,
        Address,
        CV: fileurl,
        CoverLetter,
      });
    } else {
      applicant = await Applicants.findByIdAndUpdate(
        applicant._id,
        {
          firstname,
          lastname,
          phonenumber,
          whatsappnumber,
          gender,
          Country,
          Address,
          CV: fileurl,
          CoverLetter,
        },
        { new: true }
      );
    }

    const TrackingId = await generateApplicationId(position.title);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Application tracking ID",
      text: `Your Application tracking ID is ${TrackingId}.You can check your application status using this Application ID anytime`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Email sent: " + info.response);
    });

    const application = await Applications.create({
      ApplicantId: applicant._id,
      positionId: position._id,
      trackingId: TrackingId,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const updateApplication = async (req, res) => {
  const {
    status,
    interviewDate,
    googleMeetLink,
    assessmentDetails,
    assessmentLink,
    offerLetterLink,
    applicationId
  } = req.body;
  if (!applicationId || !status) {
    return res.status(400).json({ message: "Application ID and status are required" });
  }

  try {
    const application = await Applications.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    switch (status) {
      case "Interviewed":
        if (!interviewDate || !googleMeetLink) {
          return res.status(400).json({ message: "Interview date and Google Meet link are required" });
        }
        application.userAction = {
          interviewDate,
          googleMeetLink
        };
        break;

      case "Assessment Required":
        if (!assessmentDetails || !assessmentLink) {
          return res.status(400).json({ message: "Assessment details and link are required" });
        }
        application.userAction = {
          assessmentDetails,
          assessmentLink
        };
        break;

      case "Offered":
        if (!offerLetterLink) {
          return res.status(400).json({ message: "Offer letter link is required" });
        }
        const closePosition=await Positions.findByIdAndUpdate(application.positionId,{$set:{status:"Closed"}},{ new: true, useFindAndModify: false })
        application.userAction = {
          offerLetterLink
        };
        break;

      case "Rejected":
        application.userAction = {};
        break;

      case "Applied":
        application.userAction = {};
        break;

      default:
        return res.status(400).json({ message: "Invalid status" });
    }

    application.status = status;

    const updatedApplication = await application.save();

    res.status(200).json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserApplications = async (req, res) => {
  const { applicantId } = req.params;
  try {
    const applications = await Applications.find({ applicantId }).populate([
      "positionId",
      "ApplicantId",
    ]);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Applications.find().populate(["ApplicantId","positionId"]);
    if (!applications) {
      throw new Apierror(404, "No applications found");
    }
    res
      .status(200)
      .json({ message: "Applications fetched Successfully", data:applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getApplicationbyTid = async (req, res) => {
  try {
    const { trackingId } = req.body;

    const application = await Applications.find({trackingId:trackingId}).populate("ApplicantId")
    if (!application) {
      throw new Apierror(404, "No application found of corresponding tracking id");
    }
    res
      .status(200)
      .json({ message: "Application fetched Successfully", application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllApplicants=async(req,res)=>{
  try {
    const applicants = await Applicants.find()
    if (!applicants) {
      throw new Apierror(404, "No applicants found ");
    }
    res
      .status(200)
      .json({ message: "Application fetched Successfully", applicants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export { applyForPosition, getUserApplications, getAllApplications,getApplicationbyTid,getAllApplicants,updateApplication };

// 66ddef618c2198baabbd9733
