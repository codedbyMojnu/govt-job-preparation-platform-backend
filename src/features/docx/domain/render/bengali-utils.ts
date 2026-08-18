const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Converts a non-negative integer to Bengali numerals, e.g. 12 -> "১২". */
export function toBengaliNumber(n: number): string {
  return String(n)
    .split('')
    .map((ch) => (ch >= '0' && ch <= '9' ? BN_DIGITS[Number(ch)]! : ch))
    .join('');
}

const OPTION_LETTERS = ['ক', 'খ', 'গ', 'ঘ'];

/** Maps the API's A/B/C/D correctAnswer value to the Bengali option letter. */
export function optionLetterFor(correctAnswer: string): string {
  const idx = { A: 0, B: 1, C: 2, D: 3 }[correctAnswer.trim().toUpperCase()];
  return idx === undefined ? correctAnswer : OPTION_LETTERS[idx]!;
}
