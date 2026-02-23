// Score calculation: 5 items x (1-5) => sum 5-25 => normalized to 0-100
// Formula: (sum - 5) / 20 * 100

export function calculateTotalScore(scores: number[]): number {
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return Math.round(((sum - 5) / 20) * 100);
}
