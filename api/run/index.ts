import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { spawn } from "child_process";

// Rate limiting: simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;

// Dangerous command patterns to block
const DANGEROUS_PATTERNS = [
  /Remove-Item.*-Recurse/i,
  /rm\s+-rf/i,
  /Format-/i,
  /Clear-/i,
  /Stop-Computer/i,
  /Restart-Computer/i,
  /Invoke-Expression/i,
  /iex\s/i,
  /Invoke-Command/i,
  /Enter-PSSession/i,
  /New-PSSession/i,
  /Set-ExecutionPolicy/i,
  /\$env:/i,
  /\[Environment\]::/i,
];

interface ExecuteRequest {
  script: string;
  input?: string;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function validateScript(script: string): { valid: boolean; error?: string } {
  // Check script length
  const maxLength = parseInt(process.env.MAX_SCRIPT_LENGTH || "10000");
  if (script.length > maxLength) {
    return { valid: false, error: `Script too long (max ${maxLength} characters)` };
  }

  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(script)) {
      return { 
        valid: false, 
        error: `Script contains blocked command pattern: ${pattern.source}` 
      };
    }
  }

  return { valid: true };
}

async function executePowerShell(script: string, timeoutMs: number): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    // Spawn PowerShell process
    const ps = spawn("pwsh", ["-NoProfile", "-NonInteractive", "-Command", script], {
      timeout: timeoutMs,
      env: {
        ...process.env,
        PSModulePath: "", // Limit module access
      },
    });

    // Set up timeout
    const timeout = setTimeout(() => {
      timedOut = true;
      ps.kill();
      stderr += "\nExecution timed out\n";
    }, timeoutMs);

    ps.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ps.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ps.on("close", (code) => {
      clearTimeout(timeout);
      const durationMs = Date.now() - startTime;

      resolve({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: timedOut ? 124 : (code || 0),
        durationMs,
      });
    });

    ps.on("error", (error) => {
      clearTimeout(timeout);
      const durationMs = Date.now() - startTime;

      resolve({
        stdout: "",
        stderr: `Failed to execute PowerShell: ${error.message}`,
        exitCode: 1,
        durationMs,
      });
    });
  });
}

export async function run(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`PowerShell run request received`);

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  // Get client IP for rate limiting
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return {
      status: 429,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
        "Content-Type": "application/json",
      },
      jsonBody: {
        error: "Rate limit exceeded. Please wait before trying again.",
      },
    };
  }

  try {
    // Parse request body
    const body = (await request.json()) as ExecuteRequest;
    const script = body.script;

    if (!script || typeof script !== "string") {
      return {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
          "Content-Type": "application/json",
        },
        jsonBody: {
          error: "Invalid request: 'script' field is required",
        },
      };
    }

    // Validate script
    const validation = validateScript(script);
    if (!validation.valid) {
      return {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
          "Content-Type": "application/json",
        },
        jsonBody: {
          error: validation.error,
        },
      };
    }

    // Execute PowerShell
    const timeoutMs = parseInt(process.env.EXECUTION_TIMEOUT_MS || "10000");
    const result = await executePowerShell(script, timeoutMs);

    context.log(`Execution completed in ${result.durationMs}ms with exit code ${result.exitCode}`);

    return {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
        "Content-Type": "application/json",
      },
      jsonBody: result,
    };
  } catch (error) {
    context.error("Error processing request:", error);

    return {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
        "Content-Type": "application/json",
      },
      jsonBody: {
        error: "Internal server error",
        stdout: "",
        stderr: error instanceof Error ? error.message : "Unknown error",
        exitCode: 1,
        durationMs: 0,
      },
    };
  }
}

app.http("run", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "run",
  handler: run,
});
