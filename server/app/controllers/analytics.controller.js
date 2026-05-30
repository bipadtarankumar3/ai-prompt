const db = require('../config/database');
const { success } = require('../helpers/response.helper');

class AnalyticsController {
  async trackEvent(req, res, next) {
    try {
      const { eventType, targetId, metadata } = req.body;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      if (!eventType) {
        return res.status(400).json({ success: false, message: 'Event type is required' });
      }

      await db.query(
        `INSERT INTO analytics_events (ae_event_type, ae_target_id, ae_ip, ae_metadata)
         VALUES ($1, $2, $3, $4)`,
        [eventType, targetId || null, ip, JSON.stringify(metadata || {})]
      );

      return success(res, null, 'Analytics event tracked successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnalyticsController();
