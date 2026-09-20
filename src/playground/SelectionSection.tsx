import { useState } from "react";
import { Checkbox, RadioGroup, RadioItem, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Switch } from "../components/selection";
import { Demo, Section } from "./Section";

export function SelectionSection() {
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(false);
  return (
    <Section id="selection" title="Selection" blurb="Single Select, Checkbox, Radio group, Switch. MultiSelect and Combobox are deferred.">
      <Demo title="Select + Switch + Checkbox">
        <div className="pg-row">
          <Select defaultValue="editor">
            <SelectTrigger aria-label="Role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Team roles</SelectLabel>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>External</SelectLabel>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Switch checked={switched} onCheckedChange={setSwitched} aria-label="Email notifications" />
          <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} aria-label="Accept terms" />
        </div>
      </Demo>
      <Demo title="Radio group">
        <RadioGroup defaultValue="monthly" aria-label="Billing period">
          <div className="pg-row">
            <RadioItem value="monthly" id="pg-radio-monthly" />
            <label htmlFor="pg-radio-monthly">Monthly</label>
            <RadioItem value="yearly" id="pg-radio-yearly" />
            <label htmlFor="pg-radio-yearly">Yearly</label>
          </div>
        </RadioGroup>
      </Demo>
    </Section>
  );
}
