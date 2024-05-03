import { useContext } from "react";
import Logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { PanelLeft, LogOut } from "lucide-react";
import { Button } from "@/_shad/components/ui/button";
import { AuthContext } from "@/contexts/auth.context";
import { MAIN_MENU_ITEMS } from "../constants/menu.constant";
import { Sheet, SheetContent, SheetTrigger } from "@/_shad/components/ui/sheet";
import { ToggleTheme } from "@/modules/@shared/components/toggle-theme";
import Each from "@/modules/@shared/components/utils/each";

export default function AppSideMenu() {
  const navigate = useNavigate();
  const { signOut, user } = useContext(AuthContext);

  return (
    <Sheet>
      <nav className="w-full flex items-center justify-between desktop:hidden">
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>

        <section className="flex gap-4 items-center">
          <h5>Olá, {user?.name?.split(" ")[0]}</h5>
          <ToggleTheme />
        </section>
      </nav>

      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <img src={Logo} alt="D" className="h-14 w-14 rounded-md" />

          <Each
            data={MAIN_MENU_ITEMS}
            render={(item) => (
              <SheetTrigger asChild>
                <a
                  onClick={() => navigate(item.url)}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-5 w-5 transition-all group-hover:scale-110" />
                  {item.title}
                </a>
              </SheetTrigger>
            )}
          />

          <a
            onClick={signOut}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
