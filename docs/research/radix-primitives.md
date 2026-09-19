# Radix Primitives mapping for waas-ui — overlay + selection (Ticket #2)

> Scope: 12 primitives — Dialog, DropdownMenu, ContextMenu, Popover, Tooltip, Select,
> Checkbox, Switch, RadioGroup, Tabs, Collapsible, Accordion — plus an explicit gaps section.
> **Session decision (fixed): waas-ui builds on Radix primitives + vanilla CSS + CSS variables,
> compound components.** This file is the evidence base for that decision.
> Versions verified 2026-09-19 via the npm registry (`…/latest` metadata).

## Cross-cutting facts (apply to ALL primitives below)

- **Unstyled by design.** "Radix Primitives are unstyled — and compatible with any styling
  solution — giving you complete control over styling", including functional styles
  (e.g. a Dialog Overlay does NOT cover the viewport until you style it).
  Source: [Styling guide](https://www.radix-ui.com/primitives/docs/guides/styling).
- **Part-based selectors.** Every part accepts `className` passed through to the DOM;
  stateful parts expose state via `data-*` attributes (`data-state`, `data-disabled`,
  `data-highlighted`, `data-orientation`, `data-side`, `data-align`, `data-placeholder`,
  `data-swipe`). Positioning primitives additionally expose per-component CSS variables
  (transform-origin, available width/height, trigger size) for origin-aware animation and
  size constraining.
  Source: [Styling guide](https://www.radix-ui.com/primitives/docs/guides/styling).
- **Composition via `asChild` + `Slot`.** Triggers and most parts accept `asChild` to merge
  props onto waas-ui's own element (uses `@radix-ui/react-slot`, v1.3.3) — this is how
  consumer-provided icon slots and custom triggers compose without wrapper divs.
  Source: [Composition guide](https://www.radix-ui.com/primitives/docs/guides/composition).
- **Controlled or uncontrolled.** Overlay/selection Roots consistently expose
  `open`/`defaultOpen`/`onOpenChange` (or `value`/`defaultValue`/`onValueChange`,
  `checked`/`defaultChecked`/`onCheckedChange`).
  Source: per-component API tables linked below.
- **SSR supported.** "You should be able to use all of our primitives with both approaches
  [SSR and static rendering], for example with Next.js, Remix, or Gatsby." One gotcha:
  on React < 18, ids used in aria attributes hydrate client-side, so screen-reader
  time-to-interactive depends on JS download; React 18 generates ids server-side.
  Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering).
- **Import path / tree-shaking.** Official tutorial installs the `radix-ui` meta-package
  (`npm install radix-ui@latest`) and notes "each primitive is also available from its own
  entrypoint… Importing from the subpath can help some bundlers tree-shake more
  effectively" (e.g. `radix-ui/popover`).
  Source: [Getting started](https://www.radix-ui.com/primitives/docs/overview/getting-started).
- **Bundle-cost column below** is the *unpacked tarball size* from npm metadata
  (includes src, dist, README — NOT min+gz). It overstates shipped cost but is comparable
  across packages; real shipped cost is smaller after tree-shaking. Dialog-family costs
  compound because they pull shared internals (`@radix-ui/react-dismissable-layer` v1.1.19,
  `@radix-ui/react-focus-scope` v1.1.16, `@radix-ui/react-portal` v1.1.17,
  `@radix-ui/react-presence` v1.1.10, `@radix-ui/react-popper` v1.3.7, `react-remove-scroll`).
  Dependency evidence: [@radix-ui/react-dialog latest deps](https://registry.npmjs.org/@radix-ui/react-dialog/latest).

---

## 1. Dialog — `@radix-ui/react-dialog` 1.1.23

Docs: [Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) ·
npm: [@radix-ui/react-dialog](https://www.npmjs.com/package/@radix-ui/react-dialog)

| Dimension | Findings |
|---|---|
| built-in a11y | Automatic modal focus trap ("Focus is automatically trapped within modal"); Esc closes automatically; `Title` + `Description` manage screen-reader announcements (`aria-labelledby`/`aria-describedby` wiring); [Dialog WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal); keyboard: Space/Enter open-close, Tab/Shift+Tab trap, Esc close + focus returns to Trigger. Source: [Dialog docs — Features & Accessibility](https://www.radix-ui.com/primitives/docs/components/dialog). |
| Portal | Yes — `Dialog.Portal` portals Overlay+Content to `document.body` (`container` prop is customizable). Source: [Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog). |
| Escape / outside | `modal` defaults to `true` (underlying content inert via `aria-hidden` + scroll-lock); `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside` can be overridden. Source: [Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog). |
| Styling | Unstyled; `data-state="open\|closed"` on Trigger/Overlay/Content. No built-in CSS variables (position Content yourself, usually fixed-centered). Source: [Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog) + [Styling guide](https://www.radix-ui.com/primitives/docs/guides/styling). |
| SSR | Supported (see cross-component facts). Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±97.0 kB unpacked (tarball; not min+gz). Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-dialog/latest). |
| Role in waas-ui | Foundation for **Modal, AlertDialog-style confirm, and static Sheet/Drawer** (Drawer = Dialog + CSS translate; if gestures are needed — see Gaps). |

## 2. DropdownMenu — `@radix-ui/react-dropdown-menu` 2.1.24

Docs: [Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) ·
npm: [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu)

| Dimension | Findings |
|---|---|
| built-in a11y | [Menu Button WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) + [roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex); full keyboard navigation (Space/Enter open + focus first item, ArrowUp/Down move, ArrowLeft/Right open-close submenu per reading direction, Esc close + focus to Trigger); typeahead; submenus, checkable items (checkbox/radio + indeterminate), groups + labels + separators. Source: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| Portal | Yes — `DropdownMenu.Portal` → `document.body`. Source: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| Escape / outside | `modal` defaults to `true`; `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside` are customizable; collision handling (`side/align/sideOffset/avoidCollisions/collisionBoundary/sticky/hideWhenDetached`). Source: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| Styling | Unstyled; `data-state`, `data-side`, `data-align`, `data-orientation`, `data-highlighted`, `data-disabled`; CSS vars `--radix-dropdown-menu-content-transform-origin`, `--*-available-width/height`, `--*-trigger-width/height` (origin-aware animation + size constraining). Source: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±104.8 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-dropdown-menu/latest). |
| Role in waas-ui | **Action menus, overflow menus, menus + submenus, checkable menu items.** |

## 3. ContextMenu — `@radix-ui/react-context-menu` 2.3.7

Docs: [Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu) ·
npm: [@radix-ui/react-context-menu](https://www.npmjs.com/package/@radix-ui/react-context-menu)

| Dimension | Findings |
|---|---|
| built-in a11y | [Menu WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu) + roving tabindex; same feature set as DropdownMenu (submenus, checkable items, groups/labels, typeahead, full keyboard navigation); triggered by right-click **or long-press on touch**. Source: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| Portal | Yes — to `document.body`. Source: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| Escape / outside | `modal` defaults to `true`; `onEscapeKeyDown`/`onPointerDownOutside`/`onFocusOutside`/`onInteractOutside`; collision handling same as DropdownMenu. Source: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| Styling | Unstyled; `data-state/side/align/highlighted/disabled` + CSS vars `--radix-context-menu-content-*` / `--*-trigger-*`. Source: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±112.3 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-context-menu/latest). |
| Role in waas-ui | **Right-click / long-press menus** (e.g. row actions in tables, canvas). Note: Trigger wraps the target area (`asChild`), not a button. |

## 4. Popover — `@radix-ui/react-popover` 1.1.23

Docs: [Popover](https://www.radix-ui.com/primitives/docs/components/popover) ·
npm: [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover)

| Dimension | Findings |
|---|---|
| built-in a11y | [Dialog WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal); focus "fully managed and customizable"; keyboard: Space/Enter open-close, Tab/Shift+Tab, Esc close + focus to Trigger; supports both modal AND non-modal modes. Source: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| Portal | Yes — `Popover.Portal` → `document.body` (+ optional `Anchor` so Content is positioned against an element other than Trigger). Source: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| Escape / outside | `modal` defaults to `false` (non-modal; suited to panels alongside interactive content); `onEscapeKeyDown`/`onPointerDownOutside`/`onFocusOutside`/`onInteractOutside`; `onOpenAutoFocus`/`onCloseAutoFocus` are customizable. Source: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| Styling | Unstyled; `data-state/side/align` + CSS vars `--radix-popover-content-transform-origin`, `--*-available-width/height`, `--*-trigger-width/height`. Source: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±91.6 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-popover/latest). |
| Role in waas-ui | **Generic non-modal panels** (filter panels, info cards, custom picker shells, custom comboboxes — see Gaps). Unlike Tooltip: interactive + persistent until dismissed. |

## 5. Tooltip — `@radix-ui/react-tooltip` 1.2.16

Docs: [Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) ·
npm: [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip)

| Dimension | Findings |
|---|---|
| built-in a11y | Opens on trigger hover/focus; closes when trigger is activated or on Esc; global `Provider` (`delayDuration` defaults to 700ms, `skipDelayDuration` 300ms); keyboard: Tab opens without delay, Space/Enter/Esc close without delay. **Not** a focus trap (non-interactive content); `aria-label` wiring via Content. Source: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| Portal | Yes — `Tooltip.Portal` → `document.body`. Source: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| Escape / outside | `onEscapeKeyDown`, `onPointerDownOutside`; `disableHoverableContent` for tooltips that must not be hovered. Source: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| Styling | Unstyled; Trigger `data-state="closed\|delayed-open\|instant-open"`; Content `data-state/side/align` + CSS vars `--radix-tooltip-content-*`. Source: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±135.8 kB unpacked (second largest after Select — includes Provider + Popper). Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-tooltip/latest). |
| Role in waas-ui | **Hover/focus hints for icon buttons and truncated text.** One `Tooltip.Provider` at the root with a delay matching waas-ui tokens. |

## 6. Select — `@radix-ui/react-select` 2.3.7

Docs: [Select](https://www.radix-ui.com/primitives/docs/components/select) ·
npm: [@radix-ui/react-select](https://www.npmjs.com/package/@radix-ui/react-select)

| Dimension | Findings |
|---|---|
| built-in a11y | [ListBox WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox) (+ W3C [Select-Only Combobox example](https://www.w3.org/TR/wai-aria-practices/examples/combobox/combobox-select-only.html)); fully managed focus; full keyboard navigation (Space/Enter open + select, ArrowUp/Down move, Esc close + focus to Trigger); typeahead; RTL (`dir`); groups/labels for labelling; `Label` integration; **two positioning modes**: `item-aligned` (like a macOS menu — Content aligns with the active item) and `popper` (like Popover/DropdownMenu). Source: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Portal | Yes — `Select.Portal` → `document.body`; scrollable Viewport + built-in ScrollUp/DownButton (or compose with ScrollArea). Source: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Escape / outside | `onEscapeKeyDown`, `onPointerDownOutside`, `onCloseAutoFocus`; avoid styling `Value`/`ItemText` (breaks positioning). Source: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Styling | Unstyled; Trigger `data-state/disabled/placeholder`; Item `data-state="checked\|unchecked"` + `data-highlighted/disabled`; CSS vars `--radix-select-*` (only when `position="popper"`). Default `Icon` renders `▼` — replace with the waas-ui icon slot via `asChild`/children. Source: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Form | Renders a hidden native `<select>` for form submission (can be decoupled via `unstable_Provider`/`unstable_BubbleInput`). Source: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±343.8 kB unpacked — **heaviest of the 12 primitives** (viewport/scroll/typeahead machinery). Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-select/latest). |
| Role in waas-ui | **Default single-select Select.** For multi-select, searchable, or async: compose Popover + Checkbox/Command (see Gaps) — do not force-fit Select. |

## 7. Checkbox — `@radix-ui/react-checkbox` 1.3.11

Docs: [Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) ·
npm: [@radix-ui/react-checkbox](https://www.npmjs.com/package/@radix-ui/react-checkbox)

| Dimension | Findings |
|---|---|
| built-in a11y | [Tri-state Checkbox WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox); supports `indeterminate`; keyboard: Space checks/unchecks. Source: [Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox). |
| Portal / focus trap / Esc | None (inline control, not an overlay) — N/A. |
| Styling | Unstyled; Root+Indicator `data-state="checked\|unchecked\|indeterminate"` + `data-disabled`; Indicator renders when checked/indeterminate, wrapping a consumer icon (waas-ui Check/Minus icon slot). Source: [Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox). |
| Form | Renders a hidden `<input>` for submission (decouple via `unstable_Provider`/`unstable_Trigger`/`unstable_BubbleInput`). Source: [Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±74.4 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-checkbox/latest). |

## 8. Switch — `@radix-ui/react-switch` 1.3.7

Docs: [Switch](https://www.radix-ui.com/primitives/docs/components/switch) ·
npm: [@radix-ui/react-switch](https://www.npmjs.com/package/@radix-ui/react-switch)

| Dimension | Findings |
|---|---|
| built-in a11y | Meets the [`switch` role requirements](https://www.w3.org/WAI/ARIA/apg/patterns/switch); keyboard: both Space AND Enter toggle. Source: [Switch docs](https://www.radix-ui.com/primitives/docs/components/switch). |
| Portal / focus trap / Esc | None (inline control) — N/A. |
| Styling | Unstyled; Root+Thumb `data-state="checked\|unchecked"` + `data-disabled`. Source: [Switch docs](https://www.radix-ui.com/primitives/docs/components/switch). |
| Form | Hidden `<input>` like Checkbox (decouple via `unstable_*`). Source: [Switch docs](https://www.radix-ui.com/primitives/docs/components/switch). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±66.8 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-switch/latest). |

## 9. RadioGroup — `@radix-ui/react-radio-group` 1.4.7

Docs: [Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) ·
npm: [@radix-ui/react-radio-group](https://www.npmjs.com/package/@radix-ui/react-radio-group)

| Dimension | Findings |
|---|---|
| built-in a11y | [Radio Group WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio) + roving tabindex; horizontal/vertical orientation; `loop` defaults to `true`; keyboard: Tab to checked/first item, Space checks, Arrow keys move + check. Source: [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| Portal / focus trap / Esc | None (inline control) — N/A. |
| Styling | Unstyled; Item+Indicator `data-state="checked\|unchecked"` + `data-disabled`; Root `data-disabled`. Source: [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| Form | Each Item renders a hidden `<input>` (decouple via `unstable_ItemProvider`/`unstable_ItemTrigger`/`unstable_ItemBubbleInput`). Source: [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| SSR | Supported (`dir` prop for RTL). Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering) + [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| Bundle | ±114.5 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-radio-group/latest). |

## 10. Tabs — `@radix-ui/react-tabs` 1.1.21

Docs: [Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) ·
npm: [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs)

| Dimension | Findings |
|---|---|
| built-in a11y | [Tabs WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs); horizontal/vertical orientation; `automatic` (default) or `manual` activation; keyboard: Tab to active trigger → active content, Arrow keys move + activate (or move only when manual), Home/End. Source: [Tabs docs](https://www.radix-ui.com/primitives/docs/components/tabs). |
| Portal / focus trap / Esc | None (inline navigation) — N/A. |
| Styling | Unstyled; Trigger/Content `data-state="active\|inactive"` + `data-orientation`/`data-disabled`; List `loop` defaults to `true`. Source: [Tabs docs](https://www.radix-ui.com/primitives/docs/components/tabs). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±53.0 kB unpacked — one of the lightest. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-tabs/latest). |

## 11. Collapsible — `@radix-ui/react-collapsible` 1.1.20

Docs: [Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) ·
npm: [@radix-ui/react-collapsible](https://www.npmjs.com/package/@radix-ui/react-collapsible)

| Dimension | Findings |
|---|---|
| built-in a11y | [Disclosure WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure); keyboard: Space/Enter open-close. Source: [Collapsible docs](https://www.radix-ui.com/primitives/docs/components/collapsible). |
| Portal / focus trap / Esc | None (inline section) — N/A. |
| Styling | Unstyled; Root/Trigger/Content `data-state="open\|closed"` + `data-disabled`; CSS vars `--radix-collapsible-content-width/height` for height animation (`slideDown/slideUp` keyframes pattern in the docs). Source: [Collapsible docs](https://www.radix-ui.com/primitives/docs/components/collapsible). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±45.0 kB unpacked — lightest of the 12 primitives. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-collapsible/latest). |
| Role in waas-ui | **Atomic disclosure/expandable section**; Accordion is built on the same pattern. |

## 12. Accordion — `@radix-ui/react-accordion` 1.2.20

Docs: [Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) ·
npm: [@radix-ui/react-accordion](https://www.npmjs.com/package/@radix-ui/react-accordion)

| Dimension | Findings |
|---|---|
| built-in a11y | [Accordion WAI-ARIA pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion); vertical/horizontal orientation; RTL (`dir` defaults to `ltr`); `single` type (+ `collapsible` so all items can be closed) or `multiple`; keyboard: Space/Enter expand, Tab/Shift+Tab, orientation-aware Arrow keys, Home/End. Source: [Accordion docs](https://www.radix-ui.com/primitives/docs/components/accordion). |
| Portal / focus trap / Esc | None (inline stacked headings) — N/A. |
| Styling | Unstyled; Item/Header/Trigger/Content `data-state="open\|closed"` + `data-disabled/orientation`; CSS vars `--radix-accordion-content-width/height` for animation; chevron-icon rotate pattern via `[data-state="open"]`. Source: [Accordion docs](https://www.radix-ui.com/primitives/docs/components/accordion). |
| SSR | Supported. Source: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±90.6 kB unpacked. Source: [npm metadata](https://registry.npmjs.org/@radix-ui/react-accordion/latest). |

---

## Gaps — waas-ui needs NOT covered by Radix

> Radix is intentionally low-level and does not provide the patterns below. Recommendations
> follow the session principles: headless/unstyled, composable with waas-ui compound components,
> consumer-provided icon slots.

| Need | Status in Radix | Recommendation + source |
|---|---|---|
| **Command palette (`cmdk`-style, filterable + keyboard-first)** | No command/combobox primitive. Select is single-select listbox pattern only; Popover is a positioning shell only. | **`cmdk` v1.1.1** (±80 kB unpacked) — headless React command menu (popularized by shadcn). Zero-dependency alternative: compose `Popover` + input + custom list. Source: [cmdk repo/docs](https://github.com/pacocoursey/cmdk) · [npm cmdk](https://www.npmjs.com/package/cmdk). |
| **DatePicker / Calendar** | None. | **`react-day-picker` v10.0.1** — calendar styled with its own CSS/variables; wrap `DayPicker` in waas-ui `Popover` (date dropdown) or `Dialog` (mobile). Source: [react-day-picker docs](https://react-day-picker.js.org/) · [npm](https://www.npmjs.com/package/react-day-picker). |
| **Drawer / Sheet gestures (swipe-to-close, drag handle)** | No gestures. `Dialog` covers static modal-sheet needs (`modal=true` + CSS translate), but without drag/swipe physics. | **`vaul` v1.1.2** (±180 kB unpacked) — Drawer for React (used by shadcn `Drawer`); unstyled, gesture-native. If no gesture is needed: use `Dialog` + waas-ui translate tokens, with no new dependency. Source: [vaul repo](https://github.com/emilkowalski/vaul) · [npm vaul](https://www.npmjs.com/package/vaul). |
| **Toast — imperative notification system** | **Radix HAS `@radix-ui/react-toast` v1.2.23** (±182 kB unpacked): auto-close, pause on hover/focus/blur, swipe-to-dismiss + CSS vars (`--radix-toast-swipe-*`), hotkey to viewport (`F8` default), `aria-live` via `type="foreground"\|"background"`. What is NOT provided: imperative queue/store (`toast()` API) — waas-ui must build it itself (see the "imperative API" pattern in the docs). Single-dependency alternative: **`sonner` v2.0.8** (opinionated, built-in `toast()`, used by shadcn). Decision deferred to the component ticket — both options are valid. Source: [Toast docs](https://www.radix-ui.com/primitives/docs/components/toast) · [sonner npm](https://www.npmjs.com/package/sonner). |
| **DataTable primitives (sort/filter/paginate/virtualize)** | None — outside the Radix mission (they only offer cell-level primitives such as Checkbox/Select). | **`@tanstack/react-table` v9.2.4** (±131 kB unpacked) — headless table logic (not a UI kit), aligned with the "DataTable deferred" decision: adopt when the table ticket opens, pair cells with Radix primitives (Checkbox, DropdownMenu, Select, Popover). Do not build sorting/filtering/pagination yourself. Source: [TanStack Table docs](https://tanstack.com/table/latest) · [npm](https://www.npmjs.com/package/@tanstack/react-table). |
| **Combobox / Async autocomplete (searchable select)** | No combobox primitive (Select = select-only). | Compose **`Popover` + input + custom listbox** (or `cmdk` if built-in filtering is needed); for async, control `open` + the result list yourself. Source: W3C [Select-Only Combobox pattern](https://www.w3.org/TR/wai-aria-practices/examples/combobox/combobox-select-only.html) referenced by [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |

## Installation recommendations (for the packaging ticket)

```bash
# Approach A — meta-package + tree-shake via subpath (official tutorial way):
npm install radix-ui@latest
```

```jsx
import { Dialog } from "radix-ui";        // or:
import * as Popover from "radix-ui/popover";
```

```bash
# Approach B — per-primitive packages (per-component version control, per tables §1–§12):
npm install @radix-ui/react-dialog@1.1.23 @radix-ui/react-dropdown-menu@2.1.24 \
  @radix-ui/react-context-menu@2.3.7 @radix-ui/react-popover@1.1.23 \
  @radix-ui/react-tooltip@1.2.16 @radix-ui/react-select@2.3.7 \
  @radix-ui/react-checkbox@1.3.11 @radix-ui/react-switch@1.3.7 \
  @radix-ui/react-radio-group@1.4.7 @radix-ui/react-tabs@1.1.21 \
  @radix-ui/react-collapsible@1.1.20 @radix-ui/react-accordion@1.2.20
# Versions from https://registry.npmjs.org/@radix-ui/react-<name>/latest (2026-09-19)
```

*Install source: [Getting started](https://www.radix-ui.com/primitives/docs/overview/getting-started).*

---

*Sources are primary only: [radix-ui.com/primitives docs](https://www.radix-ui.com/primitives/),
[radix-ui GitHub org](https://github.com/radix-ui/primitives),
[npm registry metadata](https://registry.npmjs.org/), and linked W3C APG patterns.
No production code touched — research file only, per ticket #2.*
