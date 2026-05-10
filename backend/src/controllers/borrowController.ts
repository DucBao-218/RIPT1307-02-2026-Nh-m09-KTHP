import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// Student: Request to borrow
export const createBorrowRequest = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { equipmentId, borrowDate, returnDate } = req.body;

    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const equipment = await prisma.equipment.findUnique({ where: { id: Number(equipmentId) } });
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    if (equipment.availableQuantity <= 0 || equipment.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Equipment is currently not available' });
    }

    const request = await prisma.borrowRequest.create({
      data: {
        studentId,
        equipmentId: Number(equipmentId),
        borrowDate: new Date(borrowDate),
        returnDate: new Date(returnDate),
        status: 'PENDING',
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Update status (Approve/Reject/Returned)
export const updateBorrowStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const borrowRequest = await prisma.borrowRequest.findUnique({
      where: { id: Number(id) },
      include: { equipment: true }
    });

    if (!borrowRequest) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    if (status === 'APPROVED' && borrowRequest.status !== 'APPROVED') {
      // Approve logic using transaction
      if (borrowRequest.equipment.availableQuantity <= 0) {
        return res.status(400).json({ message: 'Not enough equipment available to approve' });
      }

      await prisma.$transaction([
        prisma.borrowRequest.update({
          where: { id: Number(id) },
          data: { status: 'APPROVED' }
        }),
        prisma.equipment.update({
          where: { id: borrowRequest.equipmentId },
          data: { availableQuantity: { decrement: 1 } }
        })
      ]);
    } else if (status === 'RETURNED' && borrowRequest.status === 'APPROVED') {
      // Return logic
      await prisma.$transaction([
        prisma.borrowRequest.update({
          where: { id: Number(id) },
          data: { status: 'RETURNED' }
        }),
        prisma.equipment.update({
          where: { id: borrowRequest.equipmentId },
          data: { availableQuantity: { increment: 1 } }
        })
      ]);
    } else {
      // Just update status for REJECTED or other non-quantity changing statuses
      await prisma.borrowRequest.update({
        where: { id: Number(id) },
        data: { status }
      });
    }

    res.json({ message: `Borrow request status updated to ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Student: Get own history
export const getMyHistory = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const history = await prisma.borrowRequest.findMany({
      where: { studentId },
      include: { equipment: true },
      orderBy: { borrowDate: 'desc' }
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Get all requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.borrowRequest.findMany({
      include: { equipment: true, student: true },
      orderBy: { borrowDate: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Get top borrowed equipments of the current month
export const getTopBorrowed = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const topBorrowed = await prisma.borrowRequest.groupBy({
      by: ['equipmentId'],
      where: {
        borrowDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: { in: ['APPROVED', 'RETURNED', 'OVERDUE'] } // Count only ones that were actually approved
      },
      _count: {
        equipmentId: true
      },
      orderBy: {
        _count: {
          equipmentId: 'desc'
        }
      },
      take: 10
    });

    // Fetch equipment details for the top borrowed items
    const equipmentIds = topBorrowed.map(item => item.equipmentId);
    const equipments = await prisma.equipment.findMany({
      where: { id: { in: equipmentIds } }
    });

    const result = topBorrowed.map(item => {
      const eq = equipments.find(e => e.id === item.equipmentId);
      return {
        ...eq,
        borrowCount: item._count.equipmentId
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
