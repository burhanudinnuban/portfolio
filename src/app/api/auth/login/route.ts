
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'app', 'data', 'user.json');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Read user data from the JSON file
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const userData = JSON.parse(fileContents);

    // Find the user by username
    if (userData.username !== username) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: userData.username }, SECRET_KEY, {
      expiresIn: '1h',
    });

    // Return the token
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
