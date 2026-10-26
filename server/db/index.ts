import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

export type DbType = 'postgres' | 'sqlite';

let activeDbType: DbType = 'sqlite';
let pgPool: pg.Pool | null = null;
let sqliteDb: any = null;

/**
 * Initializes the database connection.
 * Prioritizes PostgreSQL if connection variables exist, otherwise falls back
 * transparently to the built-in Node SQLite engine.
 */
export async function initDb(): Promise<{ dbType: DbType }> {
  const connectionString = process.env.DATABASE_URL;
  const pgUser = process.env.PGUSER;

  if (connectionString || pgUser) {
    try {
      const pool = new pg.Pool(
        connectionString
          ? { connectionString }
          : {
              user: process.env.PGUSER,
              password: process.env.PGPASSWORD,
              host: process.env.PGHOST || 'localhost',
              port: parseInt(process.env.PGPORT || '5432', 10),
              database: process.env.PGDATABASE || 'classic_fashions',
            }
      );

      // Verify connection
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();

      pgPool = pool;
      activeDbType = 'postgres';
      console.log('✅ Connected to PostgreSQL database');
      return { dbType: 'postgres' };
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL connection failed:', err.message);
      console.warn('🔄 Falling back to local SQLite database for development...');
    }
  }

  // SQLite Fallback using Node 22+ built-in node:sqlite
  try {
    const dataDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.resolve(dataDir, 'classic_fashions.db');

    // Dynamically import node:sqlite
    const { DatabaseSync } = await import('node:sqlite');
    sqliteDb = new DatabaseSync(dbPath);
    sqliteDb.exec('PRAGMA foreign_keys = ON;');

    activeDbType = 'sqlite';
    console.log(`✅ Connected to local SQLite database at: ${dbPath}`);
    return { dbType: 'sqlite' };
  } catch (err: any) {
    console.error('❌ Failed to initialize database:', err);
    throw err;
  }
}

/**
 * Executes a parameterized query across PostgreSQL or SQLite.
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
  if (!pgPool && !sqliteDb) {
    await initDb();
  }

  if (activeDbType === 'postgres' && pgPool) {
    const res = await pgPool.query(sql, params);
    return {
      rows: res.rows as T[],
      rowCount: res.rowCount ?? res.rows.length,
    };
  }

  if (activeDbType === 'sqlite' && sqliteDb) {
    // Convert PostgreSQL style $1, $2, $3 to SQLite ?
    let sqliteSql = sql.replace(/\$(\d+)/g, '?');

    // Normalize RETURNING clause for SQLite if present
    const isInsertOrUpdate = /^\s*(INSERT|UPDATE|DELETE)/i.test(sqliteSql);

    // Prepare parameters (convert boolean to 1/0, objects to JSON strings)
    const normalizedParams = params.map((p) => {
      if (typeof p === 'boolean') return p ? 1 : 0;
      if (p !== null && typeof p === 'object') return JSON.stringify(p);
      return p;
    });

    try {
      if (isInsertOrUpdate) {
        // Check if query has RETURNING
        if (/RETURNING/i.test(sqliteSql)) {
          const stmt = sqliteDb.prepare(sqliteSql);
          const rows = stmt.all(...normalizedParams) as T[];
          return {
            rows,
            rowCount: rows.length,
          };
        } else {
          const stmt = sqliteDb.prepare(sqliteSql);
          const info = stmt.run(...normalizedParams);
          return {
            rows: [] as T[],
            rowCount: Number(info.changes || 0),
          };
        }
      } else {
        const stmt = sqliteDb.prepare(sqliteSql);
        const rows = stmt.all(...normalizedParams) as T[];
        return {
          rows,
          rowCount: rows.length,
        };
      }
    } catch (err: any) {
      console.error('SQLite query error:', err.message, '\nSQL:', sqliteSql);
      throw err;
    }
  }

  throw new Error('Database not initialized');
}

/**
 * Helper to execute multiple raw SQL statements (for schema setup)
 */
export async function execRaw(sql: string): Promise<void> {
  if (!pgPool && !sqliteDb) {
    await initDb();
  }

  if (activeDbType === 'postgres' && pgPool) {
    await pgPool.query(sql);
  } else if (activeDbType === 'sqlite' && sqliteDb) {
    // Remove Postgres-specific syntax for SQLite
    const cleanedSql = sql
      .replace(/TIMESTAMP WITH TIME ZONE/gi, 'DATETIME')
      .replace(/BOOLEAN DEFAULT TRUE/gi, 'INTEGER DEFAULT 1')
      .replace(/BOOLEAN DEFAULT FALSE/gi, 'INTEGER DEFAULT 0');

    sqliteDb.exec(cleanedSql);
  }
}

export function getActiveDbType(): DbType {
  return activeDbType;
}
