// Test script for Gemini API
// Usage: GEMINI_API_KEY=your_key node test-gemini.js
// Or: node test-gemini.js YOUR_API_KEY_HERE
const { GoogleGenAI } = require('@google/genai');

async function testGemini() {
  // Accept API key from command line argument or environment variable
  const apiKey = process.argv[2] || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: API key not provided');
    console.error('Usage: node test-gemini.js YOUR_API_KEY');
    console.error('   Or: GEMINI_API_KEY=xxx node test-gemini.js');
    return;
  }

  console.log('API Key length:', apiKey.length);
  console.log('API Key prefix:', apiKey.substring(0, 10) + '...');
  console.log('API Key has spaces:', apiKey.includes(' '));
  console.log('API Key has quotes:', apiKey.includes('"') || apiKey.includes("'"));

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `다음 한국어 문장을 3개 언어로 번역해주세요. 반드시 JSON 형식으로만 응답하세요.

문장: "안녕하세요"

응답 형식:
{"mn": "몽골어 번역", "ru": "러시아어 번역", "vi": "베트남어 번역"}`;

  try {
    console.log('Calling Gemini API with model: gemini-3-flash-preview');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    console.log('\n--- Full Response Object ---');
    console.log(JSON.stringify(response, null, 2));

    console.log('\n--- response.text ---');
    console.log(response.text);

    console.log('\n--- response.candidates ---');
    console.log(JSON.stringify(response.candidates, null, 2));

  } catch (error) {
    console.error('\n--- ERROR ---');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

testGemini();
