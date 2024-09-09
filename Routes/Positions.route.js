import {Router} from 'express';
import { getPositionById,getAllPositions,updatePosition,createPosition } from '../Controllers/Positions.controllers.js';
// import { authenticateToken } from '../middlewares/roleMiddleware.js';
// import { authorizeHRManager } from '../middlewares/roleMiddleware.js';
const router = Router();

router.route("/createPosition").post(createPosition)
router.route("/getAllPositions").get(getAllPositions)
router.route("/getPositionbyId/:PositionId").get(getPositionById)
router.route("/updatePosition/:PositionId").put(updatePosition)

export default router;
