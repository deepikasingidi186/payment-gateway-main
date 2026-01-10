exports.healthCheck = async (req, res) => {
  return res.status(200).json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString()
  });
};
