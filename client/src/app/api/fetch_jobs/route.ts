import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  // Parse the JSON body from the request
  const body = await req.json();

  try {
    // Make the POST request to the Flask backend
    const response = await fetch(`https://linkedin-job-scrapper.onrender.com/fetch_jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to fetch jobs");
    }

    const data = await response.json();

    // Return the response as JSON
    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error.message },
      { status: 500 }
    );
  }
}
