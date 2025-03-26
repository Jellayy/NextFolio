import "~/styles/globals.css";

import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from '~/components/catalyst/navbar'
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '~/components/catalyst/sidebar'
import { StackedLayout } from '~/components/catalyst/stacked-layout'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const navItems = [
  { label: 'Home', url: '/' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}