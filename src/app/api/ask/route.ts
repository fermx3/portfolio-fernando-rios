import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  MODEL,
  MAX_TOKENS,
  MAX_HISTORY,
  MAX_MESSAGE_LENGTH,
  buildSystemPrompt,
} from "@/lib/assistant/prompt";
import { CAPTURE_LEAD_TOOL, captureLead, isLeadCaptureAvailable } from "@/lib/assistant/lead";
import { allow, clientIp } from "@/lib/assistant/rate-limit";

// buildCorpus reads from the filesystem.
export const runtime = "nodejs";

/**
 * The whole request body is untrusted, including the conversation history: a
 * caller can fabricate assistant turns claiming any authority they like. So the
 * roles are a closed set here, and nothing the server does downstream is
 * allowed to depend on what the conversation says. The system prompt and the
 * tool definitions come from this file, never from the body.
 */
const messageSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("user"),
    content: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
  }),
  z.object({
    role: z.literal("assistant"),
    content: z.string().trim().min(1).max(8000),
  }),
]);

const bodySchema = z.object({
  locale: z.enum(["en", "es"]),
  messages: z.array(messageSchema).min(1).max(MAX_HISTORY),
});

/** Tool calls could otherwise ping-pong forever on a bad day. */
const MAX_TURNS = 4;

function error(code: string, status: number) {
  return Response.json({ error: code }, { status });
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return error("invalid_request", 400);

  const { locale, messages: incoming } = parsed.data;
  if (incoming[incoming.length - 1].role !== "user") return error("invalid_request", 400);

  if (!process.env.ANTHROPIC_API_KEY) return error("unavailable", 503);

  const ip = clientIp(request.headers);
  if (!(await allow("ask", ip))) return error("rate_limited", 429);

  // Instantiated per request, not at module scope: the constructor throws
  // without a key, and CI builds this file with no secrets present.
  const client = new Anthropic();

  const canCaptureLead = isLeadCaptureAvailable();
  const system = buildSystemPrompt(locale, canCaptureLead);
  const messages: Anthropic.MessageParam[] = incoming.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (text: string) => controller.enqueue(encoder.encode(text));
      let wroteSomething = false;

      try {
        for (let turn = 0; turn < MAX_TURNS; turn++) {
          const response = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            output_config: { effort: "low" },
            system: [
              {
                type: "text",
                text: system,
                // The corpus is ~16k tokens and identical on every request for
                // a locale, so it is cached and re-read at a tenth of the
                // price. The question sits after this breakpoint.
                cache_control: { type: "ephemeral" },
              },
            ],
            tools: canCaptureLead ? [CAPTURE_LEAD_TOOL] : [],
            messages,
          });

          response.on("text", (delta) => {
            wroteSomething = true;
            write(delta);
          });

          const message = await response.finalMessage();

          // Token counts only — no conversation content. The cached read is
          // what makes a turn cost about a cent instead of ten, so a zero here
          // means something volatile crept into the system prompt and the
          // corpus is being re-billed at full price on every request.
          const { cache_read_input_tokens: cached, input_tokens: fresh } = message.usage;
          console.log(
            `[assistant] cache_read=${cached ?? 0} cache_write=${
              message.usage.cache_creation_input_tokens ?? 0
            } input=${fresh} output=${message.usage.output_tokens}`
          );

          // Safety classifiers can decline; content is empty or partial then,
          // so this has to be checked before anything reads it.
          if (message.stop_reason === "refusal") {
            if (!wroteSomething) write(REFUSAL[locale]);
            break;
          }

          const toolUses = message.content.filter((block) => block.type === "tool_use");
          if (toolUses.length === 0) break;

          messages.push({ role: "assistant", content: message.content });

          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const call of toolUses) {
            results.push({
              type: "tool_result",
              tool_use_id: call.id,
              content: await runTool(call.name, call.input, ip),
            });
          }
          messages.push({ role: "user", content: results });
        }
      } catch (cause) {
        // Never the request or response bodies: they carry whatever the
        // visitor typed, and this lands in the platform logs.
        console.error(
          `[assistant] request failed: ${cause instanceof Error ? cause.name : "unknown"}`
        );
        // The status line is long gone by now, so there is no error code left
        // to send. Closing with nothing written is the signal: the client
        // treats an empty answer as a failure and offers the email instead.
        // Erroring the controller here would throw on the close() below.
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

const REFUSAL = {
  en: "I can't help with that one. Ask me about Fernando's projects instead.",
  es: "No puedo ayudarte con eso. Pregúntame por los proyectos de Fernando.",
} as const;

async function runTool(name: string, input: unknown, ip: string): Promise<string> {
  if (name !== "capture_lead") return "Unknown tool.";

  if (!(await allow("lead", ip))) {
    return "Too many contact requests from this visitor today. Offer the email address on the page instead.";
  }

  const result = await captureLead(input);
  return result.message;
}
