"use client";
import { handleLogout } from "@/action";

// Pastikan ini ada di paling atas

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        handleLogout();
      }}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
