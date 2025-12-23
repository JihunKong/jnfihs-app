import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface CachedImage {
  image_data: string;
  mime_type: string;
}

// Check if image exists in cache
async function getCachedImage(wordId: string): Promise<CachedImage | null> {
  try {
    const rows = await query<CachedImage>(
      `SELECT image_data, mime_type FROM word_images WHERE word_id = $1`,
      [wordId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (e) {
    console.log('DB not available for image cache');
    return null;
  }
}

// Save image to cache
async function saveImageToCache(wordId: string, imageData: string, mimeType: string, prompt: string): Promise<void> {
  try {
    await query(
      `INSERT INTO word_images (word_id, image_data, mime_type, prompt)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (word_id) DO UPDATE SET image_data = $2, mime_type = $3, prompt = $4`,
      [wordId, imageData, mimeType, prompt]
    );
  } catch (e) {
    console.log('Failed to save image to cache:', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { wordId, prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check cache first if wordId is provided
    if (wordId) {
      const cached = await getCachedImage(wordId);
      if (cached) {
        console.log(`Image cache hit for: ${wordId}`);
        return NextResponse.json({
          imageUrl: `data:${cached.mime_type};base64,${cached.image_data}`,
          cached: true,
        });
      }
    }

    // Generate new image using Gemini 2.5 Flash (Nano Banana)
    // Add instruction to avoid text in images
    const imagePrompt = `${prompt}. IMPORTANT: Do not include any text, letters, numbers, or written language in the image. Only visual elements.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: imagePrompt,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Extract image from response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';

          // Save to cache if wordId provided
          if (wordId && imageData) {
            await saveImageToCache(wordId, imageData, mimeType, prompt);
            console.log(`Image cached for: ${wordId}`);
          }

          return NextResponse.json({
            imageUrl: `data:${mimeType};base64,${imageData}`,
            cached: false,
          });
        }
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
