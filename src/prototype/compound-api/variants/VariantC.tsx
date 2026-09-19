// PROTOTYPE variant C — render props / slots (maximum flexibility, noisiest DX).
import { useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ROLES, USERS, type User } from "../shared";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "destructive";
};

function Btn({ variant = "primary", className, ...rest }: BtnProps) {
  const extra = className ? ` ${className}` : "";
  return <button type="button" className={`proto-btn proto-btn-${variant}${extra}`} {...rest} />;
}

export type TeamApi = {
  query: string;
  setQuery: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  items: User[];
  total: number;
  page: number;
  totalPages: number;
  setPage: (v: number) => void;
  selected: number[];
  toggle: (id: number) => void;
  openInvite: () => void;
  notify: (msg: string) => void;
};

type TeamShellProps = {
  renderSidebar: (api: TeamApi) => ReactNode;
  renderToolbar: (api: TeamApi) => ReactNode;
  renderRow: (user: User, api: TeamApi) => ReactNode;
  renderEmpty: (api: TeamApi) => ReactNode;
};

const PAGE_SIZE = 4;

function TeamShell({ renderSidebar, renderToolbar, renderRow, renderEmpty }: TeamShellProps) {
  const [query, setQueryState] = useState("");
  const [role, setRoleState] = useState("All");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const setQuery = (v: string) => {
    setQueryState(v);
    setPage(0);
  };
  const setRole = (v: string) => {
    setRoleState(v);
    setPage(0);
  };

  const filtered = useMemo(
    () =>
      USERS.filter(
        (u) =>
          (role === "All" || u.role === role) &&
          (query === "" || `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, role],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const items = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const api: TeamApi = {
    query,
    setQuery,
    role,
    setRole,
    items,
    total: filtered.length,
    page: safePage,
    totalPages,
    setPage,
    selected,
    toggle: (id: number) =>
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    openInvite: () => setDialogOpen(true),
    notify: (msg: string) => setNotice(msg),
  };

  return (
    <>
      <div className="proto-head">
        <div>
          <span className="proto-variant-tag">C — Render props / slots</span>
          <h1 className="proto-title">Team members</h1>
          <p className="proto-sub">Fully custom slots, owned state.</p>
        </div>
        <div className="proto-actions">
          <Btn onClick={() => setDialogOpen(true)}>Invite member</Btn>
        </div>
      </div>
      {notice && (
        <div className="proto-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}
      <div className="proto-layout-c">
        <aside className="proto-side">{renderSidebar(api)}</aside>
        <div>
          {renderToolbar(api)}
          <div className="proto-card">
            {items.length === 0 ? (
              <div className="proto-empty">{renderEmpty(api)}</div>
            ) : (
              <table className="proto-table">
                <tbody>{items.map((u) => renderRow(u, api))}</tbody>
              </table>
            )}
            <div className="proto-footer">
              <span className="proto-pageinfo">
                Page {safePage + 1} of {totalPages} · {filtered.length} total
              </span>
              <span className="proto-spacer" />
              <Btn variant="outline" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
                Prev
              </Btn>
              <Btn
                variant="outline"
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage(safePage + 1)}
              >
                Next
              </Btn>
            </div>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <div className="proto-overlay" onClick={() => setDialogOpen(false)}>
          <div
            className="proto-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="proto-dialog-title">Invite member</h2>
            <p className="proto-dialog-desc">Add someone to the Acme workspace.</p>
            <div className="proto-field">
              <label htmlFor="proto-c-email">Email</label>
              <input
                id="proto-c-email"
                className="proto-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@acme.id"
              />
              {formError && (
                <p className="proto-error" role="alert">
                  {formError}
                </p>
              )}
            </div>
            <div className="proto-dialog-actions">
              <Btn variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Btn>
              <Btn
                onClick={() => {
                  if (!email.includes("@")) {
                    setFormError("Enter a valid email address.");
                    return;
                  }
                  setNotice(`Invite sent to ${email.trim()}.`);
                  setEmail("");
                  setFormError(null);
                  setDialogOpen(false);
                }}
              >
                Send invite
              </Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function VariantC() {
  return (
    <div className="proto-wrap">
      <TeamShell
        renderSidebar={(api) => (
          <>
            <h3>Role</h3>
            {["All", ...ROLES].map((r) => (
              <label key={r} className="proto-check">
                <input
                  type="radio"
                  name="proto-c-role"
                  checked={api.role === r}
                  onChange={() => api.setRole(r)}
                />
                {r}
              </label>
            ))}
            <h3 style={{ marginTop: 12 }}>Selection</h3>
            <p className="proto-pageinfo">{api.selected.length} selected</p>
          </>
        )}
        renderToolbar={(api) => (
          <div className="proto-custombar">
            <input
              className="proto-input"
              placeholder="Search the team…"
              value={api.query}
              onChange={(e) => api.setQuery(e.target.value)}
              aria-label="Search members"
              style={{ flex: 1 }}
            />
            <Btn variant="ghost" onClick={() => api.notify("Export started (stub).")}>
              Export
            </Btn>
          </div>
        )}
        renderRow={(u, api) => (
          <tr key={u.id}>
            <td>
              <span className="proto-avatar" aria-hidden="true">
                {initials(u.name)}
              </span>
              <span className="proto-name">{u.name}</span>
              <div className="proto-email">{u.email}</div>
            </td>
            <td className="proto-row-actions">
              <input
                type="checkbox"
                checked={api.selected.includes(u.id)}
                onChange={() => api.toggle(u.id)}
                aria-label={`Select ${u.name}`}
              />{" "}
              <Btn variant="ghost" onClick={() => api.notify(`Editing ${u.name} (stub).`)}>
                Edit
              </Btn>
            </td>
          </tr>
        )}
        renderEmpty={(api) => (
          <>
            No members match “{api.query}”.{" "}
            <Btn
              variant="ghost"
              onClick={() => {
                api.setQuery("");
                api.setRole("All");
              }}
            >
              Clear filters
            </Btn>
          </>
        )}
      />
    </div>
  );
}
