// routes/adminResponsesRoutes.js
const express = require('express');
const router = express.Router();
const validateUUID = require('../middlewares/validateUUID');
const adminResponsesController = require('../controllers/adminResponsesController');
const pool = require('../config/db'); // ✅ Import database connection

/**
 * ✅ GET: Fetch all responses sent by a specific admin
 * This now uses `admin_user_id` instead of `user_id`.
 */
router.get("/admin/:adminId", validateUUID('adminId'), async (req, res) => {
  const { adminId } = req.params;

  try {
    const query = `
      SELECT 
        ar.response_id,
        ar.report_id,
        ar.admin_user_id,
        u.name AS admin_name,
        u.phone_number AS admin_phone,
        ws.water_source_type,
        ar.comments,
        ar.status,
        ar.date_sent
      FROM admin_responses ar
      JOIN users u ON ar.admin_user_id = u.user_id
      JOIN water_sources ws ON ar.water_source_id = ws.water_source_id
      WHERE ar.admin_user_id = $1
      ORDER BY ar.date_sent DESC
    `;

    const result = await pool.query(query, [adminId]);
    res.json(result.rows);

  } catch (err) {
    console.error("❌ Error fetching admin responses:", err);
    res.status(500).json({ message: "Server error fetching responses" });
  }
});

/**
 * ✅ POST: Send a response to a report
 * The `admin_user_id` will be automatically captured from the session
 * inside the controller, so we don’t require it in the request body.
 */
router.post('/', adminResponsesController.sendResponse);

/**
 * ✅ GET: View a specific response by `report_id`
 */
router.get('/:reportId', validateUUID('reportId'), adminResponsesController.getResponseByReportId);

module.exports = router;
