import { create } from "zustand";
import { persist } from "zustand/middleware";

const userStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: localStorage, // ✅ Use `storage` instead of `getStorage`
    }
  )
);

export default userStore;
