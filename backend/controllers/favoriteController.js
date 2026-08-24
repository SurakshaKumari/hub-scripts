const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/favorites  (auth required)
const getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        script: {
          include: {
            author: { select: { username: true, avatar: true } },
            _count: { select: { votes: true, comments: true } },
          },
        },
      },
    });

    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/favorites/:scriptId  (auth required)
// If favorited → unfavorite; if not → favorite
const toggleFavorite = async (req, res) => {
  try {
    const { scriptId } = req.params;

    const script = await prisma.script.findUnique({ where: { id: scriptId } });
    if (!script) return res.status(404).json({ message: 'Script not found' });

    const existing = await prisma.favorite.findUnique({
      where: { userId_scriptId: { userId: req.user.id, scriptId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ isFavorited: false });
    } else {
      await prisma.favorite.create({
        data: { userId: req.user.id, scriptId },
      });
      return res.json({ isFavorited: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFavorites, toggleFavorite };
