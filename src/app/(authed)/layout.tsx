import Header from "./_components/header";
import Sidebar from "./_components/sidebar";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-100 lg:ml-60">
        <Header />

        <main className="mx-auto h-full max-w-screen-2xl p-4">{children}</main>
      </div>
    </>
  );
}
