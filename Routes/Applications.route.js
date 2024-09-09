import { Router } from "express";
const router = Router();
import { upload } from "../Middlewares/Multer.middleware.js";
import { getUserApplications,applyForPosition,getAllApplications,getApplicationbyTid } from "../Controllers/Applications.controllers.js";

router.post("/apply", upload.single("CV"), applyForPosition);
router.route("/getapplications/:applicantId").get(getUserApplications)
router.route("/getAllapplications").get(getAllApplications)
router.route("/getApplicationbyTid").get(getApplicationbyTid)
export default router;
