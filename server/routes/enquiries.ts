import { Router, Request, Response } from 'express';
import { query } from '../db/index.ts';
import { validateEnquiry, validateMaterialRequest } from '../middleware/validation.ts';
import { authenticateToken, requireRole } from '../middleware/auth.ts';

const router = Router();

function generateCode(prefix: string): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

/**
 * POST /api/enquiries/material-request
 * Handles custom material brief and specification submissions
 */
router.post('/material-request', validateMaterialRequest, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const enquiryId = `mr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const referenceCode = generateCode('CF-REQ');

    const materialSpecs = {
      category: data.category,
      materialName: data.materialName,
      quantity: data.quantity,
      unit: data.unit,
      urgency: data.urgency,
      targetDate: data.targetDate,
      width: data.width,
      gsmOrWeight: data.gsmOrWeight,
      composition: data.composition,
      weaveOrFinish: data.weaveOrFinish,
      colorOrShade: data.colorOrShade,
      similarToProductCode: data.similarToProductCode,
      similarToProductName: data.similarToProductName,
      specifications: data.specifications || {},
      hasPhysicalSample: data.hasPhysicalSample,
      sampleCourierNotes: data.sampleCourierNotes,
      purpose: data.purpose,
      targetTimeline: data.targetTimeline,
      testingRequirements: data.testingRequirements,
    };

    // Store reference image metadata (names, sizes, safe relative references)
    const referenceImages = data.referenceImages || (data.referenceImage ? [data.referenceImage] : []);

    await query(
      `INSERT INTO customer_enquiries (
        id, reference_code, enquiry_type, customer_name, company_name,
        phone, email, city_state, preferred_contact_method, urgency,
        target_date, message, material_specs, reference_images, status
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15
      )`,
      [
        enquiryId,
        referenceCode,
        'material_request',
        data.contactName,
        data.companyName || '',
        data.phone,
        data.email || '',
        data.cityState || '',
        data.preferredContactMethod || 'whatsapp',
        data.urgency || 'standard',
        data.targetDate || '',
        data.additionalNotes || '',
        JSON.stringify(materialSpecs),
        JSON.stringify(referenceImages),
        'received',
      ]
    );

    // Also record the primary item in enquiry_items
    const itemId = `mri_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await query(
      `INSERT INTO enquiry_items (
        id, enquiry_id, product_name, quantity, unit, custom_notes
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        itemId,
        enquiryId,
        data.materialName,
        data.quantity || 'Sample',
        data.unit || 'Meters',
        data.additionalNotes || '',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Material request saved successfully',
      referenceCode,
      enquiryId,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error saving material request:', err);
    res.status(500).json({ success: false, message: 'Failed to save material request. Please try again.' });
  }
});

/**
 * POST /api/enquiries
 * Handles general enquiries and dealer collection swatch inquiries
 */
router.post('/', validateEnquiry, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      phone,
      email,
      companyName,
      cityState,
      message,
      enquiryType = 'general',
      items = [],
    } = req.body;

    const enquiryId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const year = new Date().getFullYear();
    const referenceCode = `CF-ENQ-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    const type = items && items.length > 0 ? 'collection' : enquiryType;

    await query(
      `INSERT INTO customer_enquiries (
        id, reference_code, enquiry_type, customer_name, company_name,
        phone, email, city_state, message, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        enquiryId,
        referenceCode,
        type,
        name,
        companyName || '',
        phone,
        email || '',
        cityState || '',
        message || '',
        'received',
      ]
    );

    // Insert associated collection items
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await query(
          `INSERT INTO enquiry_items (
            id, enquiry_id, product_id, product_code, product_name,
            quantity, unit, selected_colour, selected_size, custom_notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            itemId,
            enquiryId,
            item.productId || item.product?.id || null,
            item.productCode || item.product?.productCode || null,
            item.productName || item.product?.name || 'Selected Swatch',
            String(item.quantity || 1),
            item.unit || 'swatch',
            item.selectedColour || null,
            item.selectedSize || null,
            item.customNote || null,
          ]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      referenceCode,
      enquiryId,
      submittedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error saving customer enquiry:', err);
    res.status(500).json({ success: false, message: 'Failed to record enquiry. Please try again.' });
  }
});

/**
 * GET /api/enquiries
 * Protected admin route to list all enquiries with filters & counts
 */
router.get('/', authenticateToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, status, search, page = '1', limit = '20' } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (type && type !== 'all') {
      conditions.push(`enquiry_type = $${paramIndex++}`);
      params.push(type);
    }

    if (status && status !== 'all') {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const term = `%${search.trim().toLowerCase()}%`;
      conditions.push(`(
        LOWER(reference_code) LIKE $${paramIndex} OR
        LOWER(customer_name) LIKE $${paramIndex} OR
        LOWER(company_name) LIKE $${paramIndex} OR
        phone LIKE $${paramIndex} OR
        LOWER(email) LIKE $${paramIndex}
      )`);
      params.push(term);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total count
    const countResult = await query(`SELECT COUNT(*) as total FROM customer_enquiries ${whereClause}`, params);
    const total = Number(countResult.rows[0]?.total || 0);

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    // Enquiries with item count
    const dataSql = `
      SELECT 
        e.*,
        COUNT(i.id) as "itemCount"
      FROM customer_enquiries e
      LEFT JOIN enquiry_items i ON i.enquiry_id = e.id
      ${whereClause}
      GROUP BY e.id
      ORDER BY e.created_at DESC
      LIMIT ${limitNum} OFFSET ${offset}
    `;

    const result = await query(dataSql, params);

    const formatted = result.rows.map((row) => ({
      id: row.id,
      referenceCode: row.reference_code,
      enquiryType: row.enquiry_type,
      customerName: row.customer_name,
      companyName: row.company_name,
      phone: row.phone,
      email: row.email,
      cityState: row.city_state,
      preferredContactMethod: row.preferred_contact_method,
      urgency: row.urgency,
      targetDate: row.target_date,
      message: row.message,
      materialSpecs: row.material_specs ? JSON.parse(row.material_specs) : null,
      referenceImages: row.reference_images ? JSON.parse(row.reference_images) : [],
      status: row.status,
      itemCount: Number(row.itemCount || 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      enquiries: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve enquiries.' });
  }
});

/**
 * GET /api/enquiries/:id
 * Protected admin route to get a single enquiry with all its items
 */
router.get('/:id', authenticateToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const enquiryResult = await query(
      'SELECT * FROM customer_enquiries WHERE id = $1 OR reference_code = $1 LIMIT 1',
      [id]
    );

    if (enquiryResult.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }

    const row = enquiryResult.rows[0];

    // Fetch items
    const itemsResult = await query(
      'SELECT * FROM enquiry_items WHERE enquiry_id = $1 ORDER BY created_at ASC',
      [row.id]
    );

    const items = itemsResult.rows.map((i) => ({
      id: i.id,
      productId: i.product_id,
      productCode: i.product_code,
      productName: i.product_name,
      quantity: i.quantity,
      unit: i.unit,
      selectedColour: i.selected_colour,
      selectedSize: i.selected_size,
      customNotes: i.custom_notes,
      createdAt: i.created_at,
    }));

    res.json({
      success: true,
      enquiry: {
        id: row.id,
        referenceCode: row.reference_code,
        enquiryType: row.enquiry_type,
        customerName: row.customer_name,
        companyName: row.company_name,
        phone: row.phone,
        email: row.email,
        cityState: row.city_state,
        preferredContactMethod: row.preferred_contact_method,
        urgency: row.urgency,
        targetDate: row.target_date,
        message: row.message,
        materialSpecs: row.material_specs ? JSON.parse(row.material_specs) : null,
        referenceImages: row.reference_images ? JSON.parse(row.reference_images) : [],
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        items,
      },
    });
  } catch (err: any) {
    console.error('Error fetching enquiry details:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve enquiry details.' });
  }
});

/**
 * PATCH /api/enquiries/:id/status
 * Protected admin route to update enquiry status
 */
router.patch('/:id/status', authenticateToken, requireRole(['admin']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['received', 'in_review', 'quoted', 'closed'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
      return;
    }

    const result = await query(
      'UPDATE customer_enquiries SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 OR reference_code = $2',
      [status, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Enquiry not found.' });
      return;
    }

    res.json({ success: true, message: `Enquiry status updated to ${status}` });
  } catch (err: any) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, message: 'Failed to update enquiry status.' });
  }
});

export default router;
