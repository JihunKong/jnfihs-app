import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Use Gemini image generation model (Nano Banana)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        // @ts-expect-error - responseModalities is a valid option for image generation
        responseModalities: ['Text', 'Image'],
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';

        return NextResponse.json({
          imageUrl: `data:${mimeType};base64,${imageData}`,
        });
      }
    }

    // If no image generated, return a placeholder
    return NextResponse.json({
      imageUrl: null,
      message: 'Image generation not available, using text description',
      description: prompt,
    });
  } catch (error) {
    console.error('Image generation error:', error);

    // Return a graceful fallback
    return NextResponse.json({
      imageUrl: null,
      error: 'Failed to generate image',
      fallback: true,
    });
  }
}
