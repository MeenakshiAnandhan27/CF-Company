import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/index.ts';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticates admin user and returns JWT token
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const userResult = await query(
      'SELECT id, email, password_hash, full_name, role, active FROM admin_users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (userResult.rowCount === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const user = userResult.rows[0];

    if (!user.active) {
      res.status(403).json({ success: false, message: 'This account has been deactivated.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Update last login timestamp
    await query('UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated admin profile
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const userResult = await query(
      'SELECT id, email, full_name, role, created_at, last_login_at FROM admin_users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rowCount === 0) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const user = userResult.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
      },
    });
  } catch (err: any) {
    console.error('Auth verification error:', err);
    res.status(500).json({ success: false, message: 'Error verifying authentication.' });
  }
});

export default router;
