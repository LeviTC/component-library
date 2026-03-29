const express = require('express');
const ComponentTrack = require('../models/ComponentTrack');
const { asyncHandler } = require('../utils/asyncHandler');
const { validateTrackBody } = require('../middleware/validateTrack');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * POST /api/components/track — público
 */
router.post(
  '/track',
  validateTrackBody,
  asyncHandler(async (req, res) => {
    const doc = await ComponentTrack.create(req.body);
    console.log(
      `[track] ${doc.componentName} / ${doc.action}${doc.variant ? ` (${doc.variant})` : ''}`,
    );
    res.status(201).json({
      id: String(doc._id),
      componentName: doc.componentName,
      variant: doc.variant,
      action: doc.action,
      createdAt: doc.createdAt,
    });
  }),
);

/**
 * GET /api/components/stats — público
 */
router.get(
  '/stats',
  asyncHandler(async (_req, res) => {
    const totalEvents = await ComponentTrack.countDocuments();
    const byComponent = await ComponentTrack.aggregate([
      { $group: { _id: '$componentName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);
    const byAction = await ComponentTrack.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { action: '$_id', count: 1, _id: 0 } },
    ]);
    const last = await ComponentTrack.findOne()
      .sort({ createdAt: -1 })
      .select('createdAt componentName action variant')
      .lean();

    res.json({
      totalEvents,
      byComponent,
      byAction,
      lastEvent: last
        ? {
            at: last.createdAt,
            componentName: last.componentName,
            action: last.action,
            variant: last.variant,
          }
        : null,
      updatedAt: new Date().toISOString(),
    });
  }),
);

function escapeCsvField(value) {
  if (value == null) return '""';
  const s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

/**
 * GET /api/components/export?format=csv|json — requiere JWT
 */
router.get(
  '/export',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const format = (req.query.format || 'csv').toLowerCase();
    const limit = Math.min(
      Number(req.query.limit) || 5000,
      20000,
    );

    const rows = await ComponentTrack.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`[export] ${format} ${rows.length} filas (user ${req.user?.sub})`);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="component-tracking.json"',
      );
      return res.send(JSON.stringify(rows, null, 2));
    }

    const header = [
      'timestamp',
      'componentName',
      'variant',
      'action',
      'metadata',
    ];
    const lines = [
      header.map(escapeCsvField).join(','),
      ...rows.map((r) =>
        [
          r.createdAt?.toISOString?.() || r.createdAt,
          r.componentName,
          r.variant ?? '',
          r.action,
          r.metadata != null ? JSON.stringify(r.metadata) : '',
        ]
          .map(escapeCsvField)
          .join(','),
      ),
    ];
    const csv = `\uFEFF${lines.join('\n')}`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="component-tracking.csv"',
    );
    return res.send(csv);
  }),
);

module.exports = router;
