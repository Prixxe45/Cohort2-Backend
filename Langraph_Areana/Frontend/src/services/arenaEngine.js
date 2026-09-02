import { PRESET_BENCHMARKS } from '../data/presets';

/**
 * Intelligent Arena Engine:
 * Generates distinct model outputs and detailed AI Supreme Judge scores,
 * explanations, and recommendations tailored to the problem.
 */
export async function simulateArenaDuel({ problem, model1, model2, judgePersona }) {
  // Check if this matches a preset benchmark
  const matchedPreset = PRESET_BENCHMARKS.find(
    (p) =>
      p.problem.toLowerCase().trim() === problem.toLowerCase().trim() ||
      problem.toLowerCase().includes('sex') ||
      p.title.toLowerCase().includes(problem.toLowerCase().slice(0, 15))
  );

  if (matchedPreset && problem.toLowerCase().includes('sex')) {
    return {
      problem: problem,
      solution_1: matchedPreset.solution_1,
      solution_2: matchedPreset.solution_2,
      model_1: model1 || { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', avatar: '🟠' },
      model_2: model2 || { id: 'safety-guard-model', name: 'Standard Guard Model', avatar: '🛡️' },
      judge: {
        solution_1_score: matchedPreset.judge.solution_1_score,
        solution_2_score: matchedPreset.judge.solution_2_score,
        solution_1_reasoning: matchedPreset.judge.solution_1_reasoning,
        solution_2_reasoning: matchedPreset.judge.solution_2_reasoning,
        recommendation: matchedPreset.judge.recommendation,
        explanation: matchedPreset.judge.explanation,
        winner: 'solution_1',
        metrics: {
          solution_1: { accuracy: 95, depth: 92, structure: 96, safety: 98, helpfulness: 96, latency: '1.2s' },
          solution_2: { accuracy: 30, depth: 20, structure: 65, safety: 99, helpfulness: 25, latency: '0.4s' }
        }
      }
    };
  }

  if (matchedPreset) {
    return {
      problem: problem,
      solution_1: matchedPreset.solution_1,
      solution_2: matchedPreset.solution_2,
      model_1: model1 || { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', avatar: '🟠' },
      model_2: model2 || { id: 'gpt-4o', name: 'GPT-4o (Omni)', avatar: '🟢' },
      judge: {
        solution_1_score: matchedPreset.judge.solution_1_score,
        solution_2_score: matchedPreset.judge.solution_2_score,
        solution_1_reasoning: matchedPreset.judge.solution_1_reasoning,
        solution_2_reasoning: matchedPreset.judge.solution_2_reasoning,
        recommendation: matchedPreset.judge.recommendation,
        explanation: matchedPreset.judge.explanation,
        winner: matchedPreset.judge.solution_1_score >= matchedPreset.judge.solution_2_score ? 'solution_1' : 'solution_2',
        metrics: {
          solution_1: { accuracy: 94, depth: 95, structure: 92, safety: 95, helpfulness: 94, latency: '1.4s' },
          solution_2: { accuracy: 78, depth: 70, structure: 82, safety: 96, helpfulness: 72, latency: '0.9s' }
        }
      }
    };
  }

  // Dynamic Synthesis for custom user prompts
  return generateCustomDuel({ problem, model1, model2, judgePersona });
}

function generateCustomDuel({ problem, model1, model2, judgePersona }) {
  const isCoding = /code|function|react|python|algorithm|javascript|typescript|sql|class|bug|component/i.test(problem);
  const isMath = /math|calculate|probability|proof|solve|equation|integral|theorem/i.test(problem);
  const isAdvice = /how to|advice|tips|guide|explain|best way|why/i.test(problem);

  let s1 = '';
  let s2 = '';
  let s1_score = 9.2;
  let s2_score = 7.4;
  let s1_reasoning = '';
  let s2_reasoning = '';
  let recommendation = '';
  let explanation = '';

  if (isCoding) {
    s1 = `### Solution by ${model1.name} (Production Architecture)

Here is a robust, clean, and performant implementation addressing the core requirements:

\`\`\`typescript
/**
 * Optimized solution for: ${problem.slice(0, 60)}...
 */
interface SolutionConfig {
  retries?: number;
  timeoutMs?: number;
  debug?: boolean;
}

export async function executeTask<T>(
  input: T,
  config: SolutionConfig = {}
): Promise<{ success: boolean; data: T; latencyMs: number }> {
  const start = performance.now();
  const { retries = 3, timeoutMs = 5000 } = config;

  try {
    // 1. Input sanitization & boundary validation
    if (!input) {
      throw new Error("Invalid payload: input cannot be null or undefined");
    }

    // 2. High-performance operation pipeline
    let result = input;
    // Core algorithmic processing with zero memory leakage

    const latencyMs = Math.round(performance.now() - start);
    return { success: true, data: result, latencyMs };
  } catch (error) {
    if (retries > 0) {
      return executeTask(input, { ...config, retries: retries - 1 });
    }
    throw error;
  }
}
\`\`\`

#### Key Architectural Highlights:
1. **Type Safety & Generics**: Strong generic typing with explicit configuration interfaces.
2. **Error Resilience & Retry Policies**: Built-in exponential backoff fallback and graceful error logging.
3. **Memory & Performance**: $O(N)$ space and time complexity with minimal GC pressure.`;

    s2 = `### Solution by ${model2.name}

Here is a quick script to handle your request:

\`\`\`javascript
function doTask(input) {
  if (!input) return null;
  
  // simple task logic
  let data = input;
  console.log("Processing:", data);
  
  return {
    status: "ok",
    result: data
  };
}

// Example usage:
const res = doTask({ item: "demo" });
console.log(res);
\`\`\`

This is easy to drop into your code and run without extra configuration.`;

    s1_score = 9.4;
    s2_score = 6.8;
    s1_reasoning = `Solution 1 (${model1.name}) provides a complete, production-ready TypeScript solution with explicit error boundaries, retry mechanics, latency tracking, and defensive input validation. It adheres to modern enterprise best practices.`;
    s2_reasoning = `Solution 2 (${model2.name}) offers a barebones JavaScript snippet. While it works for trivial scripts, it lacks type safety, error boundaries, asynchronous safety, and edge-case handling.`;
    recommendation = `Adopt Solution 1 for any real-world production codebase due to superior type safety and resilience. Solution 2 is only suitable for basic scratch testing.`;
    explanation = `The AI Judge favored Solution 1 (+2.6 margin) due to comprehensive error handling, modular configuration interfaces, and zero assumptions on runtime environment.`;
  } else {
    s1 = `### Comprehensive Analysis & Strategy

To solve **"${problem}"**, a structured multi-dimensional approach is recommended:

#### 1. Core Diagnostics & First Principles
- **Root Cause Identification:** Break the problem into its foundational components rather than treating superficial symptoms.
- **Key Constraints:** Assess resource allocation, temporal factors, and risk boundaries.

#### 2. Step-by-Step Action Plan
1. **Immediate Stabilization:** Execute high-impact, low-risk preliminary checks to verify baseline assumptions.
2. **Systematic Implementation:** Deploy the core strategy with continuous metric monitoring.
3. **Validation & Edge Testing:** Stress-test against unexpected anomalies and corner cases.

#### 3. Proactive Guardrails & Long-term Optimization
- Establish automated feedback loops.
- Document assumptions to prevent regressions and maintain clarity across collaborators.

> **Key Takeaway:** Prioritize verified evidence and incremental iteration over speculative assumptions.`;

    s2 = `Here is a brief answer for "${problem}":

You can solve this by doing the following:
- First, look at what is causing the issue.
- Next, apply the standard fix or follow standard protocol.
- Make sure to test it afterwards so that everything works fine.

Let me know if you need more help!`;

    s1_score = 9.1;
    s2_score = 6.4;
    s1_reasoning = `Solution 1 delivers an exceptional, structured analysis. It breaks down root causes, provides an actionable 3-phase execution roadmap, and adds preventative guardrails.`;
    s2_reasoning = `Solution 2 is overly generic and lacks concrete details or structured methodology. It states the obvious without providing actionable depth.`;
    recommendation = `Rely on Solution 1 for strategic planning and thorough execution.`;
    explanation = `Solution 1 outranked Solution 2 by providing clear actionable phases, analytical depth, and clear reasoning flow.`;
  }

  return {
    problem,
    solution_1: s1,
    solution_2: s2,
    model_1: model1,
    model_2: model2,
    judge: {
      solution_1_score: s1_score,
      solution_2_score: s2_score,
      solution_1_reasoning: s1_reasoning,
      solution_2_reasoning: s2_reasoning,
      recommendation,
      explanation,
      winner: s1_score >= s2_score ? 'solution_1' : 'solution_2',
      metrics: {
        solution_1: { accuracy: 94, depth: 93, structure: 96, safety: 98, helpfulness: 95, latency: '1.3s' },
        solution_2: { accuracy: 72, depth: 60, structure: 75, safety: 95, helpfulness: 65, latency: '0.7s' }
      }
    }
  };
}
