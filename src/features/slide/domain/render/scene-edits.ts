import type { Scene } from './types.js';
import type { SlideQuestionInput } from './types.js';

import { decodeHtmlEntities } from './html-decode.js';

type MutableQuestion = SlideQuestionInput;

function stripQuestionPrefix(text: string): string {
  return text.replace(/^[\d০-৯]+[\u0964\u0965.]\s*/, '').trim();
}

function stripOptionPrefix(text: string): string {
  const match = text.match(/^\(([কখগঘ])\)\s*(.*)$/s);
  if (match) return (match[2] ?? '').trim();
  return text.trim();
}

function stripExplanationPrefix(text: string): string {
  return text.replace(/^ব্যাখ্যা:\s*/, '').trim();
}

const LEGACY_EXP_ID = /^exp-text-\d+-\d+$/;

/**
 * Reads edited text from scene nodes and merges into question data so the slide
 * can be fully re-composed with correct layout height (no stale whitespace).
 */
export function applySceneEditsToQuestions(
  scene: Scene,
  questionsInOrder: SlideQuestionInput[],
): SlideQuestionInput[] {
  const byId = new Map<string, MutableQuestion>(
    questionsInOrder.map((q): [string, MutableQuestion] => [
      q.id,
      {
        ...q,
        questionText: decodeHtmlEntities(q.questionText),
        optionA: decodeHtmlEntities(q.optionA),
        optionB: decodeHtmlEntities(q.optionB),
        optionC: decodeHtmlEntities(q.optionC),
        optionD: decodeHtmlEntities(q.optionD),
        explanation:
          q.explanation != null && q.explanation !== ''
            ? decodeHtmlEntities(q.explanation)
            : q.explanation,
      },
    ]),
  );

  const legacyExpNodes: Array<{ text: string }> = [];
  const [singleQuestion] = questionsInOrder;

  for (const node of scene.nodes) {
    if (node.type !== 'text' || !node.text?.trim()) continue;
    const text = decodeHtmlEntities(node.text);

    // SINGLE mode — one question per slide
    if (node.id === 'question-text' && singleQuestion) {
      const q = byId.get(singleQuestion.id);
      if (q) q.questionText = stripQuestionPrefix(text);
      continue;
    }

    const singleOptMatch = node.id.match(/^single-opt-([ABCD])$/);
    if (singleOptMatch && singleQuestion) {
      const key = singleOptMatch[1] as 'A' | 'B' | 'C' | 'D';
      const q = byId.get(singleQuestion.id);
      if (q) q[`option${key}`] = stripOptionPrefix(text);
      continue;
    }

    if (node.id === 'single-exp-text' && singleQuestion) {
      const q = byId.get(singleQuestion.id);
      if (q) q.explanation = stripExplanationPrefix(text);
      continue;
    }

    // GROUPED mode
    if (node.id.startsWith('q-')) {
      const qId = node.id.slice(2);
      const q = byId.get(qId);
      if (q) q.questionText = stripQuestionPrefix(text);
      continue;
    }

    const optMatch = node.id.match(/^opt-(.+)-([ABCD])$/);
    if (optMatch) {
      const [, qId, key] = optMatch as [string, string, 'A' | 'B' | 'C' | 'D'];
      const q = byId.get(qId);
      if (q) q[`option${key}`] = stripOptionPrefix(text);
      continue;
    }

    if (node.id.startsWith('exp-text-') && !LEGACY_EXP_ID.test(node.id)) {
      const qId = node.id.slice('exp-text-'.length);
      const q = byId.get(qId);
      if (q) q.explanation = stripExplanationPrefix(text);
      continue;
    }

    if (LEGACY_EXP_ID.test(node.id)) {
      legacyExpNodes.push({ text });
    }
  }

  // Legacy slides used exp-text-{x}-{y} — map by vertical order to questions on this slide
  legacyExpNodes.forEach((node, index) => {
    const q = questionsInOrder[index];
    if (!q) return;
    const target = byId.get(q.id);
    if (target) target.explanation = stripExplanationPrefix(node.text);
  });

  return questionsInOrder.map((q) => byId.get(q.id)!);
}
