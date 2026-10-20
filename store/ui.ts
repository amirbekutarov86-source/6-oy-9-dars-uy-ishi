"use client";

import { create } from "zustand";

type DrawerTab = "cart" | "add";

type UiState = {
  drawerOpen: boolean;
  drawerTab: DrawerTab;
  openDrawer: (tab?: DrawerTab) => void;
  closeDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: DrawerTab) => void;
};

export const useUi = create<UiState>((set) => ({
  drawerOpen: false,
  drawerTab: "cart",
  openDrawer: (tab = "cart") => set({ drawerOpen: true, drawerTab: tab }),
  closeDrawer: () => set({ drawerOpen: false }),
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  setDrawerTab: (drawerTab) => set({ drawerTab }),
}));
