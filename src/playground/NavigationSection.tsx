import { useState } from "react";
import { Breadcrumb, Navbar, Pagination, Sidebar, Tabs } from "../components/navigation";
import { Button } from "../components/button";
import { Demo, Section, StarIcon } from "./Section";

export function NavigationSection() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Section id="navigation" title="Navigation" blurb="Flagship Sidebar with presets, plus Navbar, Breadcrumb, Tabs, Pagination.">
      <Demo title="Sidebar">
        <div className="pg-row">
          <Button variant="outline" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? "Expand" : "Collapse"}
          </Button>
        </div>
        <Sidebar.Root collapsed={collapsed} onCollapsedChange={setCollapsed} aria-label="Demo">
          <Sidebar.Header>Acme</Sidebar.Header>
          <Sidebar.Workspace name="Acme Inc" />
          <Sidebar.Group label="Main">
            <Sidebar.Item icon={<StarIcon />} active>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item icon={<StarIcon />} badge="3">
              Customers
            </Sidebar.Item>
            <Sidebar.Item icon={<StarIcon />}>Billing</Sidebar.Item>
          </Sidebar.Group>
          <Sidebar.Footer>
            <Sidebar.User name="Ada" />
          </Sidebar.Footer>
        </Sidebar.Root>
      </Demo>
      <Demo title="Navbar + Breadcrumb">
        <Navbar.Root>
          <Navbar.Brand>Acme</Navbar.Brand>
          <Navbar.Nav>
            <Navbar.Link href="#navigation">Overview</Navbar.Link>
            <Navbar.Link href="#navigation">Projects</Navbar.Link>
          </Navbar.Nav>
          <Navbar.Actions>
            <Button variant="outline">Docs</Button>
          </Navbar.Actions>
        </Navbar.Root>
        <Breadcrumb.Root aria-label="Breadcrumb">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#navigation">Home</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator>/</Breadcrumb.Separator>
            <Breadcrumb.Item>
              <Breadcrumb.Current>Billing</Breadcrumb.Current>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Demo>
      <Demo title="Tabs + Pagination">
        <Tabs.Root defaultValue="overview">
          <Tabs.List aria-label="Demo tabs">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">Overview content.</Tabs.Content>
          <Tabs.Content value="activity">Activity content.</Tabs.Content>
        </Tabs.Root>
        <Pagination.Root pageCount={8} defaultPage={3} aria-label="Demo pagination">
          <Pagination.Prev />
          <Pagination.Pages />
          <Pagination.Next />
        </Pagination.Root>
      </Demo>
    </Section>
  );
}
