const pool = require('../config/db'); // adjust path if needed

exports.createResponse = async (req, res) => {
  try {
    const { report_id, user_id, comment, status } = req.body;

    if (!report_id || !user_id || !comment || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 1. Insert response into admin_responses table
    await pool.query(
      `INSERT INTO admin_responses (report_id, user_id, comments, status, date_sent)
       VALUES ($1, $2, $3, $4, NOW())`,
      [report_id, user_id, comment, status]
    );

    // 2. Update the report status in reports table
    await pool.query(
      `UPDATE reports SET status = $1 WHERE report_id = $2`,
      [status, report_id]
    );

    // (Optional: insert into notifications table here if needed)

    res.status(201).json({ message: '✅ Response submitted successfully' });

  } catch (error) {
    console.error('❌ Error creating admin response:', error);
    res.status(500).json({ message: 'Server error while creating response' });
  }
};
