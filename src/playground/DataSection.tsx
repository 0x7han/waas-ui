import { Avatar, Badge, Card, EmptyState, Separator, Skeleton, StatCard, Table } from "../components/data";
import { Button } from "../components/button";
import { Demo, Section, StarIcon } from "./Section";

const ROWS = [
  { name: "Sinta Prabowo", email: "sinta@acme.id", role: "Admin", status: "active" },
  { name: "Bagas Nugroho", email: "bagas@acme.id", role: "Billing", status: "active" },
  { name: "Maya Chen", email: "maya@acme.id", role: "Support", status: "invited" },
] as const;

export function DataSection() {
  return (
    <Section id="data" title="Data display" blurb="Presentational Table with toolbar composition, EmptyState, StatCard, and display primitives.">
      <Demo title="Stat cards">
        <div className="pg-grid-2">
          <StatCard.Root>
            <StatCard.Label>Revenue</StatCard.Label>
            <StatCard.Value>$24,560</StatCard.Value>
            <StatCard.Delta trend="up">+12.5%</StatCard.Delta>
            <StatCard.Hint>vs last month</StatCard.Hint>
          </StatCard.Root>
          <StatCard.Root>
            <StatCard.Label>Churn</StatCard.Label>
            <StatCard.Value>1.8%</StatCard.Value>
            <StatCard.Delta trend="down">-0.4%</StatCard.Delta>
            <StatCard.Hint>vs last quarter</StatCard.Hint>
          </StatCard.Root>
        </div>
      </Demo>
      <Demo title="Table">
        <Table.Root mobileStrategy="scroll">
          <Table.Toolbar>
            <Table.Search placeholder="Search members…" aria-label="Search members" />
            <Table.Filters aria-label="Role filters">
              <Button variant="outline">All roles</Button>
            </Table.Filters>
            <Table.Pagination aria-label="Table pages" />
          </Table.Toolbar>
          <Table scrollLabel="Team members">
            <Table.Caption>Team members and their roles.</Table.Caption>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {ROWS.map((row) => (
                <Table.Row key={row.email}>
                  <Table.Cell>{row.name}</Table.Cell>
                  <Table.Cell>{row.role}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={row.status === "active" ? "success" : "warning"}>{row.status}</Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Table.Root>
      </Demo>
      <Demo title="Card + EmptyState + primitives">
        <Card.Root>
          <Card.Header>
            <Card.Title>Team inbox</Card.Title>
            <Card.Description>Empty states keep blank screens intentional.</Card.Description>
          </Card.Header>
          <Card.Content>
            <EmptyState.Root>
              <EmptyState.Title>No customers yet</EmptyState.Title>
              <EmptyState.Description>Invite your first customer to get started.</EmptyState.Description>
              <EmptyState.Actions>
                <Button>Invite customer</Button>
              </EmptyState.Actions>
            </EmptyState.Root>
          </Card.Content>
          <Card.Footer>
            <Button variant="ghost">View archive</Button>
          </Card.Footer>
        </Card.Root>
        <div className="pg-row">
          <Avatar.Root aria-label="Ada Lovelace">
            <Avatar.Image src="/favicon.svg" alt="Ada Lovelace" />
            <Avatar.Fallback>AD</Avatar.Fallback>
          </Avatar.Root>
          <Badge variant="info">
            <StarIcon /> New
          </Badge>
          <Skeleton aria-label="Loading card" />
        </div>
        <Separator orientation="horizontal" aria-label="Section divider" />
      </Demo>
    </Section>
  );
}
