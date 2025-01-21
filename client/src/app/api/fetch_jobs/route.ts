import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || "1"
  const per_page = searchParams.get("per_page") || "10"

  const body = await req.json()

  try {
    const response = await fetch("http://localhost:5000/fetch_jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        page: Number.parseInt(page),
        per_page: Number.parseInt(per_page),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch jobs")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}