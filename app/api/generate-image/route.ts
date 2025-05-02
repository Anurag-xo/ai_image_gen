import { NextResponse } from "next/server";
import OpenAI from "openai";
export const dynamic = "force-dynamic";

// Initialize OpenAI client
const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { prompt } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { message: "Please provide a valid prompt" },
        { status: 400 },
      );
    }

    const response = await client.images.generate({
      model: "black-forest-labs/flux-dev",
      response_format: "url",
      extra_body: {
        response_extension: "webp",
        width: 1024,
        height: 1024,
        num_inference_steps: 28,
        negative_prompt: "",
        seed: -1,
      },
      prompt: prompt,
    });

    console.log("Image Generated", response);

    // Return the image URL
    return NextResponse.json({
      imageUrl: response.data[0].url,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);

    return NextResponse.json(
      { message: error.message || "Failed to generate image" },
      { status: 500 },
    );
  }
}
