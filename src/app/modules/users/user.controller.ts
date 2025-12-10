import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UsersService } from "./user.service";
const getAllUsers = catchAsync(async (req, res) => {
  const users = await UsersService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users retrieved successfully",
    data: users,
  });
});
const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const isAdmin = req.user?.role === "admin";
  const updatedUser = await UsersService.updateUser(userId, req.body, isAdmin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User updated successfully",
    data: updatedUser,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  await UsersService.deleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
  });
});
export const UsersControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
