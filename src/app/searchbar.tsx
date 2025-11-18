"use client";

import { useEffect, useState } from "react";

export default function SearchBar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setIsLoggedIn(Boolean(data.authenticated));
      })
      .catch(() => {
        if (!mounted) return;
        setIsLoggedIn(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoggedIn === null || !isLoggedIn) return null; // hide until we know

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex-grow max-w-2xl mx-auto px-4"
    >
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
      />
    </form>
  );
}
