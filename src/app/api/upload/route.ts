import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Inget fil hittades' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Spara i public/img - mappen där övriga bilder ligger
    const uploadDir = path.join(process.cwd(), 'public', 'img');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generera unikt namn
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `upload_${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    fs.writeFileSync(filePath, buffer);
    
    // Returnera relativ path som används på hemsidan
    return NextResponse.json({ url: `img/${uniqueName}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Kunde inte ladda upp filen' }, { status: 500 });
  }
}
