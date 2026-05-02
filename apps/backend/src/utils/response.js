export const sendResponse = (res, statusCode, success, message, data = null, error = []) => {
  const response = { success, message }
  if (success && data) response.data = data
  if (!success) response.error = error
  res.status(statusCode).json(response)
}