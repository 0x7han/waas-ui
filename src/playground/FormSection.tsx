import { useState } from "react";
import { Form, FormField, Input, Textarea } from "../components/form";
import { Button } from "../components/button";
import { Demo, Section } from "./Section";

export function FormSection() {
  const [email, setEmail] = useState("");
  const showError = email !== "" && !email.includes("@");
  return (
    <Section id="form" title="Form" blurb="Compound FormField: label, control, description, error. Input compositions by type.">
      <Demo title="Email field with validation">
        <Form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <FormField.Root required error={showError}>
            <FormField.Label>Email</FormField.Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <FormField.Description>We will never share your email.</FormField.Description>
            {showError ? <FormField.Error>Enter a valid email address.</FormField.Error> : null}
          </FormField.Root>
          <div className="pg-row">
            <Button type="submit">Subscribe</Button>
            <Button type="button" variant="ghost" onClick={() => setEmail("")}>
              Clear
            </Button>
          </div>
        </Form>
      </Demo>
      <Demo title="Input types + Textarea">
        <div className="pg-grid-2">
          <FormField.Root>
            <FormField.Label>Password</FormField.Label>
            <Input type="password" placeholder="••••••••" />
          </FormField.Root>
          <FormField.Root>
            <FormField.Label>Search</FormField.Label>
            <Input type="search" placeholder="Search members…" />
          </FormField.Root>
          <FormField.Root>
            <FormField.Label>Seats</FormField.Label>
            <Input type="number" placeholder="5" />
          </FormField.Root>
          <FormField.Root disabled>
            <FormField.Label>Disabled</FormField.Label>
            <Input placeholder="Cannot edit" />
          </FormField.Root>
        </div>
        <FormField.Root>
          <FormField.Label>Bio</FormField.Label>
          <Textarea placeholder="Tell us about your team…" rows={3} />
          <FormField.Description>Up to 280 characters.</FormField.Description>
        </FormField.Root>
      </Demo>
    </Section>
  );
}
