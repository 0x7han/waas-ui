import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, createRef, type FormEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {} from "@testing-library/jest-dom/vitest";
import { Form, FormField, Input, Textarea } from "./index";

function MailIcon() {
  return createElement("svg", { "aria-label": "mail", role: "img" });
}

afterEach(() => {
  cleanup();
});

describe("Form", () => {
  it("renders a form element with the waas-form class", () => {
    render(
      createElement(Form, { "aria-label": "Signup" }, createElement("button", { type: "submit" }, "Go")),
    );
    const form = screen.getByRole("form", { name: "Signup" });
    expect(form.tagName).toBe("FORM");
    expect(form.className).toContain("waas-form");
  });

  it("submits via the native submit flow", async () => {
    const onSubmit = vi.fn((event: FormEvent) => {
      event.preventDefault();
    });
    const user = userEvent.setup();
    render(
      createElement(
        Form,
        { "aria-label": "Signup", onSubmit },
        createElement("button", { type: "submit" }, "Go"),
      ),
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("composes via asChild without wrapper elements", () => {
    render(
      createElement(
        Form,
        { asChild: true },
        createElement("form", { "aria-label": "Custom" }, "fields"),
      ),
    );
    const form = screen.getByRole("form", { name: "Custom" });
    expect(form.tagName).toBe("FORM");
    expect(form.className).toContain("waas-form");
  });

  it("forwards refs to the form element", () => {
    const ref = createRef<HTMLFormElement>();
    render(createElement(Form, { ref }));
    expect(ref.current?.tagName).toBe("FORM");
  });
});

describe("FormField composition", () => {
  it("links the label to the control and wires the description", () => {
    render(
      createElement(
        Form,
        null,
        createElement(
          FormField.Root,
          null,
          createElement(FormField.Label, null, "Email"),
          createElement(Input, { type: "email" }),
          createElement(FormField.Description, null, "We never share your email."),
        ),
      ),
    );
    const input = screen.getByLabelText("Email");
    expect(input.tagName).toBe("INPUT");
    const description = screen.getByText("We never share your email.");
    expect(input.getAttribute("aria-describedby")).toContain(description.id);
    expect(description.id).not.toBe("");
  });

  it("shows the error alert, marks the control invalid, and describes it", () => {
    render(
      createElement(
        FormField.Root,
        { error: true },
        createElement(FormField.Label, null, "Username"),
        createElement(Input, null),
        createElement(FormField.Error, null, "Username is required."),
      ),
    );
    const input = screen.getByLabelText("Username");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Username is required.");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("data-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toContain(alert.id);
  });

  it("renders no error node when the field has no error", () => {
    render(
      createElement(
        FormField.Root,
        null,
        createElement(FormField.Label, null, "Username"),
        createElement(Input, null),
        createElement(FormField.Error, null, "Username is required."),
      ),
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByLabelText("Username").getAttribute("aria-invalid")).toBeNull();
  });

  it("supports an explicit control id override", () => {
    render(
      createElement(
        FormField.Root,
        { id: "custom-id" },
        createElement(FormField.Label, null, "Name"),
        createElement(Input, null),
      ),
    );
    expect(screen.getByLabelText("Name").id).toBe("custom-id");
  });

  it("omits aria-describedby when no description or error is present", () => {
    render(
      createElement(
        FormField.Root,
        null,
        createElement(FormField.Label, null, "Name"),
        createElement(Input, null),
      ),
    );
    expect(screen.getByLabelText("Name").getAttribute("aria-describedby")).toBeNull();
  });

  it("forwards refs on Root, Label, Description, and Error", () => {
    const rootRef = createRef<HTMLDivElement>();
    const labelRef = createRef<HTMLLabelElement>();
    const descriptionRef = createRef<HTMLParagraphElement>();
    const errorRef = createRef<HTMLParagraphElement>();
    render(
      createElement(
        FormField.Root,
        { ref: rootRef, error: true },
        createElement(FormField.Label, { ref: labelRef }, "Name"),
        createElement(Input, null),
        createElement(FormField.Description, { ref: descriptionRef }, "Hint"),
        createElement(FormField.Error, { ref: errorRef }, "Bad value."),
      ),
    );
    expect(rootRef.current?.tagName).toBe("DIV");
    expect(labelRef.current?.tagName).toBe("LABEL");
    expect(descriptionRef.current?.tagName).toBe("P");
    expect(errorRef.current?.tagName).toBe("P");
  });
});

describe("Input variants", () => {
  it.each(["text", "email", "password", "search", "number"] as const)(
    "renders type %s",
    (type) => {
      render(createElement(Input, { type, "aria-label": `${type} field` }));
      const input = screen.getByLabelText(`${type} field`);
      expect(input.getAttribute("type")).toBe(type);
      cleanup();
    },
  );

  it("renders prefix and suffix content in icon slots", () => {
    render(
      createElement(Input, {
        "aria-label": "Amount",
        prefix: createElement(MailIcon),
        suffix: "$",
      }),
    );
    const input = screen.getByLabelText("Amount");
    const wrapper = input.parentElement;
    expect(wrapper?.className).toContain("waas-input-wrapper");
    const prefix = wrapper?.querySelector('[data-waas-icon-slot="prefix"]');
    const suffix = wrapper?.querySelector('[data-waas-icon-slot="suffix"]');
    expect(prefix).not.toBeNull();
    expect(suffix).not.toBeNull();
    expect(suffix).toHaveTextContent("$");
    expect(prefix?.querySelector('[role="img"]')).not.toBeNull();
  });

  it("displays a success validation state", () => {
    render(createElement(Input, { "aria-label": "Code", success: true }));
    expect(screen.getByLabelText("Code").getAttribute("data-valid")).toBe("true");
  });

  it("forwards refs to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(createElement(Input, { ref, "aria-label": "Ref" }));
    expect(ref.current?.tagName).toBe("INPUT");
  });
});

describe("Input and Textarea states", () => {
  it("marks required controls with aria-required and a visible marker", () => {
    render(
      createElement(
        FormField.Root,
        { required: true },
        createElement(FormField.Label, null, "Password"),
        createElement(Input, { type: "password" }),
      ),
    );
    const input = screen.getByLabelText(/Password/);
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(input.getAttribute("data-required")).toBe("true");
    const label = screen.getByText(/Password/, { selector: "label" });
    expect(label.querySelector("[data-waas-required-marker]")).not.toBeNull();
  });

  it("supports required as a standalone input prop", () => {
    render(createElement(Input, { "aria-label": "Nick", required: true }));
    expect(screen.getByLabelText("Nick").getAttribute("aria-required")).toBe("true");
  });

  it("supports disabled state on the field", () => {
    render(
      createElement(
        FormField.Root,
        { disabled: true },
        createElement(FormField.Label, null, "City"),
        createElement(Input, null),
      ),
    );
    const input = screen.getByLabelText("City");
    expect(input).toBeDisabled();
    expect(input.getAttribute("data-disabled")).toBe("true");
  });

  it("supports loading state and blocks typing", async () => {
    const user = userEvent.setup();
    render(createElement(Input, { "aria-label": "Query", loading: true }));
    const input = screen.getByLabelText("Query");
    expect(input).toBeDisabled();
    expect(input.getAttribute("data-loading")).toBe("true");
    screen.getByRole("status", { name: "Loading" });
    await user.type(input, "hello");
    expect(input).toHaveValue("");
  });

  it("textarea supports error, disabled, and loading states", () => {
    const { rerender } = render(
      createElement(
        FormField.Root,
        { error: true },
        createElement(FormField.Label, null, "Bio"),
        createElement(Textarea, null),
        createElement(FormField.Error, null, "Too short."),
      ),
    );
    const bio = screen.getByLabelText("Bio");
    expect(bio.tagName).toBe("TEXTAREA");
    expect(bio.getAttribute("aria-invalid")).toBe("true");
    screen.getByRole("alert");

    rerender(createElement(Textarea, { "aria-label": "Notes", disabled: true }));
    expect(screen.getByLabelText("Notes")).toBeDisabled();

    rerender(createElement(Textarea, { "aria-label": "Draft", loading: true }));
    const draft = screen.getByLabelText("Draft");
    expect(draft).toBeDisabled();
    expect(draft.getAttribute("data-loading")).toBe("true");
    screen.getByRole("status", { name: "Loading" });
  });

  it("forwards refs to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(createElement(Textarea, { ref, "aria-label": "Ref area" }));
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });
});

describe("Textarea", () => {
  it("associates the label and passes rows through", () => {
    render(
      createElement(
        FormField.Root,
        null,
        createElement(FormField.Label, null, "Message"),
        createElement(Textarea, { rows: 5, placeholder: "Write something" }),
      ),
    );
    const area = screen.getByLabelText("Message");
    expect(area.getAttribute("rows")).toBe("5");
    expect(area.getAttribute("placeholder")).toBe("Write something");
    expect(area.className).toContain("waas-textarea");
  });
});

describe("keyboard and screen-reader behavior", () => {
  it("types into a labelled input and tabs to the next control", async () => {
    const user = userEvent.setup();
    render(
      createElement(
        Form,
        null,
        createElement(
          FormField.Root,
          null,
          createElement(FormField.Label, null, "First name"),
          createElement(Input, null),
        ),
        createElement(
          FormField.Root,
          null,
          createElement(FormField.Label, null, "Last name"),
          createElement(Input, null),
        ),
      ),
    );
    const first = screen.getByLabelText("First name");
    await user.click(first);
    await user.type(first, "Ada");
    expect(first).toHaveValue("Ada");
    await user.tab();
    expect(screen.getByLabelText("Last name")).toHaveFocus();
  });

  it("label element points at the control id", () => {
    render(
      createElement(
        FormField.Root,
        null,
        createElement(FormField.Label, null, "Website"),
        createElement(Input, { type: "text" }),
      ),
    );
    const input = screen.getByLabelText("Website");
    expect(screen.getByText("Website", { selector: "label" }).getAttribute("for")).toBe(input.id);
  });
});
