import { Applications } from "../models/Applications.model.js";
import { Positions } from "../models/Positions.model.js";
import { Applicants } from "../models/Applicant.model.js";
import { Apierror } from "../utils/Apierror.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";
import { generateApplicationId } from "../utils/GenerateTrackId.js";
import {
  sendApplicationTrackingId,
  sendInterviewDetails,
  sendAssessmentDetails,
  sendOfferLetter,
  sendRejectionNotification,
} from "../utils/emailService.js";

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

  const CV = req.file;
  if (!CV) {
    return res.status(400).json({ message: "No CV uploaded" });
  }

  const filepath = CV.path;
  const CVup = await uploadonCloudinary(filepath);

  if (!CVup || !CVup.url) {
    return res.status(500).json({ message: "File not uploaded to Cloudinary" });
  }

  const fileurl = CVup.url;

  try {
    const position = await Positions.findById(positionId);
    if (!position || position.status === "Closed") {
      return res
        .status(400)
        .json({ message: "This position is not available" });
    }

    let applicant = await Applicants.findOne({ email });

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

    await sendApplicationTrackingId(email, TrackingId);

    const application = await Applications.create({
      ApplicantId: applicant._id,
      positionId: position._id,
      trackingId: TrackingId,
    });

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateApplication = async (req, res) => {
  const {
    applicationId,
    status,
    interviewDate,
    googleMeetLink,
    assessmentDetails,
    assessmentLink,
    offerLetterLink,
  } = req.body;
  if (!applicationId || !status) {
    return res
      .status(400)
      .json({ message: "Application ID and status are required" });
  }

  try {
    const application = await Applications.findById(applicationId).populate(
      "ApplicantId"
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const applicantEmail = application.ApplicantId.email;

    switch (status) {
      case "Interview":
        if (!interviewDate || !googleMeetLink) {
          return res.status(400).json({
            message: "Interview date and Google Meet link are required",
          });
        }
        application.userAction = {
          interviewDate,
          googleMeetLink,
        };
        await sendInterviewDetails(
          applicantEmail,
          interviewDate,
          googleMeetLink
        );
        break;

      case "Assessment Required":
        if (!assessmentDetails || !assessmentLink) {
          return res
            .status(400)
            .json({ message: "Assessment details and link are required" });
        }
        application.userAction = {
          assessmentDetails,
          assessmentLink,
        };
        await sendAssessmentDetails(
          applicantEmail,
          assessmentDetails,
          assessmentLink
        );
        break;

      case "Offered":
        if (!offerLetterLink) {
          return res
            .status(400)
            .json({ message: "Offer letter link is required" });
        }
        await Positions.findByIdAndUpdate(
          application.positionId,
          { $set: { status: "Closed" } },
          { new: true, useFindAndModify: false }
        );
        application.userAction = {
          offerLetterLink,
        };
        await Applications.updateMany(
          { positionId: application.positionId },
          { $set: { status: "Rejected" } }
        );
        await sendOfferLetter(applicantEmail, offerLetterLink);
        break;

      case "Rejected":
        application.userAction = {};
        await sendRejectionNotification(applicantEmail);
        break;

      // case "Applied":
      //   application.userAction = {};
      //   // await SubmissionNotification(applicantEmail);
      //   break;

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
    const applications = await Applications.find({
      ApplicantId: applicantId,
    }).populate(["positionId", "ApplicantId"]);
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Applications.find({ status: "Open" }).populate([
      "ApplicantId",
      "positionId",
    ]);
    if (!applications) {
      throw new Apierror(404, "No applications found");
    }
    res.status(200).json({
      message: "Applications fetched Successfully",
      data: applications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getApplicationbyTid = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const application = await Applications.findOne({
      trackingId: trackingId,
    }).populate("ApplicantId");

    if (!application) {
      // Return a 404 status code directly
      return res.status(404).json({
        message: "No application found for the corresponding tracking ID",
      });
    }

    // If application is found, return success response
    res
      .status(200)
      .json({ message: "Application fetched successfully", application });
  } catch (err) {
    // Handle server errors with a 500 response
    res.status(500).json({ message: err.message });
  }
};
const getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicants.find();
    if (!applicants) {
      throw new Apierror(404, "No applicants found");
    }
    res
      .status(200)
      .json({ message: "Applicants fetched Successfully", applicants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  applyForPosition,
  getUserApplications,
  getAllApplications,
  getApplicationbyTid,
  getAllApplicants,
  updateApplication,
};
