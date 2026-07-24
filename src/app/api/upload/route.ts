import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Inget fil hittades' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    
    // Generera unikt namn
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueName = `upload_${Date.now()}_${safeName}`;
    
    // Ladda upp till Supabase Storage (bucket: 'images')
    const { data, error } = await supabaseAdmin
      .storage
      .from('images')
      .upload(uniqueName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Hämta den offentliga URL:en
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('images')
      .getPublicUrl(uniqueName);

    // Returnera den fullständiga URL:en till bilden
    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Kunde inte ladda upp filen' }, { status: 500 });
  }
}
