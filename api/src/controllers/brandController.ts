import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
        },
      },
    });

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.brand.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

