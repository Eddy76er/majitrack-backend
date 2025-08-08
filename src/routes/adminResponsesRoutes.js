// routes/adminResponsesRoutes.js
const express = require('express');
const router = express.Router();
const validateUUID = require('../middlewares/validateUUID');
const adminResponsesController = require('../controllers/adminResponsesController');

// Get all responses by specific admin (user_id)
router.get("/admin/:adminId", async (req, res) => {
  const { adminId } = req.params;

  try {
    const query = `
      SELECT 
        ar.response_id,
        u.name,
        u.phone_number,
        ws.water_source_type,
        ar.comments,
        ar.date_sent
      FROM admin_responses ar
      JOIN users u ON ar.user_id = u.user_id
      JOIN water_sources ws ON ar.water_source_id = ws.water_source_id
      WHERE ar.user_id = $1
      ORDER BY ar.date_sent DESC
    `;
    const result = await pool.query(query, [adminId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching admin responses:", err);
    res.status(500).json({ message: "Server error fetching responses" });
  }
});

// POST: Send a response to a report
router.post('/', adminResponsesController.sendResponse);

// GET: View a specific response by report_id
router.get('/:reportId', validateUUID('reportId'), adminResponsesController.getResponseByReportId);

module.exports = router;
