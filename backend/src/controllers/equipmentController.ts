import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllEquipments = async (req: Request, res: Response) => {
  try {
    const equipments = await prisma.equipment.findMany();
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAvailableEquipments = async (req: Request, res: Response) => {
  try {
    const equipments = await prisma.equipment.findMany({
      where: {
        availableQuantity: { gt: 0 },
        status: 'AVAILABLE'
      }
    });
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const { name, totalQuantity, status } = req.body;
    
    const equipment = await prisma.equipment.create({
      data: {
        name,
        totalQuantity,
        availableQuantity: totalQuantity, // initially all are available
        status: status || 'AVAILABLE',
      },
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, totalQuantity, availableQuantity, status } = req.body;

    const equipment = await prisma.equipment.update({
      where: { id: Number(id) },
      data: {
        name,
        totalQuantity,
        availableQuantity,
        status,
      },
    });

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.equipment.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
