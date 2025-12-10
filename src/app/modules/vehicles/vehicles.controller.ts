import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { VehiclesService } from "./vehicles.service";

const addNewVehicles = catchAsync(async (req, res) => {
  // Logic to create a vehicle
  console.log("req.body", req.body, req.user);
  const vehicle = await VehiclesService.addNewVehicles(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Vehicle created successfully",
    data: vehicle,
  });
});
const getAllVehicles = catchAsync(async (req, res) => {
  const vehicles = await VehiclesService.getAllVehicles();
  if (vehicles.length === 0) {
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "No vehicles found",
      data: [],
    });
    return;
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vehicles retrieved successfully",
    data: vehicles,
  });
});

const getSingleVehicle = catchAsync(async (req, res) => {
  const vehicleId = req.params.vehicleId;
  const vehicle = await VehiclesService.getSingleVehicle(vehicleId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vehicle retrieved successfully",
    data: vehicle,
  });
});
const updateSingleVehicle = catchAsync(async (req, res) => {
  const vehicleId = req.params.vehicleId;
  const updatedVehicle = await VehiclesService.updateSingleVehicle(
    vehicleId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vehicle updated successfully",
    data: updatedVehicle,
  });
});

const deleteSingleVehicle = catchAsync(async (req, res) => {
  const vehicleId = req.params.vehicleId;
  await VehiclesService.deleteSingleVehicle(vehicleId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Vehicle deleted successfully",
  });
});

export const VehiclesControllers = {
  addNewVehicles,
  getAllVehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deleteSingleVehicle,
};
