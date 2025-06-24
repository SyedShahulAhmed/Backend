import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";

const healthCheck = asynchandler(async (req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(200, "OK", "HealthCheck Passed"));
});


export { healthCheck };