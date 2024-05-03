import AppAside from "./aside";
import AppSideMenu from "./side-menu";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <section className="flex h-screen w-full flex-col bg-muted/40 overflow-y-auto">
      <AppAside />

      <article className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <AppSideMenu />
        </header>

        <main className="flex-1 items-start p-4 sm:px-6 sm:py-0">
          <Outlet />
        </main>
      </article>
    </section>
  );
}
