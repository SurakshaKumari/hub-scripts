const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get all approved scripts with filters
// @route   GET /api/scripts
// @access  Public
const getScripts = async (req, res) => {
  try {
    const { category, game, sort, keyless, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { status: 'approved' };
    if (category) where.category = category;
    if (game) where.game = { contains: game, mode: 'insensitive' };
    if (keyless === 'true') where.isKeyless = true;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    let orderBy = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { viewCount: 'desc' };
    if (sort === 'votes') orderBy = { votes: { _count: 'desc' } };

    const [scripts, total] = await Promise.all([
      prisma.script.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          author: { select: { id: true, username: true, avatar: true } },
          _count: { select: { votes: true, comments: true, favorites: true } },
        },
      }),
      prisma.script.count({ where }),
    ]);

    res.json({ scripts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trending scripts (top by viewCount)
// @route   GET /api/scripts/trending
// @access  Public
const getTrendingScripts = async (req, res) => {
  try {
    const scripts = await prisma.script.findMany({
      where: { status: 'approved' },
      orderBy: { viewCount: 'desc' },
      take: 10,
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        _count: { select: { votes: true, comments: true } },
      },
    });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured/bumped scripts
// @route   GET /api/scripts/featured
// @access  Public
const getFeaturedScripts = async (req, res) => {
  try {
    const scripts = await prisma.script.findMany({
      where: { status: 'approved', OR: [{ isBumped: true }, { isVerified: true }] },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        _count: { select: { votes: true, comments: true } },
      },
    });
    res.json(scripts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single script by ID
// @route   GET /api/scripts/:id
// @access  Public
const getScriptById = async (req, res) => {
  try {
    const script = await prisma.script.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        _count: { select: { votes: true, comments: true, favorites: true } },
        votes: { select: { type: true, userId: true } },
      },
    });

    if (!script) return res.status(404).json({ message: 'Script not found' });

    // Increment view count
    await prisma.script.update({ where: { id: req.params.id }, data: { viewCount: { increment: 1 } } });

    const upvotes = script.votes.filter(v => v.type === 'UP').length;
    const downvotes = script.votes.filter(v => v.type === 'DOWN').length;

    res.json({ ...script, upvotes, downvotes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new script submission
// @route   POST /api/scripts
// @access  Private
const createScript = async (req, res) => {
  try {
    const { title, description, code, game, category, thumbnailUrl, isKeyless } = req.body;
    const script = await prisma.script.create({
      data: {
        title, description, code, game,
        category: category || 'General',
        thumbnailUrl: thumbnailUrl || null,
        isKeyless: isKeyless === true || isKeyless === 'true',
        authorId: req.user.id,
        status: 'pending',
      },
    });
    res.status(201).json(script);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a script
// @route   PUT /api/scripts/:id
// @access  Private (author or admin)
const updateScript = async (req, res) => {
  try {
    const script = await prisma.script.findUnique({ where: { id: req.params.id } });
    if (!script) return res.status(404).json({ message: 'Script not found' });
    if (script.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await prisma.script.update({ where: { id: req.params.id }, data: req.body });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a script
// @route   DELETE /api/scripts/:id
// @access  Private (author or admin)
const deleteScript = async (req, res) => {
  try {
    const script = await prisma.script.findUnique({ where: { id: req.params.id } });
    if (!script) return res.status(404).json({ message: 'Script not found' });
    if (script.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await prisma.script.delete({ where: { id: req.params.id } });
    res.json({ message: 'Script deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get scripts belonging to the authenticated user
// @route   GET /api/scripts/my-scripts
// @access  Private
const getUserScripts = async (req, res) => {
  try {
    const scripts = await prisma.script.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        _count: { select: { votes: true, comments: true, favorites: true } },
      },
    });
    res.json(scripts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top games by script count
// @route   GET /api/scripts/top-games
// @access  Public
const getTopGames = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const grouped = await prisma.script.groupBy({
      by: ['game'],
      where: { status: 'approved' },
      _count: { game: true },
      orderBy: { _count: { game: 'desc' } },
      take: limit,
    });

    const games = grouped.map(g => ({
      game: g.game,
      count: g._count.game,
    }));

    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getScripts, getTrendingScripts, getFeaturedScripts, getScriptById, createScript, updateScript, deleteScript, getUserScripts, getTopGames };
