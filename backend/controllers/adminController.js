const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/admin/scripts
const getAllScripts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};
    const [scripts, total] = await Promise.all([
      prisma.script.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, username: true } } },
      }),
      prisma.script.count({ where }),
    ]);
    res.json({ scripts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/scripts/:id/approve
const approveScript = async (req, res) => {
  try {
    const script = await prisma.script.update({
      where: { id: req.params.id },
      data: { status: 'approved' },
      include: { author: true },
    });
    await prisma.notification.create({
      data: { userId: script.authorId, message: `Your script "${script.title}" has been approved! 🎉` },
    });
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/scripts/:id/reject
const rejectScript = async (req, res) => {
  try {
    const { reason } = req.body;
    const script = await prisma.script.update({
      where: { id: req.params.id },
      data: { status: 'rejected' },
    });
    await prisma.notification.create({
      data: { userId: script.authorId, message: `Your script "${script.title}" was rejected. ${reason ? 'Reason: ' + reason : ''}` },
    });
    res.json(script);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/scripts/:id/verify
const toggleVerified = async (req, res) => {
  try {
    const script = await prisma.script.findUnique({ where: { id: req.params.id } });
    const updated = await prisma.script.update({
      where: { id: req.params.id },
      data: { isVerified: !script.isVerified },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/scripts/:id/bump
const toggleBumped = async (req, res) => {
  try {
    const script = await prisma.script.findUnique({ where: { id: req.params.id } });
    const updated = await prisma.script.update({
      where: { id: req.params.id },
      data: { isBumped: !script.isBumped },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, isBanned: true, createdAt: true, _count: { select: { scripts: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/users/:id/ban
const toggleBanUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: !user.isBanned },
      select: { id: true, username: true, isBanned: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'moderator', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, username: true, role: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalScripts, totalUsers, pendingScripts, approvedScripts, totalExecutors, submissionsToday] = await Promise.all([
      prisma.script.count(),
      prisma.user.count(),
      prisma.script.count({ where: { status: 'pending' } }),
      prisma.script.count({ where: { status: 'approved' } }),
      prisma.executor.count(),
      prisma.script.count({ where: { createdAt: { gte: today } } }),
    ]);
    res.json({ totalScripts, totalUsers, pendingScripts, approvedScripts, totalExecutors, submissionsToday });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllScripts, approveScript, rejectScript, toggleVerified, toggleBumped, getAllUsers, toggleBanUser, updateUserRole, getAnalytics };
