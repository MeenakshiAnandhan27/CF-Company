import { Request, Response, NextFunction } from 'express';

export function sanitizeString(val: any): string {
  if (typeof val !== 'string') return '';
  return val.trim();
}

/**
 * Validates customer enquiry submissions
 */
export function validateEnquiry(req: Request, res: Response, next: NextFunction): void {
  const { name, phone, email } = req.body;

  const sanitizedName = sanitizeString(name);
  const sanitizedPhone = sanitizeString(phone);
  const sanitizedEmail = sanitizeString(email);

  if (!sanitizedName || sanitizedName.length < 2) {
    res.status(400).json({ success: false, message: 'Full name is required (minimum 2 characters).' });
    return;
  }

  if (!sanitizedPhone || sanitizedPhone.length < 5) {
    res.status(400).json({ success: false, message: 'A valid contact phone number is required.' });
    return;
  }

  if (sanitizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    return;
  }

  // Update body with sanitized values
  req.body.name = sanitizedName;
  req.body.phone = sanitizedPhone;
  req.body.email = sanitizedEmail;
  req.body.message = sanitizeString(req.body.message);
  req.body.companyName = sanitizeString(req.body.companyName);

  next();
}

/**
 * Validates material request submissions
 */
export function validateMaterialRequest(req: Request, res: Response, next: NextFunction): void {
  const { contactName, phone, email, category, materialName } = req.body;

  const sanitizedName = sanitizeString(contactName);
  const sanitizedPhone = sanitizeString(phone);
  const sanitizedEmail = sanitizeString(email);
  const sanitizedCategory = sanitizeString(category);
  const sanitizedMaterialName = sanitizeString(materialName);

  if (!sanitizedName || sanitizedName.length < 2) {
    res.status(400).json({ success: false, message: 'Contact name is required (minimum 2 characters).' });
    return;
  }

  if (!sanitizedPhone || sanitizedPhone.length < 5) {
    res.status(400).json({ success: false, message: 'A valid phone number is required.' });
    return;
  }

  if (!sanitizedCategory) {
    res.status(400).json({ success: false, message: 'Material category is required.' });
    return;
  }

  if (sanitizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    return;
  }

  req.body.contactName = sanitizedName;
  req.body.phone = sanitizedPhone;
  req.body.email = sanitizedEmail;
  req.body.category = sanitizedCategory;
  req.body.materialName = sanitizedMaterialName || `${sanitizedCategory} requirement`;
  req.body.companyName = sanitizeString(req.body.companyName);
  req.body.cityState = sanitizeString(req.body.cityState);
  req.body.quantity = sanitizeString(req.body.quantity);
  req.body.unit = sanitizeString(req.body.unit);

  next();
}
