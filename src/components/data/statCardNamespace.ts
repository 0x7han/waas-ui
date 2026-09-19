import { StatCardRoot, StatCardLabel, StatCardValue, StatCardDelta, StatCardHint } from "./StatCard";

export const StatCard = Object.assign(StatCardRoot, {
  Root: StatCardRoot,
  Label: StatCardLabel,
  Value: StatCardValue,
  Delta: StatCardDelta,
  Hint: StatCardHint,
});