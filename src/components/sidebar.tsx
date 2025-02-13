'use client'

import { Home, UserSquare2, User, LogOutIcon, LucideIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/users/user-actions";
import { toast } from "sonner";

type Route = {
  name: string;
  href: string;
  Icon: LucideIcon;
};

const routes: Route[] = [
  { name: "Home", href: "/", Icon: Home },
  { name: "Following", href: "/following", Icon: UserSquare2 },
  { name: "Profile", href: "/user/me", Icon: User },
];

interface Props {
  closeSheet?: () => void;
  isLoggedIn: boolean
}

const Sidebar: FC<Props> = ({ closeSheet, isLoggedIn }) => {
  const pathname = usePathname();

  const handleLogout = async () => {

    try {
      await logoutAction()
    } catch (error) {
      toast.error("Error on logout")
    }

  }

  return (
    <nav className="flex flex-col h-[90vh] w-full justify-between py-6">
      <ul className="flex flex-col gap-2 flex-grow">
        {routes.map(({ name, href, Icon }) => (
          <li key={name}>
            <Link href={href} onClick={closeSheet}>
              <Button
                variant="link"
                className="w-full text-dark dark:text-white justify-start font-medium h-auto text-base py-3 xl:text-xl"
              >
                <Icon className={cn("!size-8", pathname === href && "text-primary")} />
                <span className={cn("block", pathname === href && "text-primary")}>{name}</span>
              </Button>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto mb-3">
        {isLoggedIn ? (
          <Button
            variant="link"
            className="w-full text-dark dark:text-white justify-start font-medium h-auto text-base py-3 xl:text-xl"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOutIcon className="!size-8" />
            <span>Logout</span>
          </Button>
        ) : (
          <Link href="/login" passHref>
            <Button
              variant="link"
              className="w-full text-dark dark:text-white justify-start font-medium h-auto text-base py-3 xl:text-xl"
              aria-label="Login"
            >
              <LogInIcon className="!size-8" />
              <span>Login</span>
            </Button>
          </Link>
        )}
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="font-light">Designed by</p>
          <p className="font-semibold">Valentino Copperi</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
