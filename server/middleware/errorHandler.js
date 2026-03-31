export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [${new Date().toISOString()}] Error:`, err.stack || err.message)
  res.status(err.status || 500).json({
    error: err.message || 'An internal server error occurred'
  })
}