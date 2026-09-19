// PROTOTYPE (throwaway, ticket #6) — answers: which API pattern for waas-ui?
// Three API variants of the same "Team members" surface, switchable via
// ?prototype=compound-api&variant=A|B|C on the dev server root route.
import { useEffect, useState } from "react";
import "./prototype.css";
import { getVariant, PrototypeSwitcher, type VariantKey } from "./PrototypeSwitcher";
import { VariantA } from "./variants/VariantA";
import { VariantB } from "./variants/VariantB";
import { VariantC } from "./variants/VariantC";

export function CompoundApiPage() {
  const [variant, setV] = useState<VariantKey>(() => getVariant());

  useEffect(() => {
    const sync = () => setV(getVariant());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  return (
    <div className="proto-page">
      {variant === "A" && <VariantA />}
      {variant === "B" && <VariantB />}
      {variant === "C" && <VariantC />}
      <PrototypeSwitcher current={variant} />
    </div>
  );
}
