
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/data/testimonials.json');

export async function GET() {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  const data = JSON.parse(fileContents);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const newData = await req.json();
  fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
  return NextResponse.json({ message: 'Testimonials section updated successfully!' });
}
