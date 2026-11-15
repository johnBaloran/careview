"use client";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";

const DRAWER_WIDTH = 232;

const NAV_ITEMS = [
  { href: "/patients", label: "Patients", icon: <PeopleAltOutlinedIcon /> },
] as const;

type NavListProps = { pathname: string | null; onNavigate?: () => void };

function NavList({ pathname, onNavigate }: NavListProps) {
  return (
    <Box component="nav" aria-label="Main navigation">
      <List>
        {NAV_ITEMS.map((item) => {
          const active =
            pathname !== null &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`));
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={active}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                sx={{ mx: 1, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

function CurrentNavList({ onNavigate }: { onNavigate?: () => void }) {
  return <NavList pathname={usePathname()} onNavigate={onNavigate} />;
}

// The pathname is request-time data on dynamic routes (e.g. /patients/[patientId]), so only the
// nav reads it, inside Suspense. The fallback is the same nav without the active highlight, so the
// shell still prerenders instantly.
function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<NavList pathname={null} onNavigate={onNavigate} />}>
      <CurrentNavList onNavigate={onNavigate} />
    </Suspense>
  );
}

// Responsive shell: permanent side navigation from the `md` breakpoint up; below it, a menu
// button opens the same navigation in a temporary drawer. Visibility is handled with CSS
// breakpoints (MUI's responsive-drawer pattern), so there's no layout flash on load.
export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: 8,
          top: -48,
          zIndex: (theme) => theme.zIndex.tooltip,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: "background.paper",
          color: "primary.main",
          fontWeight: 600,
          "&:focus": { top: 8 },
        }}
      >
        Skip to main content
      </Box>

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            CareView
          </Typography>
          <Chip
            label="Synthetic data"
            size="small"
            variant="outlined"
            sx={{ ml: "auto" }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
          }}
        >
          <Toolbar />
          <Navigation onNavigate={closeMobile} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Navigation />
        </Drawer>
      </Box>

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 3 }, outline: "none" }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
