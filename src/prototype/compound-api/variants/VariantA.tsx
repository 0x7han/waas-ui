// PROTOTYPE variant A — compound components (the recommended direction).
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { ROLES, USERS, type User } from "../shared";

/* ---------- stub Button (stands in for the future library Button) ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "destructive";
};

function Btn({ variant = "primary", className, ...rest }: BtnProps) {
  const extra = className ? ` ${className}` : "";
  return <button type="button" className={`proto-btn proto-btn-${variant}${extra}`} {...rest} />;
}

/* ---------- members state (would be an internal hook in the real library) ---------- */
const PAGE_SIZE = 4;

type MembersApi = {
  query: string;
  setQuery: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  page: number;
  setPage: (v: number) => void;
  totalPages: number;
  total: number;
  pageItems: User[];
  selected: number[];
  toggle: (id: number) => void;
  togglePage: (ids: number[]) => void;
  clearSelection: () => void;
  dialogOpen: boolean;
  setDialogOpen: (v: boolean) => void;
  notice: string | null;
  notify: (msg: string) => void;
  dismissNotice: () => void;
};

const MembersContext = createContext<MembersApi | null>(null);

function useMembers(): MembersApi {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error("Members.* must be used inside <Members.Root>");
  return ctx;
}

function MembersRoot({ children }: { children: ReactNode }) {
  const [query, setQueryState] = useState("");
  const [role, setRoleState] = useState("All");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const togglePage = (ids: number[]) =>
    setSelected((s) =>
      ids.every((id) => s.includes(id))
        ? s.filter((x) => !ids.includes(x))
        : Array.from(new Set([...s, ...ids])),
    );
  const clearSelection = () => setSelected([]);
  const notify = (msg: string) => setNotice(msg);
  const dismissNotice = () => setNotice(null);

  const api: MembersApi = {
    query,
    setQuery,
    role,
    setRole,
    page: safePage,
    setPage,
    totalPages,
    total: filtered.length,
    pageItems,
    selected,
    toggle,
    togglePage,
    clearSelection,
    dialogOpen,
    setDialogOpen,
    notice,
    notify,
    dismissNotice,
  };

  return <MembersContext.Provider value={api}>{children}</MembersContext.Provider>;
}

function MembersNotice() {
  const { notice, dismissNotice } = useMembers();
  if (!notice) return null;
  return (
    <div className="proto-notice" role="status">
      {notice}
      <button type="button" onClick={dismissNotice} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}

function MembersHeader() {
  const { setDialogOpen, notify } = useMembers();
  return (
    <div className="proto-head">
      <div>
        <span className="proto-variant-tag">A — Compound components</span>
        <h1 className="proto-title">Team members</h1>
        <p className="proto-sub">Invite, filter and manage seats.</p>
      </div>
      <div className="proto-actions">
        <Btn variant="outline" onClick={() => notify("Export started (stub).")}>
          Export
        </Btn>
        <Btn onClick={() => setDialogOpen(true)}>Invite member</Btn>
      </div>
    </div>
  );
}
function MembersToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="proto-card">
      <div className="proto-toolbar">{children}</div>
    </div>
  );
}
const STATUS_CLASS: Record<User["status"], string> = {
  active: "proto-pill-active",
  invited: "proto-pill-invited",
  suspended: "proto-pill-suspended",
};

function MembersSearch() {
  const { query, setQuery } = useMembers();
  return (
    <input
      className="proto-input"
      placeholder="Search name or email…"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Search members"
    />
  );
}

function MembersRoleFilter() {
  const { role, setRole } = useMembers();
  return (
    <select
      className="proto-select"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      aria-label="Filter by role"
    >
      <option value="All">All roles</option>
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}

function MembersCount() {
  const { total } = useMembers();
  return (
    <span className="proto-count">
      {total} member{total === 1 ? "" : "s"}
    </span>
  );
}

function MembersBulkBar() {
  const { selected, clearSelection, notify } = useMembers();
  if (selected.length === 0) return null;
  return (
    <div className="proto-bulkbar">
      {selected.length} selected
      <span className="proto-spacer" />
      <Btn
        variant="destructive"
        onClick={() => {
          notify(`${selected.length} member(s) deactivated (stub).`);
          clearSelection();
        }}
      >
        Deactivate
      </Btn>
      <Btn variant="ghost" onClick={clearSelection}>
        Clear
      </Btn>
    </div>
  );
}


function MembersTable() {
  const { pageItems, selected, toggle, togglePage, notify } = useMembers();
  const pageIds = pageItems.map((u) => u.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  return (
    <table className="proto-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={allChecked}
              onChange={() => togglePage(pageIds)}
              aria-label="Select all on page"
            />
          </th>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>
            <span className="proto-row-actions">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {pageItems.map((u) => (
          <tr key={u.id}>
            <td>
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggle(u.id)}
                aria-label={`Select ${u.name}`}
              />
            </td>
            <td>
              <div className="proto-name">{u.name}</div>
              <div className="proto-email">{u.email}</div>
            </td>
            <td>
              <span className="proto-role">{u.role}</span>
            </td>
            <td>
              <span className={`proto-pill ${STATUS_CLASS[u.status]}`}>{u.status}</span>
            </td>
            <td className="proto-row-actions">
              <Btn variant="ghost" onClick={() => notify(`Editing ${u.name} (stub).`)}>
                Edit
              </Btn>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MembersPagination() {
  const { page, setPage, totalPages, total } = useMembers();
  return (
    <div className="proto-footer">
      <span className="proto-pageinfo">
        Page {page + 1} of {totalPages} · {total} total
      </span>
      <span className="proto-spacer" />
      <Btn variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
        Prev
      </Btn>
      <Btn variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
        Next
      </Btn>
    </div>
  );
}

const Members = {
  Root: MembersRoot,
  Notice: MembersNotice,
  Header: MembersHeader,
  Toolbar: MembersToolbar,
  Search: MembersSearch,
  RoleFilter: MembersRoleFilter,
  Count: MembersCount,
  BulkBar: MembersBulkBar,
  Table: MembersTable,
  Pagination: MembersPagination,
};

/* ---------- Field compound (label + control + hint + error) ---------- */
function FieldRoot({ children }: { children: ReactNode }) {
  return <div className="proto-field">{children}</div>;
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return <label htmlFor={htmlFor}>{children}</label>;
}

function FieldHint({ children }: { children: ReactNode }) {
  return <p className="proto-hint">{children}</p>;
}

function FieldError({ children }: { children: ReactNode }) {
  return (
    <p className="proto-error" role="alert">
      {children}
    </p>
  );
}

const Field = { Root: FieldRoot, Label: FieldLabel, Hint: FieldHint, Error: FieldError };

/* ---------- Dialog compound (Radix-like Root/Title/Description) ---------- */
function DialogRoot({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="proto-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="proto-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="proto-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="proto-dialog-title" id="proto-dialog-title">
      {children}
    </h2>
  );
}

function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="proto-dialog-desc">{children}</p>;
}

const Dialog = { Root: DialogRoot, Title: DialogTitle, Description: DialogDescription };

/* ---------- invite form inside the dialog ---------- */
function InviteForm() {
  const { setDialogOpen, notify } = useMembers();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    notify(`Invite sent to ${email.trim()}.`);
    setDialogOpen(false);
  };

  return (
    <>
      <Field.Root>
        <Field.Label htmlFor="proto-a-name">Name</Field.Label>
        <input
          id="proto-a-name"
          className="proto-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
        />
      </Field.Root>
      <Field.Root>
        <Field.Label htmlFor="proto-a-email">Email</Field.Label>
        <input
          id="proto-a-email"
          className="proto-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada@acme.id"
        />
        <Field.Hint>They will receive an email with a signup link.</Field.Hint>
        {error && <Field.Error>{error}</Field.Error>}
      </Field.Root>
      <Field.Root>
        <Field.Label htmlFor="proto-a-role">Role</Field.Label>
        <select
          id="proto-a-role"
          className="proto-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field.Root>
      <div className="proto-dialog-actions">
        <Btn variant="ghost" onClick={() => setDialogOpen(false)}>
          Cancel
        </Btn>
        <Btn onClick={submit}>Send invite</Btn>
      </div>
    </>
  );
}

function InviteDialog() {
  const { dialogOpen, setDialogOpen } = useMembers();
  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Title>Invite member</Dialog.Title>
      <Dialog.Description>Add someone to the Acme workspace.</Dialog.Description>
      <InviteForm />
    </Dialog.Root>
  );
}

/* ---------- assembled variant ---------- */
export function VariantA() {
  return (
    <div className="proto-wrap">
      <Members.Root>
        <Members.Notice />
        <Members.Header />
        <Members.Toolbar>
          <Members.Search />
          <Members.RoleFilter />
          <Members.Count />
        </Members.Toolbar>
        <Members.BulkBar />
        <div className="proto-card">
          <Members.Table />
          <Members.Pagination />
        </div>
        <InviteDialog />
      </Members.Root>
    </div>
  );
}
