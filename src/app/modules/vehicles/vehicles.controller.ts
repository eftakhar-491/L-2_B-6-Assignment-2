const addNewVehicles = (req, res) => {
  // Logic to create a vehicle
  res.status(201).send({ message: "Vehicle created successfully" });
};
const viewAllVehicles = (req, res) => {
  // Logic to create a vehicle
  res.status(201).send({ message: "Vehicle created successfully" });
};

export const VehiclesControllers = { addNewVehicles, viewAllVehicles };
