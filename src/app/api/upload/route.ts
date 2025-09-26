import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ message: 'No file uploaded' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const uploadPath = path.join(process.cwd(), 'public/uploads', file.name);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await fs.writeFile(uploadPath, buffer);

  return new Response(JSON.stringify({ message: 'File uploaded successfully', path: `/uploads/${file.name}` }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
