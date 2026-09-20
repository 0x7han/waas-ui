import { Alert, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Popover, PopoverContent, PopoverTrigger, Progress, ToastProvider, toast } from "../components/overlay";
import { Button } from "../components/button";
import { Demo, Section } from "./Section";

export function OverlaySection() {
  return (
    <Section id="overlay" title="Overlay + Feedback" blurb="Dialog, Drawer, Dropdown, Popover, Command palette, Alert, Toast, Progress.">
      <Demo title="Dialog + Drawer + Popover">
        <div className="pg-row">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Invite member</DialogTitle>
              <DialogDescription>Add someone to the Acme workspace.</DialogDescription>
              <div className="pg-row">
                <Button>Send invite</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>Settings</DrawerTitle>
              <DrawerDescription>Workspace preferences live here.</DrawerDescription>
            </DrawerContent>
          </Drawer>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <p>Filter panel content.</p>
            </PopoverContent>
          </Popover>
          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="outline">Open menu</Button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem onSelect={() => toast({ title: "Profile opened" })}>Profile</DropdownItem>
              <DropdownItem onSelect={() => toast({ title: "Billing opened" })}>Billing</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </Demo>
      <Demo title="Alert + Progress + Toast">
        <Alert variant="warning">Your subscription will expire in 3 days.</Alert>
        <Progress value={65} label="Migration progress" />
        <Progress label="Loading indefinitely" />
        <div className="pg-row">
          <Button
            variant="outline"
            onClick={() => toast({ title: "Profile updated", variant: "success" })}
          >
            Toast success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Something went wrong", variant: "danger" })}
          >
            Toast error
          </Button>
        </div>
      </Demo>
      <Demo title="Command palette">
        <Command label="Demo commands">
          <CommandInput placeholder="Search commands…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => toast({ title: "Project created" })}>Create project</CommandItem>
              <CommandItem onSelect={() => toast({ title: "Invite sent" })}>Invite member</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Demo>
      <ToastProvider />
    </Section>
  );
}
