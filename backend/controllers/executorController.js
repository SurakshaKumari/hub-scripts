const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/executors
const getExecutors = async (req, res) => {
  try {
    const executors = await prisma.executor.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(executors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/executors/:id
const getExecutorById = async (req, res) => {
  try {
    const executor = await prisma.executor.findUnique({ where: { id: req.params.id } });
    if (!executor) return res.status(404).json({ message: 'Executor not found' });
    res.json(executor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/executors  (admin only)
const createExecutor = async (req, res) => {
  try {
    const { name, description, imageUrl, downloadUrl, isVerified, isFeatured } = req.body;

    if (!name || !description || !downloadUrl) {
      return res.status(400).json({ message: 'name, description, and downloadUrl are required' });
    }

    const executor = await prisma.executor.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        downloadUrl,
        isVerified: Boolean(isVerified),
        isFeatured: Boolean(isFeatured),
      },
    });

    res.status(201).json(executor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/executors/:id  (admin only)
const updateExecutor = async (req, res) => {
  try {
    const executor = await prisma.executor.findUnique({ where: { id: req.params.id } });
    if (!executor) return res.status(404).json({ message: 'Executor not found' });

    const { name, description, imageUrl, downloadUrl, isVerified, isFeatured } = req.body;

    const updated = await prisma.executor.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(downloadUrl && { downloadUrl }),
        ...(isVerified !== undefined && { isVerified: Boolean(isVerified) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/executors/:id  (admin only)
const deleteExecutor = async (req, res) => {
  try {
    const executor = await prisma.executor.findUnique({ where: { id: req.params.id } });
    if (!executor) return res.status(404).json({ message: 'Executor not found' });

    await prisma.executor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Executor deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getExecutors, getExecutorById, createExecutor, updateExecutor, deleteExecutor };
