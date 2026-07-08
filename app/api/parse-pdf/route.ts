// app/api/parse-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

// This line tells Next.js NOT to try and pre-render this during build
export const dynamic = 'force-dynamic'; 

const pdf = require('pdf-parse');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF. Please ensure it is not encrypted.' }, { status: 500 });
  }
}