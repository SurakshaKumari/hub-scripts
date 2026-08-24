const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/scripts/:scriptId/comments
const getComments = async (req, res) => {
  try {
    const { scriptId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { scriptId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { username: true, avatar: true } },
      },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/scripts/:scriptId/comments  (auth required)
const addComment = async (req, res) => {
  try {
    const { scriptId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const script = await prisma.script.findUnique({ where: { id: scriptId } });
    if (!script) return res.status(404).json({ message: 'Script not found' });

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: req.user.id,
        scriptId,
      },
      include: {
        user: { select: { username: true, avatar: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/scripts/:scriptId/comments/:commentId  (owner or admin)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isOwner = comment.userId === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getComments, addComment, deleteComment };
