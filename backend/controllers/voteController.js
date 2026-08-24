const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/scripts/:scriptId/vote  (auth required)
// Toggles: same type => delete, different type => update, none => create
const voteScript = async (req, res) => {
  try {
    const { scriptId } = req.params;
    const { type } = req.body; // "UP" or "DOWN"

    if (!['UP', 'DOWN'].includes(type)) {
      return res.status(400).json({ message: 'Vote type must be "UP" or "DOWN"' });
    }

    const script = await prisma.script.findUnique({ where: { id: scriptId } });
    if (!script) return res.status(404).json({ message: 'Script not found' });

    const existingVote = await prisma.vote.findUnique({
      where: { userId_scriptId: { userId: req.user.id, scriptId } },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // Same type — toggle off (delete)
        await prisma.vote.delete({ where: { id: existingVote.id } });
      } else {
        // Different type — update
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
      }
    } else {
      // No existing vote — create
      await prisma.vote.create({
        data: { type, userId: req.user.id, scriptId },
      });
    }

    // Return updated counts
    const [upvotes, downvotes] = await Promise.all([
      prisma.vote.count({ where: { scriptId, type: 'UP' } }),
      prisma.vote.count({ where: { scriptId, type: 'DOWN' } }),
    ]);

    res.json({ upvotes, downvotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { voteScript };
