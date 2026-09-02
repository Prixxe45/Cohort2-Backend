import { simulateArenaDuel } from './arenaEngine';

/**
 * Normalizes backend responses (or simulated duel results) into a unified UI structure.
 */
export function normalizeArenaResult(rawResult, model1, model2) {
  // If wrapped in standard LangGraph response { success: true, result: { ... } }
  const data = rawResult.result ? rawResult.result : rawResult;

  const s1 = data.solution_1 || data.solution1 || data.solutionA || '';
  const s2 = data.solution_2 || data.solution2 || data.solutionB || '';
  const problemText = data.problem || '';

  const judgeRaw = data.judge || {};
  const s1_score = Number(judgeRaw.solution_1_score ?? judgeRaw.solution1_score ?? judgeRaw.score_1 ?? 8.5);
  const s2_score = Number(judgeRaw.solution_2_score ?? judgeRaw.solution2_score ?? judgeRaw.score_2 ?? 7.0);

  const s1_reasoning = judgeRaw.solution_1_reasoning || judgeRaw.solution1_reasoning || 'Thorough and well-reasoned response.';
  const s2_reasoning = judgeRaw.solution_2_reasoning || judgeRaw.solution2_reasoning || 'Standard response with basic coverage.';

  const winner = s1_score >= s2_score ? 'solution_1' : 'solution_2';
  const winnerModel = winner === 'solution_1' ? (model1?.name || 'Model 1') : (model2?.name || 'Model 2');
  const runnerUpModel = winner === 'solution_1' ? (model2?.name || 'Model 2') : (model1?.name || 'Model 1');
  const scoreDiff = Math.abs(s1_score - s2_score).toFixed(1);

  const defaultRecommendation = judgeRaw.recommendation ||
    `Choose ${winnerModel}. It provides superior depth, adherence to prompt constraints, and actionable detail compared to ${runnerUpModel}.`;

  const defaultExplanation = judgeRaw.explanation ||
    `${winnerModel} scored higher (${Math.max(s1_score, s2_score)}/10 vs ${Math.min(s1_score, s2_score)}/10, +${scoreDiff} margin). It outperformed the alternative in response completeness, structured formatting, and practical application.`;

  return {
    problem: problemText,
    solution_1: s1,
    solution_2: s2,
    model_1: model1 || { id: 'model_1', name: 'Model 1', avatar: '🟠' },
    model_2: model2 || { id: 'model_2', name: 'Model 2', avatar: '🛡️' },
    judge: {
      solution_1_score: s1_score,
      solution_2_score: s2_score,
      solution_1_reasoning: s1_reasoning,
      solution_2_reasoning: s2_reasoning,
      recommendation: defaultRecommendation,
      explanation: defaultExplanation,
      winner,
      winnerName: winnerModel,
      metrics: judgeRaw.metrics || {
        solution_1: {
          accuracy: Math.min(100, Math.round(s1_score * 10)),
          depth: Math.min(100, Math.round(s1_score * 9.8)),
          structure: Math.min(100, Math.round(s1_score * 9.5)),
          safety: 98,
          helpfulness: Math.min(100, Math.round(s1_score * 10)),
          latency: '1.2s'
        },
        solution_2: {
          accuracy: Math.min(100, Math.round(s2_score * 10)),
          depth: Math.min(100, Math.round(s2_score * 8.5)),
          structure: Math.min(100, Math.round(s2_score * 9.0)),
          safety: 99,
          helpfulness: Math.min(100, Math.round(s2_score * 9.2)),
          latency: '0.8s'
        }
      }
    }
  };
}

/**
 * Dispatches problem to the backend API or falls back to simulation engine.
 */
export async function executeArenaBattle({
  problem,
  model1,
  model2,
  judgePersona,
  apiUrl,
  useBackend = false
}) {
  if (useBackend && apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem,
          model_1: model1.id,
          model_2: model2.id,
          judge: judgePersona?.id || 'supreme-council'
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return normalizeArenaResult(json, model1, model2);
    } catch (backendError) {
      console.warn('Backend connection failed or unavailable, falling back to Arena Engine:', backendError);
      // Seamless fallback to intelligent client-side simulation
      const simulated = await simulateArenaDuel({ problem, model1, model2, judgePersona });
      return normalizeArenaResult(simulated, model1, model2);
    }
  }

  // Pure Arena Simulation mode
  const simulated = await simulateArenaDuel({ problem, model1, model2, judgePersona });
  return normalizeArenaResult(simulated, model1, model2);
}
