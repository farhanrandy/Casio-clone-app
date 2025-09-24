"use client"; // Ini membuat komponen ini berjalan di browser (client-side)

import React, { useState } from "react"; // Import React dan useState untuk mengelola state
import Link from "next/link"; // Import Link untuk navigasi ke halaman login

// Komponen utama untuk halaman register
export default function RegisterPage() {
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // State untuk loading dan pesan
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fungsi untuk menangani perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData, // Salin data lama
      [e.target.name]: e.target.value, // Update field yang berubah
    });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah reload halaman
    setLoading(true); // Set loading true
    setMessage(""); // Reset pesan

    try {
      // Kirim data ke server
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Kirim data form sebagai JSON
      });

      if (res.ok) {
        setMessage("Registrasi berhasil!"); // Pesan sukses
        // Bisa tambah redirect ke halaman login
      } else {
        const error = await res.json();
        setMessage(error.message || "Registrasi gagal"); // Pesan error
      }
    } catch (error) {
      setMessage("Terjadi kesalahan"); // Pesan error umum
    } finally {
      setLoading(false); // Set loading false
    }
  };

  // Render form
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://cdn.tourradar.com/s3/content-pages/120/2880x1800/Ghuqlj.jpg')] bg-cover bg-center">
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Input Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700" // Label abu gelap
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500" // Input putih dengan teks hitam
            />
          </div>

          {/* Input Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>

          {/* Input Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>

          {/* Input Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" // Tombol biru seperti login
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>

          {/* Pesan */}
          {message && (
            <p className="text-center text-sm text-red-600">{message}</p> // Pesan error merah
          )}
        </form>

        {/* Link ke halaman login */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
