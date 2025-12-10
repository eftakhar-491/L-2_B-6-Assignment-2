import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { UsersControllers } from "./user.controller";

const router = Router();

router.get("/", checkAuth("admin"), UsersControllers.getAllUsers);
router.put(
  "/:userId",
  checkAuth("admin", "customer"),
  UsersControllers.updateUser
);
router.delete("/:userId", checkAuth("admin"), UsersControllers.deleteUser);

export const UsersRoutes = router;
