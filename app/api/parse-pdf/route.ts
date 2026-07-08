// app/api/parse-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

// We use require because pdf-parse does not have a default ESM export
// which causes issues with Next.js Turbopack builds.
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
    
    // pdf-parse returns a promise that resolves to the data object
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF. Please ensure it is not encrypted.' }, { status: 500 });
  }
}
