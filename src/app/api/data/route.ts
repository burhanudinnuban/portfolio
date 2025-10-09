
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = (fileName: string) => path.join(process.cwd(), 'src', 'app', 'data', fileName);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'File not specified' }, { status: 400 });
  }

  try {
    const filePath = dataFilePath(file);
    const data = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
    return NextResponse.json({ error: `Could not read ${file}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get('file');
  
  if (!file) {
    return NextResponse.json({ error: 'File not specified' }, { status: 400 });
  }

  try {
    const filePath = dataFilePath(file);
    const body = await req.json();
    await fs.writeFile(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ message: `${file} updated successfully` });
  } catch (error) {
    console.error(`Error writing to ${file}:`, error);
    return NextResponse.json({ error: `Could not write to ${file}` }, { status: 500 });
  }
}
