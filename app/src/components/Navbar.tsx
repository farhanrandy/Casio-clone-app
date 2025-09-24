// Tambahkan ini agar bisa menggunakan state dan hooks
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";
import { Orbitron } from "next/font/google";
import Link from "next/link";

// Import Orbitron langsung
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700"], // bisa pilih 500/700
});

export default async function Navbar() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization");
  let isSignedIn = false;
  if (auth?.value) isSignedIn = true;
  return (
    <nav className="flex items-center justify-between w-full h-20 shadow-sm gap-30 bg-white fixed z-50">
      {/* Logo pakai Orbitron inline */}
      <Link
        className={`${orbitron.className} text-2xl font-bold text-blue-900 tracking-wide pl-10`}
        href="/"
      >
        CASIO
      </Link>
      {/* Menu Links */}
      <ul className="hidden md:flex gap-8 text-sm font-medium text-black">
        <li className="hover:text-blue-900 cursor-pointer">
          <Link href="/products">Jam Tangan</Link>
        </li>
        <li className="hover:text-blue-900 cursor-pointer">
          Alat Musik Elektronik
        </li>
        <li className="hover:text-blue-900 cursor-pointer">Kalkulator</li>
        <li className="hover:text-blue-900 cursor-pointer">
          Printer Label & Lainnya
        </li>
      </ul>
      {isSignedIn ? (
        <div className="flex items-center gap-4 pr-10">
          <Link href="/wishlist">
            <button className="px-4 py-2 bg-white text-black rounded text-2xl">
              🖤
            </button>
          </Link>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex items-center gap-4 pr-10">
          <Link href="/wishlist">
            <button className="px-4 py-2 bg-white text-black rounded text-2xl">
              🖤
            </button>
          </Link>
          <Link href="/login">
            <button className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
