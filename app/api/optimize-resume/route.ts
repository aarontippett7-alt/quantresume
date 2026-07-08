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

    const prompt = `You are the QuantResume AI, a surgical ATS (Applicant Tracking System) expert. Your job is to engineer a resume to pass complex hiring algorithms by analyzing data points in the job description and mapping them to the candidate's experience.

RESUME DATA:
${resume}

TARGET JOB PARAMETERS:
${jobDescription}

Please provide:
1. A data-optimized version of the resume that surgically incorporates high-value keywords.
2. A list of specific keywords from the job description that were prioritized.
3. Formatting recommendations for maximum machine readability.

Format your response as JSON:
{
  "optimized_resume": "the full optimized resume text",
  "keywords_added": ["keyword1", "keyword2", ...],
  "formatting_tips": ["tip1", "tip2", ...],
  "match_score": 92
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
      max_tokens: 2500,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 });
  }
}
