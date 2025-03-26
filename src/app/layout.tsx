import "~/styles/globals.css";

import { Navbar, NavbarDivider, NavbarItem, NavbarSection, NavbarSpacer } from '~/components/catalyst/navbar';
import { Sidebar, SidebarBody, SidebarItem, SidebarSection } from '~/components/catalyst/sidebar';
import { StackedLayout } from '~/components/catalyst/stacked-layout';
import { ArrowRightStartOnRectangleIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/20/solid';

import { auth } from "~/server/auth";
import SessionProvider from "~/components/session-provider"
import { Dropdown, DropdownButton, DropdownDivider, DropdownHeader, DropdownItem, DropdownLabel, DropdownMenu } from "~/components/catalyst/dropdown";
import { Avatar } from "~/components/catalyst/avatar";

const navItems = [
  { label: 'Home', url: '/' },
]

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  console.log(session)

  return (
    <SessionProvider session={session}>
      <html lang="en" className="dark:[color-scheme:dark]">
        <body className={`antialiased`}>
          <StackedLayout
            navbar={
              <Navbar>
                <p>NextFolio</p>
                <NavbarDivider className="max-lg:hidden" />
                <NavbarSection className="max-lg:hidden">
                  {navItems.map(({ label, url }) => (
                    <NavbarItem key={label} href={url}>
                      {label}
                    </NavbarItem>
                  ))}
                </NavbarSection>
                <NavbarSpacer />
                <NavbarSection>
                  <NavbarItem href="/search" aria-label="Search">
                    <MagnifyingGlassIcon />
                  </NavbarItem>
                  {session !== null && (
                    <Dropdown>
                      <DropdownButton as={NavbarItem}>
                        <Avatar src={session.user.image} square />
                      </DropdownButton>
                      <DropdownMenu className="min-w-64" anchor="bottom end">
                        <DropdownHeader>
                          <div className="pr-6">
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as {session.user.name}</div>
                            <div className="text-sm/7 font-semibold text-zinc-800 dark:text-white">{session.user.email}</div>
                          </div>
                        </DropdownHeader>
                        <DropdownDivider />
                        <DropdownItem href="/admin">
                          <UserIcon />
                          <DropdownLabel>Admin</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem href="/api/auth/signout">
                          <ArrowRightStartOnRectangleIcon />
                          <DropdownLabel>Sign out</DropdownLabel>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </NavbarSection>
              </Navbar>
            }
            sidebar={
              <Sidebar>
                <SidebarBody>
                  <SidebarSection>
                    {navItems.map(({ label, url }) => (
                      <SidebarItem key={label} href={url}>
                        {label}
                      </SidebarItem>
                    ))}
                  </SidebarSection>
                </SidebarBody>
              </Sidebar>
            }
          >
            {children}
          </StackedLayout>
        </body>
      </html>
    </SessionProvider>
  )
}