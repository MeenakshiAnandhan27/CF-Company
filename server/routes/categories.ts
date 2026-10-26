import { Router, Request, Response } from 'express';
import { query } from '../db/index.ts';

const router = Router();

/**
 * GET /api/categories
 * Returns all active categories with parsed subcategories
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(`
      SELECT 
        c.id, c.name, c.tagline, c.description, c.subcategories, c.pattern_type as "patternType", c.image,
        COUNT(p.id) as "productCount"
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.active = 1
      GROUP BY c.id, c.name, c.tagline, c.description, c.subcategories, c.pattern_type, c.image
      ORDER BY c.name ASC
    `);

    const formatted = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      subcategories: typeof row.subcategories === 'string' ? JSON.parse(row.subcategories) : row.subcategories || [],
      patternType: row.patternType,
      image: row.image,
      productCount: Number(row.productCount || 0),
    }));

    res.json({
      success: true,
      categories: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve categories.' });
  }
});

export default router;
