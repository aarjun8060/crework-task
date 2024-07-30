import { Router } from "express";
import { auth } from "../../middlewares/auth.middlewares.js"
import { PLATFORM } from "../../constants.js"
import { 
    addTask,
    findAllTask, 
    getTask,
    softDeleteTask,
    updateTask
} from "../../controllers/userapp/v1/task.Controller.js";

const router = Router()

router.route("/create").post(auth(PLATFORM.USERAPP),addTask);
router.route('/list').post(auth(PLATFORM.USERAPP),findAllTask);
router.route('/get/:id').get(auth(PLATFORM.USERAPP),getTask);
router.route('/update/:id').put(auth(PLATFORM.USERAPP),updateTask);
router.route('/soft-delete/:id').delete(auth(PLATFORM.PLATFORM),softDeleteTask);

export default router