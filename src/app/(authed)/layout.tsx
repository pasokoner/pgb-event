"use client";

import Header from "./_component/header";
import Sidebar from "./_component/sidebar";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-100">
        <Header />

        <main className="mx-auto h-full max-w-screen-2xl p-4">{children}</main>
      </div>
    </>
  );
}
