const express = require('express');
const loggingMiddleware = require('./middleware/loggingMiddleware');
const { fetchExternalNotifications, buildPriorityResponse } = require('./services/notificationService');

const app = express();
app.use(express.json());
app.use(loggingMiddleware);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Notification service is running.' });
});

app.post('/notifications', (req, res) => {
  const notification = req.body;
  res.status(201).json({
    message: 'Notification received',
    notification,
  });
});

app.get('/notifications/sample', (req, res) => {
  res.json({
    notifications: [
      { id: 1, type: 'placement', title: 'Campus placement update', unread: true },
      { id: 2, type: 'event', title: 'Career fair tomorrow', unread: false },
      { id: 3, type: 'result', title: 'Exam results declared', unread: true },
    ],
  });
});

app.get('/notifications/fetch', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit || req.query.top) || 10));
    const page = Math.max(1, Number(req.query.page) || 1);
    const notificationType = req.query.notification_type ? String(req.query.notification_type).toLowerCase() : null;
    const allowedTypes = ['placement', 'result', 'event'];

    if (notificationType && !allowedTypes.includes(notificationType)) {
      return res.status(400).json({
        error: 'notification_type must be one of placement, result, or event',
      });
    }

    const notifications = await fetchExternalNotifications({
      limit,
      page,
      notification_type: notificationType,
    });

    res.json(buildPriorityResponse(notifications, limit, page, notificationType));
  } catch (error) {
    console.error('Failed to fetch notifications:', error.message);
    res.status(502).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Notification service listening on http://localhost:${port}`);
});
