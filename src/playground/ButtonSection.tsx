import { Button, IconButton, Spinner } from "../components/button";
import { Demo, Section, StarIcon } from "./Section";

const VARIANTS = ["primary", "secondary", "outline", "ghost", "destructive", "link"] as const;

export function ButtonSection() {
  return (
    <Section id="button" title="Button" blurb="Six variants, loading/disabled states, icon slots, asChild composition.">
      <Demo title="Variants">
        <div className="pg-row">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Demo>
      <Demo title="States">
        <div className="pg-row">
          <Button loading> Saving</Button>
          <Button disabled>Disabled</Button>
          <Button icon={<StarIcon />}>With icon</Button>
          <Button variant="outline" asChild>
            <a href="#button">As link</a>
          </Button>
        </div>
      </Demo>
      <Demo title="IconButton + Spinner">
        <div className="pg-row">
          <IconButton aria-label="Star" icon={<StarIcon />} />
          <IconButton aria-label="Star outline" variant="outline" icon={<StarIcon />} />
          <IconButton aria-label="Saving" loading icon={<StarIcon />} />
          <Spinner aria-label="Loading content" />
        </div>
      </Demo>
    </Section>
  );
}
