import { NextResponse } from "next/server";

// Groq decommissioned `llama3-8b-8192`, so every request had been failing and
// silently falling back to the client-side canned answers. Kept in one constant
// so the next model retirement is a one-line change.
const GROQ_MODEL = "llama-3.1-8b-instant";

// The endpoint is unauthenticated by design (the public site uses it), so the
// input has to be bounded here.
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 1500;

/**
 * The full projects array runs to ~5,600 tokens — readmes, changelogs, image
 * URLs — which alone exceeded the free tier's 6,000 tokens/minute and throttled
 * the assistant to roughly one question a minute. Only the fields needed to
 * answer questions are sent.
 */
function trimProjectsContext(projects: unknown) {
  if (!Array.isArray(projects)) return [];
  return projects.slice(0, 25).map((p: any) => ({
    name: p?.name,
    slug: p?.slug,
    tagline: p?.tagline,
    description: typeof p?.description === "string" ? p.description.slice(0, 400) : undefined,
    category: p?.category,
    status: p?.status,
    version: p?.version,
    completionPercent: p?.completionPercent,
    liveUrl: p?.liveUrl,
    githubUrl: p?.githubUrl,
    techStack: Array.isArray(p?.techStack) ? p.techStack.map((t: any) => t?.name).filter(Boolean) : [],
    features: Array.isArray(p?.features)
      ? p.features.slice(0, 6).map((f: any) => f?.title).filter(Boolean)
      : [],
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ fallback: true, error: "Invalid request body." }, { status: 400 });
    }

    const { messages, projectsContext } = body as { messages?: unknown; projectsContext?: unknown };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { fallback: true, error: "`messages` must be a non-empty array." },
        { status: 400 }
      );
    }

    const safeMessages = messages
      .slice(-MAX_MESSAGES)
      .filter((m: any) => m && typeof m.text === "string" && m.text.trim())
      .map((m: any) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: String(m.text).slice(0, MAX_MESSAGE_CHARS),
      }));

    if (safeMessages.length === 0) {
      return NextResponse.json({ fallback: true, error: "No readable message content." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.startsWith("gsk_KiwikOS")) {
      return NextResponse.json({ fallback: true, error: "Using client fallback (No Groq Key configured)" });
    }

    const catalogue = trimProjectsContext(projectsContext);

    const systemPrompt = `You are the Kiwik.1 AI Assistant for the Kiwik website.

This JSON array is the COMPLETE and ONLY list of Kiwik projects:
${JSON.stringify(catalogue, null, 2)}

Rules you must follow:
- Answer strictly from the data above. Never invent a project, version, metric, price or statistic.
- If asked about anything not in the list, say plainly that it is not a Kiwik project. Do not guess.
- Kiwik also has a separate partner showcase at /partners (for example Glentree Serenity, a real-estate partner). If asked about a partner or a product that is not in the list above, point the user to /partners rather than inventing details.
- Use concise markdown. Highlight project names, categories, versions and stack components.
- Keep the tone clean, professional and premium.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!groqResponse.ok) {
      // Logged in full server-side; the client gets no provider internals.
      console.error("Groq API error:", groqResponse.status, await groqResponse.text());
      return NextResponse.json({ fallback: true, error: "Assistant is temporarily unavailable." });
    }

    const data = await groqResponse.json();
    const replyText = data?.choices?.[0]?.message?.content;
    if (!replyText) {
      return NextResponse.json({ fallback: true, error: "Assistant returned an empty response." });
    }

    return NextResponse.json({ reply: replyText, fallback: false });
  } catch (error: any) {
    // Never echo the raw exception text back — it leaked internals to callers.
    console.error("Error in chat route handler:", error);
    return NextResponse.json({ fallback: true, error: "Assistant is temporarily unavailable." });
  }
}
