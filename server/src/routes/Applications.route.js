import { Router } from "express";
const router = Router();
import { upload } from "../middlewares/Multer.middleware.js";
import {
  getUserApplications,
  applyForPosition,
  getAllApplications,
  getApplicationbyTid,
  getAllApplicants,
  updateApplication,
} from "../controllers/Applications.controllers.js";

router.post("/apply", upload.single("CV"), applyForPosition);
router.route("/getapplications/:applicantId").get(getUserApplications);
router.route("/getAllapplications").get(getAllApplications);
router.route("/getApplicationbyTid/:trackingId").get(getApplicationbyTid);
router.route("/getAllApplicants").get(getAllApplicants);
router.route("/updateApplicationstatus").put(updateApplication);
export default router;
