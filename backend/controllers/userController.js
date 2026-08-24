const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/users/:username  (public profile)
const getPublicProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true, username: true, avatar: true, role: true, createdAt: true,
        _count: { select: { scripts: true } },
        scripts: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' },
          include: { _count: { select: { votes: true, comments: true } } },
        },
      },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/profile  (auth required)
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar },
      select: { id: true, username: true, email: true, avatar: true, role: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/users/notifications  (auth required)
const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/users/notifications/read  (auth required)
const markNotificationsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPublicProfile, updateAvatar, getNotifications, markNotificationsRead };
