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

    const prompt = `You are the QuantResume AI, a surgical ATS expert and executive career consultant. 

TASK:
1. Engineer a data-optimized version of the resume that incorporates high-value keywords for the target job.
2. Write a high-conversion, professional cover letter that maps the candidate's specific achievements to the job's pain points.
3. Generate an "Interview Prep Kit" containing the 5 most likely interview questions for this specific role and candidate, along with suggested "Quant" talking points for each.

RESUME DATA:
${resume}

TARGET JOB PARAMETERS:
${jobDescription}

Format your response as a valid JSON object:
{
  "optimized_resume": "the full optimized resume text",
  "cover_letter": "a professional, surgical cover letter",
  "interview_prep": [
    { "question": "...", "talking_points": "..." },
    ...
  ],
  "keywords_added": ["keyword1", "keyword2", ...],
  "formatting_tips": ["tip1", "tip2", ...],
  "match_score": 92
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 });
  }
}
