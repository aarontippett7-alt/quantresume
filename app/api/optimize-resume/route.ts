// app/api/optimize-resume/route.ts
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an ATS (Applicant Tracking System) expert. Your job is to optimize a resume to pass ATS systems while maintaining truthfulness.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Please provide:
1. An ATS-optimized version of the resume that incorporates keywords from the job description
2. A list of keywords from the job description that were added/emphasized
3. Specific formatting recommendations for ATS compatibility

Format your response as JSON with the following structure:
{
  "optimized_resume": "the full optimized resume text",
  "keywords_added": ["keyword1", "keyword2", ...],
  "formatting_tips": ["tip1", "tip2", ...],
  "match_score": 85
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileType = file.type;
    let text = '';

    if (fileType === 'text/plain') {
      // Handle .txt files
      text = await file.text();
    } else if (fileType === 'application/pdf') {
      // Handle PDF files
      const buffer = await file.arrayBuffer();
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      } catch (pdfError) {
        return NextResponse.json(
          { error: 'Could not extract text from PDF. Please paste text instead.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Please upload a .txt or .pdf file' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
