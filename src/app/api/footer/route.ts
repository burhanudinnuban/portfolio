import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/app/data/footer.json');

export async function GET() {
  const fileContents = await fs.readFile(dataFilePath, 'utf8');
  return new Response(fileContents, { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: Request) {
  const newData = await request.json();
  await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
  return new Response(JSON.stringify({ message: 'Data saved successfully' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
