import bcrypt from 'bcrypt';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

async function seedAdmin() {
  try {
    const email = 'hammad@portfolio.dev';
    const plainPassword = '12345678'; // Jo password aap rakhna chahein
    
    // Hash the password securely with bcrypt
    const saltRogens = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRogens);

    // Check karein ke admin pehle se mojood toh nahi
    const existing = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    
    if (existing.rows.length > 0) {
      console.log('⚠️ Admin user already exists in the database!');
      process.exit(0);
    }

    // Insert new admin into database
    await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${plainPassword}`);
  } catch (err: any) {
    console.error('❌ Error seeding admin:', err.message);
  } finally {
    await pool.end();
  }
}

seedAdmin();