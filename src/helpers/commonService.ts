import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from 'src/constants/api-response-code.constant';

export const sendResponse = async (res, status, message, data) => {
  return res.status(status).json({ status, message, data });
};

export const handleErrorResponse = async (res, error) => {
  return res.status(500).json({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ErrorResponse.INTERNAL_SERVER_ERROR,
    data: error.message,
  });
};
