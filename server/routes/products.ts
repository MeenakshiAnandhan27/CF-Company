import { Router, Request, Response } from 'express';
import { query } from '../db/index.ts';
import { authenticateToken, requireRole } from '../middleware/auth.ts';

const router = Router();

function formatProductRow(row: any) {
  return {
    id: row.id,
    productCode: row.product_code,
    name: row.name,
    category: row.category_id,
    categoryLabel: row.category_label || '',
    subcategory: row.subcategory || '',
    fabricWeaveType: row.fabric_weave_type || undefined,
    quality: row.quality || undefined,
    yarnConstruction: row.yarn_construction || undefined,
    width: row.width || undefined,
    gsm: row.gsm || undefined,
    weave: row.weave || undefined,
    selvage: row.selvage || undefined,
    standard: row.standard || undefined,
    loom: row.loom || undefined,
    description: row.description || '',
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
    imageAlt: row.image_alt || '',
    colours: typeof row.colours === 'string' ? JSON.parse(row.colours) : row.colours || [],
    sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes || [],
    fabric: row.fabric || '',
    price: row.price || '',
    availability: row.availability || 'Available on Order',
    active: Boolean(row.active),
    patternType: row.pattern_type || '',
    specifications: row.specifications || '',
    applications: typeof row.applications === 'string' ? JSON.parse(row.applications) : row.applications || [],
    customizationNote: row.customization_note || undefined,
    enquiryEnabled: Boolean(row.enquiry_enabled),
    isService: Boolean(row.is_service),
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * GET /api/products
 * Retrieve products with search, filtering, and sorting
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      subcategory,
      search,
      colour,
      size,
      availability,
      featured,
      sortBy = 'featured',
      limit,
      page = '1',
      includeInactive = 'false',
    } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filter active products by default
    if (includeInactive !== 'true') {
      conditions.push(`active = 1`);
    }

    // Category filter
    if (category && category !== 'all') {
      conditions.push(`category_id = $${paramIndex++}`);
      params.push(category);
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'all') {
      conditions.push(`subcategory = $${paramIndex++}`);
      params.push(subcategory);
    }

    // Availability filter
    if (availability && availability !== 'all') {
      conditions.push(`availability = $${paramIndex++}`);
      params.push(availability);
    }

    // Featured filter
    if (featured === 'true') {
      conditions.push(`featured = 1`);
    }

    // Search query (name, code, fabric, description, specifications)
    if (search && typeof search === 'string' && search.trim().length > 0) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(name) LIKE $${paramIndex} OR
        LOWER(product_code) LIKE $${paramIndex} OR
        LOWER(fabric) LIKE $${paramIndex} OR
        LOWER(description) LIKE $${paramIndex} OR
        LOWER(specifications) LIKE $${paramIndex} OR
        LOWER(colours) LIKE $${paramIndex}
      )`);
      params.push(searchTerm);
      paramIndex++;
    }

    // Colour filter
    if (colour && colour !== 'all' && typeof colour === 'string') {
      conditions.push(`LOWER(colours) LIKE $${paramIndex++}`);
      params.push(`%${colour.toLowerCase()}%`);
    }

    // Size filter
    if (size && size !== 'all' && typeof size === 'string') {
      conditions.push(`LOWER(sizes) LIKE $${paramIndex++}`);
      params.push(`%${size.toLowerCase()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'featured DESC, created_at DESC';
    if (sortBy === 'name-asc') {
      orderBy = 'name ASC';
    } else if (sortBy === 'name-desc') {
      orderBy = 'name DESC';
    } else if (sortBy === 'code') {
      orderBy = 'product_code ASC';
    }

    // Pagination
    let paginationClause = '';
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    if (limit && parseInt(limit as string, 10) > 0) {
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;
      paginationClause = ` LIMIT ${limitNum} OFFSET ${offset}`;
    }

    // Count query for total
    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const countResult = await query(countSql, params);
    const total = Number(countResult.rows[0]?.total || 0);

    // Data query
    const dataSql = `SELECT * FROM products ${whereClause} ORDER BY ${orderBy}${paginationClause}`;
    const result = await query(dataSql, params);

    const formattedProducts = result.rows.map(formatProductRow);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limit ? parseInt(limit as string, 10) : total,
      products: formattedProducts,
    });
  } catch (err: any) {
    console.error('Error querying products:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve products.' });
  }
});

/**
 * GET /api/products/:id
 * Retrieve a single product by ID or productCode
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM products WHERE id = $1 OR LOWER(product_code) = LOWER($1) LIMIT 1',
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.json({
      success: true,
      product: formatProductRow(result.rows[0]),
    });
  } catch (err: any) {
    console.error('Error fetching product:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve product details.' });
  }
});

/**
 * POST /api/products
 * Protected admin route to create a product
 */
router.post('/', authenticateToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const p = req.body;
    if (!p.name || !p.productCode || !p.category) {
      res.status(400).json({ success: false, message: 'Name, productCode, and category are required.' });
      return;
    }

    const id = p.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await query(
      `INSERT INTO products (
        id, product_code, name, category_id, category_label, subcategory,
        fabric_weave_type, quality, yarn_construction, width, gsm, weave, selvage, standard, loom,
        description, short_description, full_description, images, image_alt, colours, sizes,
        fabric, price, availability, active, pattern_type, specifications, applications,
        customization_note, enquiry_enabled, is_service, featured
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28, $29,
        $30, $31, $32, $33
      )`,
      [
        id,
        p.productCode,
        p.name,
        p.category,
        p.categoryLabel || '',
        p.subcategory || '',
        p.fabricWeaveType || '',
        p.quality || '',
        p.yarnConstruction || '',
        p.width || '',
        p.gsm || '',
        p.weave || '',
        p.selvage || '',
        p.standard || '',
        p.loom || '',
        p.description || '',
        p.shortDescription || '',
        p.fullDescription || '',
        JSON.stringify(p.images || []),
        p.imageAlt || '',
        JSON.stringify(p.colours || []),
        JSON.stringify(p.sizes || []),
        p.fabric || '',
        p.price || '',
        p.availability || 'Available on Order',
        p.active !== false ? true : false,
        p.patternType || '',
        p.specifications || '',
        JSON.stringify(p.applications || []),
        p.customizationNote || '',
        p.enquiryEnabled !== false ? true : false,
        p.isService === true ? true : false,
        p.featured === true ? true : false,
      ]
    );

    const created = await query('SELECT * FROM products WHERE id = $1', [id]);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: formatProductRow(created.rows[0]),
    });
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

/**
 * PUT /api/products/:id
 * Protected admin route to update product
 */
router.put('/:id', authenticateToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const p = req.body;

    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    await query(
      `UPDATE products SET
        name = COALESCE($1, name),
        category_label = COALESCE($2, category_label),
        subcategory = COALESCE($3, subcategory),
        price = COALESCE($4, price),
        availability = COALESCE($5, availability),
        description = COALESCE($6, description),
        full_description = COALESCE($7, full_description),
        colours = COALESCE($8, colours),
        sizes = COALESCE($9, sizes),
        images = COALESCE($10, images),
        active = COALESCE($11, active),
        featured = COALESCE($12, featured),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $13`,
      [
        p.name ?? null,
        p.categoryLabel ?? null,
        p.subcategory ?? null,
        p.price ?? null,
        p.availability ?? null,
        p.description ?? null,
        p.fullDescription ?? null,
        p.colours ? JSON.stringify(p.colours) : null,
        p.sizes ? JSON.stringify(p.sizes) : null,
        p.images ? JSON.stringify(p.images) : null,
        p.active !== undefined ? (p.active ? 1 : 0) : null,
        p.featured !== undefined ? (p.featured ? 1 : 0) : null,
        id,
      ]
    );

    const updated = await query('SELECT * FROM products WHERE id = $1', [id]);
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: formatProductRow(updated.rows[0]),
    });
  } catch (err: any) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

/**
 * DELETE /api/products/:id
 * Protected admin route to soft-delete / deactivate product
 */
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    await query('UPDATE products SET active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    res.json({ success: true, message: 'Product deactivated successfully.' });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Failed to deactivate product.' });
  }
});

export default router;
