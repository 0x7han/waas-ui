# Radix Primitives mapping untuk waas-ui — overlay + selection (Ticket #2)

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

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Modal focus trap otomatis ("Focus is automatically trapped within modal"); Esc menutup otomatis; `Title` + `Description` mengelola pengumuman screen reader (`aria-labelledby`/`aria-describedby` wiring); pola [Dialog WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal); keyboard: Space/Enter buka-tutup, Tab/Shift+Tab trap, Esc tutup + fokus kembali ke Trigger. Sumber: [Dialog docs — Features & Accessibility](https://www.radix-ui.com/primitives/docs/components/dialog). |
| Portal | Ya — `Dialog.Portal` mem-portal Overlay+Content ke `document.body` (prop `container` dapat dikustom). Sumber: [Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog). |
| Escape / outside | `modal` default `true` (konten bawah inert via `aria-hidden` + scroll-lock); `onEscapeKeyDown`, `onPointerDownOutside`, `onInteractOutside` dapat di-override. Sumber: [Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog). |
| Styling | Unstyled; `data-state="open\|closed"` pada Trigger/Overlay/Content. Tanpa CSS variables bawaan (posisikan Content sendiri, biasanya fixed-centered). Sumber: [Dialog docs](https://www.radix-ui.com/primitives/docs/components/dialog) + [Styling guide](https://www.radix-ui.com/primitives/docs/guides/styling). |
| SSR | Didukung (lihat fakta lintas-komponen). Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±97.0 kB unpacked (tarball; bukan min+gz). Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-dialog/latest). |
| Peran di waas-ui | Fondasi **Modal, AlertDialog-style confirm, dan Sheet/Drawer statis** (Drawer = Dialog + CSS translate; bila butuh gesture — lihat Gaps). |

## 2. DropdownMenu — `@radix-ui/react-dropdown-menu` 2.1.24

Docs: [Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) ·
npm: [@radix-ui/react-dropdown-menu](https://www.npmjs.com/package/@radix-ui/react-dropdown-menu)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Menu Button WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) + [roving tabindex](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex); full keyboard nav (Space/Enter buka + fokus item pertama, ArrowUp/Down gerak, ArrowLeft/Right buka-tutup submenu sesuai arah baca, Esc tutup + fokus ke Trigger); typeahead; submenu, checkable items (checkbox/radio + indeterminate), grup + label + separator. Sumber: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| Portal | Ya — `DropdownMenu.Portal` → `document.body`. Sumber: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| Escape / outside | `modal` default `true`; `onEscapeKeyDown`, `onPointerDownOutside`, `onFocusOutside`, `onInteractOutside` dapat dikustom; collision handling (`side/align/sideOffset/avoidCollisions/collisionBoundary/sticky/hideWhenDetached`). Sumber: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| Styling | Unstyled; `data-state`, `data-side`, `data-align`, `data-orientation`, `data-highlighted`, `data-disabled`; CSS vars `--radix-dropdown-menu-content-transform-origin`, `--*-available-width/height`, `--*-trigger-width/height` (origin-aware animation + constrain ukuran). Sumber: [DropdownMenu docs](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±104.8 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-dropdown-menu/latest). |
| Peran di waas-ui | **Menu aksi, overflow menu, menu + submenu, checkable menu items.** |

## 3. ContextMenu — `@radix-ui/react-context-menu` 2.3.7

Docs: [Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu) ·
npm: [@radix-ui/react-context-menu](https://www.npmjs.com/package/@radix-ui/react-context-menu)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Menu WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/menu) + roving tabindex; fitur setara DropdownMenu (submenu, checkable items, grup/label, typeahead, full keyboard nav); dipicu right-click **atau long-press di touch**. Sumber: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| Portal | Ya — ke `document.body`. Sumber: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| Escape / outside | `modal` default `true`; `onEscapeKeyDown`/`onPointerDownOutside`/`onFocusOutside`/`onInteractOutside`; collision handling sama seperti DropdownMenu. Sumber: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| Styling | Unstyled; `data-state/side/align/highlighted/disabled` + CSS vars `--radix-context-menu-content-*` / `--*-trigger-*`. Sumber: [ContextMenu docs](https://www.radix-ui.com/primitives/docs/components/context-menu). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±112.3 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-context-menu/latest). |
| Peran di waas-ui | **Right-click / long-press menu** (mis. row actions di tabel, canvas). Catatan: Trigger membungkus area target (`asChild`), bukan button. |

## 4. Popover — `@radix-ui/react-popover` 1.1.23

Docs: [Popover](https://www.radix-ui.com/primitives/docs/components/popover) ·
npm: [@radix-ui/react-popover](https://www.npmjs.com/package/@radix-ui/react-popover)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Dialog WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal); fokus "fully managed and customizable"; keyboard: Space/Enter buka-tutup, Tab/Shift+Tab, Esc tutup + fokus ke Trigger; mendukung mode modal DAN non-modal. Sumber: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| Portal | Ya — `Popover.Portal` → `document.body` (+ `Anchor` opsional agar Content diposisikan terhadap elemen selain Trigger). Sumber: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| Escape / outside | `modal` default `false` (non-modal; cocok untuk panel yang berdampingan dengan konten interaktif); `onEscapeKeyDown`/`onPointerDownOutside`/`onFocusOutside`/`onInteractOutside`; `onOpenAutoFocus`/`onCloseAutoFocus` dapat dikustom. Sumber: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| Styling | Unstyled; `data-state/side/align` + CSS vars `--radix-popover-content-transform-origin`, `--*-available-width/height`, `--*-trigger-width/height`. Sumber: [Popover docs](https://www.radix-ui.com/primitives/docs/components/popover). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±91.6 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-popover/latest). |
| Peran di waas-ui | **Panel non-modal generik** (filter panel, info card, custom picker shells, combobox custom — lihat Gaps). Beda dari Tooltip: interaktif + persisten sampai dismiss. |

## 5. Tooltip — `@radix-ui/react-tooltip` 1.2.16

Docs: [Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) ·
npm: [@radix-ui/react-tooltip](https://www.npmjs.com/package/@radix-ui/react-tooltip)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Buka saat trigger hover/fokus; tutup saat trigger diaktivasi atau Esc; `Provider` global (`delayDuration` default 700ms, `skipDelayDuration` 300ms); keyboard: Tab buka-tanpa-delay, Space/Enter/Esc tutup-tanpa-delay. **Bukan** focus trap (konten non-interaktif); `aria-label` wiring via Content. Sumber: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| Portal | Ya — `Tooltip.Portal` → `document.body`. Sumber: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| Escape / outside | `onEscapeKeyDown`, `onPointerDownOutside`; `disableHoverableContent` untuk tooltip yang tak boleh di-hover. Sumber: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| Styling | Unstyled; Trigger `data-state="closed\|delayed-open\|instant-open"`; Content `data-state/side/align` + CSS vars `--radix-tooltip-content-*`. Sumber: [Tooltip docs](https://www.radix-ui.com/primitives/docs/components/tooltip). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±135.8 kB unpacked (terbesar kedua setelah Select — mencakup Provider + Popper). Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-tooltip/latest). |
| Peran di waas-ui | **Hint hover/fokus untuk icon-button & truncated text.** Satu `Tooltip.Provider` di root dengan delay sesuai token waas-ui. |

## 6. Select — `@radix-ui/react-select` 2.3.7

Docs: [Select](https://www.radix-ui.com/primitives/docs/components/select) ·
npm: [@radix-ui/react-select](https://www.npmjs.com/package/@radix-ui/react-select)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [ListBox WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/listbox) (+ contoh [Select-Only Combobox W3C](https://www.w3.org/TR/wai-aria-practices/examples/combobox/combobox-select-only.html)); fokus fully managed; full keyboard nav (Space/Enter buka + pilih, ArrowUp/Down gerak, Esc tutup + fokus ke Trigger); typeahead; RTL (`dir`); grup/label untuk labelling; integrasi `Label`; **dua mode posisi**: `item-aligned` (seperti menu macOS — Content sejajar item aktif) dan `popper` (seperti Popover/DropdownMenu). Sumber: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Portal | Ya — `Select.Portal` → `document.body`; Viewport scrollable + ScrollUp/DownButton bawaan (atau komposisikan dengan ScrollArea). Sumber: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Escape / outside | `onEscapeKeyDown`, `onPointerDownOutside`, `onCloseAutoFocus`; hindari styling `Value`/`ItemText` (mengacaukan positioning). Sumber: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Styling | Unstyled; Trigger `data-state/disabled/placeholder`; Item `data-state="checked\|unchecked"` + `data-highlighted/disabled`; CSS vars `--radix-select-*` (hanya saat `position="popper"`). `Icon` default render `▼` — diganti slot ikon waas-ui via `asChild`/children. Sumber: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| Form | Me-render hidden native `<select>` untuk submit form (dapat di-decouple via `unstable_Provider`/`unstable_BubbleInput`). Sumber: [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±343.8 kB unpacked — **terberat dari 12 primitif** (viewport/scroll/typeahead machinery). Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-select/latest). |
| Peran di waas-ui | **Select single-select bawaan.** Untuk multi-select, searchable, atau async: komposisikan Popover + Checkbox/Command (lihat Gaps) — jangan paksakan Select. |

## 7. Checkbox — `@radix-ui/react-checkbox` 1.3.11

Docs: [Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) ·
npm: [@radix-ui/react-checkbox](https://www.npmjs.com/package/@radix-ui/react-checkbox)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [tri-state Checkbox WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox); mendukung `indeterminate`; keyboard: Space check/uncheck. Sumber: [Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox). |
| Portal / focus trap / Esc | Tidak ada (kontrol inline, bukan overlay) — N/A. |
| Styling | Unstyled; Root+Indicator `data-state="checked\|unchecked\|indeterminate"` + `data-disabled`; Indicator me-render saat checked/indeterminate, membungkus ikon konsumen (slot ikon Check/Minus waas-ui). Sumber: [Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox). |
| Form | Me-render hidden `<input>` untuk submit (decouple via `unstable_Provider`/`unstable_Trigger`/`unstable_BubbleInput`). Sumber: [Checkbox docs](https://www.radix-ui.com/primitives/docs/components/checkbox). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±74.4 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-checkbox/latest). |

## 8. Switch — `@radix-ui/react-switch` 1.3.7

Docs: [Switch](https://www.radix-ui.com/primitives/docs/components/switch) ·
npm: [@radix-ui/react-switch](https://www.npmjs.com/package/@radix-ui/react-switch)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Memenuhi [persyaratan peran `switch`](https://www.w3.org/WAI/ARIA/apg/patterns/switch); keyboard: Space DAN Enter toggle. Sumber: [Switch docs](https://www.radix-ui.com/primitives/docs/components/switch). |
| Portal / focus trap / Esc | Tidak ada (kontrol inline) — N/A. |
| Styling | Unstyled; Root+Thumb `data-state="checked\|unchecked"` + `data-disabled`. Sumber: [Switch docs](https://www.radix-ui.com/primitives/docs/components/switch). |
| Form | Hidden `<input>` seperti Checkbox (decouple via `unstable_*`). Sumber: [Switch docs](https://www.radix-ui.com/primitives/docs/components/switch). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±66.8 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-switch/latest). |

## 9. RadioGroup — `@radix-ui/react-radio-group` 1.4.7

Docs: [Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group) ·
npm: [@radix-ui/react-radio-group](https://www.npmjs.com/package/@radix-ui/react-radio-group)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Radio Group WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/radio) + roving tabindex; orientasi horizontal/vertikal; `loop` default `true`; keyboard: Tab ke item checked/pertama, Space check, Arrow keys pindah + check. Sumber: [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| Portal / focus trap / Esc | Tidak ada (kontrol inline) — N/A. |
| Styling | Unstyled; Item+Indicator `data-state="checked\|unchecked"` + `data-disabled`; Root `data-disabled`. Sumber: [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| Form | Tiap Item me-render hidden `<input>` (decouple via `unstable_ItemProvider`/`unstable_ItemTrigger`/`unstable_ItemBubbleInput`). Sumber: [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| SSR | Didukung (`dir` prop untuk RTL). Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering) + [RadioGroup docs](https://www.radix-ui.com/primitives/docs/components/radio-group). |
| Bundle | ±114.5 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-radio-group/latest). |

## 10. Tabs — `@radix-ui/react-tabs` 1.1.21

Docs: [Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) ·
npm: [@radix-ui/react-tabs](https://www.npmjs.com/package/@radix-ui/react-tabs)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Tabs WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/tabs); orientasi horizontal/vertikal; aktivasi `automatic` (default) atau `manual`; keyboard: Tab ke trigger aktif → konten aktif, Arrow keys pindah + aktivasi (atau pindah saja saat manual), Home/End. Sumber: [Tabs docs](https://www.radix-ui.com/primitives/docs/components/tabs). |
| Portal / focus trap / Esc | Tidak ada (navigasi inline) — N/A. |
| Styling | Unstyled; Trigger/Content `data-state="active\|inactive"` + `data-orientation`/`data-disabled`; List `loop` default `true`. Sumber: [Tabs docs](https://www.radix-ui.com/primitives/docs/components/tabs). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±53.0 kB unpacked — salah satu yang paling ringan. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-tabs/latest). |

## 11. Collapsible — `@radix-ui/react-collapsible` 1.1.20

Docs: [Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible) ·
npm: [@radix-ui/react-collapsible](https://www.npmjs.com/package/@radix-ui/react-collapsible)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Disclosure WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure); keyboard: Space/Enter buka-tutup. Sumber: [Collapsible docs](https://www.radix-ui.com/primitives/docs/components/collapsible). |
| Portal / focus trap / Esc | Tidak ada (section inline) — N/A. |
| Styling | Unstyled; Root/Trigger/Content `data-state="open\|closed"` + `data-disabled`; CSS vars `--radix-collapsible-content-width/height` untuk animasi tinggi (pola keyframes `slideDown/slideUp` di docs). Sumber: [Collapsible docs](https://www.radix-ui.com/primitives/docs/components/collapsible). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±45.0 kB unpacked — paling ringan dari 12 primitif. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-collapsible/latest). |
| Peran di waas-ui | **Disclosure/expandable section atomik**; Accordion dibangun di atas pola yang sama. |

## 12. Accordion — `@radix-ui/react-accordion` 1.2.20

Docs: [Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) ·
npm: [@radix-ui/react-accordion](https://www.npmjs.com/package/@radix-ui/react-accordion)

| Dimensi | Temuan |
|---|---|
| a11y bawaan | Pola [Accordion WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/accordion); orientasi vertikal/horizontal; RTL (`dir` default `ltr`); tipe `single` (+ `collapsible` agar semua bisa tertutup) atau `multiple`; keyboard: Space/Enter expand, Tab/Shift+Tab, Arrow keys sesuai orientasi, Home/End. Sumber: [Accordion docs](https://www.radix-ui.com/primitives/docs/components/accordion). |
| Portal / focus trap / Esc | Tidak ada (stacked headings inline) — N/A. |
| Styling | Unstyled; Item/Header/Trigger/Content `data-state="open\|closed"` + `data-disabled/orientation`; CSS vars `--radix-accordion-content-width/height` untuk animasi; pola ikon chevron rotate via `[data-state="open"]`. Sumber: [Accordion docs](https://www.radix-ui.com/primitives/docs/components/accordion). |
| SSR | Didukung. Sumber: [SSR guide](https://www.radix-ui.com/primitives/docs/guides/server-side-rendering). |
| Bundle | ±90.6 kB unpacked. Sumber: [npm metadata](https://registry.npmjs.org/@radix-ui/react-accordion/latest). |

---

## Gaps — kebutuhan waas-ui yang TIDAK ditutup Radix

> Radix sengaja low-level dan tidak menyediakan pola-pola di bawah ini. Rekomendasi
> mengikuti prinsip sesi: headless/unstyled, composable dengan compound components waas-ui,
> consumer-provided icon slots.

| Kebutuhan | Status di Radix | Rekomendasi + sumber |
|---|---|---|
| **Command palette (`cmdk`-style, filterable + keyboard-first)** | Tidak ada primitif command/combobox. Select hanya single-select pola listbox; Popover hanya shell positioning. | **`cmdk` v1.1.1** (±80 kB unpacked) — headless React command menu (dipopulerkan shadcn). Alternatif nol-dep: komposisikan `Popover` + input + list custom. Sumber: [cmdk repo/docs](https://github.com/pacocoursey/cmdk) · [npm cmdk](https://www.npmjs.com/package/cmdk). |
| **DatePicker / Calendar** | Tidak ada. | **`react-day-picker` v10.0.1** — calendar yang di-style via CSS/variables sendiri; bungkus `DayPicker` dalam `Popover` waas-ui (dropdown tanggal) atau `Dialog` (mobile). Sumber: [react-day-picker docs](https://react-day-picker.js.org/) · [npm](https://www.npmjs.com/package/react-day-picker). |
| **Drawer / Sheet gesture (swipe-to-close, drag handle)** | Tidak ada gesture. `Dialog` menutup kebutuhan modal-sheet statis (`modal=true` + CSS translate), tetapi tanpa drag/swipe physics. | **`vaul` v1.1.2** (±180 kB unpacked) — Drawer for React (dipakai shadcn `Drawer`); unstyled, gesture-native. Bila tanpa gesture: gunakan `Dialog` + token translate waas-ui, tanpa dep baru. Sumber: [vaul repo](https://github.com/emilkowalski/vaul) · [npm vaul](https://www.npmjs.com/package/vaul). |
| **Toast — sistem notifikasi imperatif** | **Radix PUNYA `@radix-ui/react-toast` v1.2.23** (±182 kB unpacked): auto-close, pause on hover/focus/blur, swipe-to-dismiss + CSS vars (`--radix-toast-swipe-*`), hotkey ke viewport (`F8` default), `aria-live` via `type="foreground"\|"background"`. Yang TIDAK disediakan: queue/store imperatif (`toast()` API) — waas-ui harus membangunnya sendiri (lihat pola "imperative API" di docs). Alternatif satu-dep: **`sonner` v2.0.8** (opinionated, `toast()` bawaan, dipakai shadcn). Keputusan ditunda ke tiket komponen — dua opsi valid. Sumber: [Toast docs](https://www.radix-ui.com/primitives/docs/components/toast) · [sonner npm](https://www.npmjs.com/package/sonner). |
| **DataTable primitives (sort/filter/paginate/virtualize)** | Tidak ada — di luar misi Radix (mereka hanya punya primitif level-sel seperti Checkbox/Select). | **`@tanstack/react-table` v9.2.4** (±131 kB unpacked) — headless table logic (bukan UI kit), cocok dengan keputusan "DataTable deferred": adopsi saat tiket tabel dibuka, pasangkan sel dengan primitif Radix (Checkbox, DropdownMenu, Select, Popover). Jangan bangun sorting/filtering/pagination sendiri. Sumber: [TanStack Table docs](https://tanstack.com/table/latest) · [npm](https://www.npmjs.com/package/@tanstack/react-table). |
| **Combobox / Autocomplete async (searchable select)** | Tidak ada primitif combobox (Select = select-only). | Komposisikan **`Popover` + input + listbox custom** (atau `cmdk` bila butuh filtering bawaan); untuk async, kendalikan `open` + daftar hasil sendiri. Sumber: pola [Select-Only Combobox W3C](https://www.w3.org/TR/wai-aria-practices/examples/combobox/combobox-select-only.html) dirujuk [Select docs](https://www.radix-ui.com/primitives/docs/components/select). |

## Rekomendasi instalasi (untuk tiket packaging)

```bash
# Pendekatan A — meta-package + tree-shake via subpath (cara resmi tutorial):
npm install radix-ui@latest
```

```jsx
import { Dialog } from "radix-ui";        // atau:
import * as Popover from "radix-ui/popover";
```

```bash
# Pendekatan B — paket per-primitif (kontrol versi per komponen, sesuai tabel §1–§12):
npm install @radix-ui/react-dialog@1.1.23 @radix-ui/react-dropdown-menu@2.1.24 \
  @radix-ui/react-context-menu@2.3.7 @radix-ui/react-popover@1.1.23 \
  @radix-ui/react-tooltip@1.2.16 @radix-ui/react-select@2.3.7 \
  @radix-ui/react-checkbox@1.3.11 @radix-ui/react-switch@1.3.7 \
  @radix-ui/react-radio-group@1.4.7 @radix-ui/react-tabs@1.1.21 \
  @radix-ui/react-collapsible@1.1.20 @radix-ui/react-accordion@1.2.20
# Versi dari https://registry.npmjs.org/@radix-ui/react-<name>/latest (2026-09-19)
```

*Sumber install: [Getting started](https://www.radix-ui.com/primitives/docs/overview/getting-started).*

---

*Sources are primary only: [radix-ui.com/primitives docs](https://www.radix-ui.com/primitives/),
[radix-ui GitHub org](https://github.com/radix-ui/primitives),
[npm registry metadata](https://registry.npmjs.org/), and linked W3C APG patterns.
No production code touched — research file only, per ticket #2.*
