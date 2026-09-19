// PROTOTYPE variant B — flat boolean-rich props (the monolith counter-proposal).
import { useMemo, useState, type ButtonHTMLAttributes } from "react";
import { ROLES, USERS, type User } from "../shared";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "destructive";
};

function Btn({ variant = "primary", className, ...rest }: BtnProps) {
  const extra = className ? ` ${className}` : "";
  return <button type="button" className={`proto-btn proto-btn-${variant}${extra}`} {...rest} />;
}
const STATUS_CLASS: Record<User["status"], string> = {
  active: "proto-pill-active",
  invited: "proto-pill-invited",
  suspended: "proto-pill-suspended",
};

type TeamTableProps = {
  users?: User[];
  pageSize?: number;
  enableSearch?: boolean;
  showRoleFilter?: boolean;
  showRoleColumn?: boolean;
  showStatusColumn?: boolean;
  enableSelection?: boolean;
  enableBulkActions?: boolean;
  enablePagination?: boolean;
  enableInvite?: boolean;
  enableExport?: boolean;
  enableRowActions?: boolean;
  emptyText?: string;
  onInvite?: (email: string) => void;
};


function TeamTable({
  users = USERS,
  pageSize = 4,
  enableSearch = false,
  showRoleFilter = false,
  showRoleColumn = true,
  showStatusColumn = true,
  enableSelection = false,
  enableBulkActions = false,
  enablePagination = false,
  enableInvite = false,
  enableExport = false,
  enableRowActions = false,
  emptyText = "No members found.",
  onInvite,
}: TeamTableProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (role === "All" || u.role === role) &&
          (query === "" || `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [users, query, role],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const items = enablePagination
    ? filtered.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : filtered;
  const ids = items.map((u) => u.id);
  const allChecked = ids.length > 0 && ids.every((id) => selected.includes(id));

  const showToolbar = enableSearch || showRoleFilter;
  const showBulk = enableSelection && enableBulkActions && selected.length > 0;

  const submitInvite = () => {
    if (!email.includes("@")) {
      setFormError("Enter a valid email address.");
      return;
    }
    setNotice(`Invite sent to ${email.trim()}.`);
    if (onInvite) onInvite(email.trim());
    setEmail("");
    setFormError(null);
    setDialogOpen(false);
  };

  return (
    <>
      {notice && (
        <div className="proto-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}
      <div className="proto-card">
        <div className="proto-toolbar">
          <div>
            <h1 className="proto-title">Team members</h1>
            <p className="proto-sub">
              {filtered.length} member{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
          <span className="proto-count" />
          {enableExport && (
            <Btn variant="outline" onClick={() => setNotice("Export started (stub).")}>
              Export
            </Btn>
          )}
          {enableInvite && <Btn onClick={() => setDialogOpen(true)}>Invite member</Btn>}
        </div>
        {showToolbar && (
          <div className="proto-toolbar">
            {enableSearch && (
              <input
                className="proto-input"
                placeholder="Search name or email…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                aria-label="Search members"
              />
            )}
            {showRoleFilter && (
              <select
                className="proto-select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPage(0);
                }}
                aria-label="Filter by role"
              >
                <option value="All">All roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        {showBulk && (
          <div className="proto-toolbar">
            <div className="proto-bulkbar" style={{ marginBottom: 0, flex: 1 }}>
              {selected.length} selected
              <span className="proto-spacer" />
              <Btn
                variant="destructive"
                onClick={() => {
                  setNotice(`${selected.length} member(s) deactivated (stub).`);
                  setSelected([]);
                }}
              >
                Deactivate
              </Btn>
              <Btn variant="ghost" onClick={() => setSelected([])}>
                Clear
              </Btn>
            </div>
          </div>
        )}
        {items.length === 0 ? (
          <div className="proto-empty">{emptyText}</div>
        ) : (
          <table className="proto-table">
            <thead>
              <tr>
                {enableSelection && (
                  <th>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() =>
                        setSelected((s) =>
                          allChecked ? s.filter((x) => !ids.includes(x)) : Array.from(new Set([...s, ...ids])),
                        )
                      }
                      aria-label="Select all on page"
                    />
                  </th>
                )}
                <th>Name</th>
                {showRoleColumn && <th>Role</th>}
                {showStatusColumn && <th>Status</th>}
                {enableRowActions && (
                  <th>
                    <span className="proto-row-actions">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id}>
                  {enableSelection && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(u.id)}
                        onChange={() =>
                          setSelected((s) =>
                            s.includes(u.id) ? s.filter((x) => x !== u.id) : [...s, u.id],
                          )
                        }
                        aria-label={`Select ${u.name}`}
                      />
                    </td>
                  )}
                  <td>
                    <div className="proto-name">{u.name}</div>
                    <div className="proto-email">{u.email}</div>
                  </td>
                  {showRoleColumn && (
                    <td>
                      <span className="proto-role">{u.role}</span>
                    </td>
                  )}
                  {showStatusColumn && (
                    <td>
                      <span className={`proto-pill ${STATUS_CLASS[u.status]}`}>{u.status}</span>
                    </td>
                  )}
                  {enableRowActions && (
                    <td className="proto-row-actions">
                      <Btn variant="ghost" onClick={() => setNotice(`Editing ${u.name} (stub).`)}>
                        Edit
                      </Btn>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {enablePagination && (
          <div className="proto-footer">
            <span className="proto-pageinfo">
              Page {safePage + 1} of {totalPages}
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
        )}
      </div>
      {enableInvite && dialogOpen && (
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
              <label htmlFor="proto-b-email">Email</label>
              <input
                id="proto-b-email"
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
              <Btn onClick={submitInvite}>Send invite</Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function VariantB() {
  return (
    <div className="proto-wrap">
      <span className="proto-variant-tag">B — Flat boolean props</span>
      <div className="proto-flags">
        &lt;TeamTable enableSearch showRoleFilter enableSelection enableBulkActions enablePagination
        enableInvite enableExport enableRowActions /&gt;
      </div>
      <TeamTable
        enableSearch
        showRoleFilter
        enableSelection
        enableBulkActions
        enablePagination
        enableInvite
        enableExport
        enableRowActions
      />
    </div>
  );
}
