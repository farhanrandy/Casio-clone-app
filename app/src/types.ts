export type ISODateString = `${number}-${number}-${number}T${string}Z`;

// Batasi ke URL https
export type HttpsUrl = `https://${string}`;

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  excerpt: string;
  price: number;
  tags: string[];
  thumbnail: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  category: string;
};

export type UserType = {
  email: string;
  password: string; // sudah di-hash
  name: string;
  username: string;
};
