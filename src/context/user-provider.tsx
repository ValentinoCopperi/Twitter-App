// app/UserDataFetcher.tsx

import { getUserByUsername } from "@/actions/users/user-actions";
import { userData } from "@/lib/session";
import { UserProvider } from "./user-context";

export default async function UserDataFetcher({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = await userData();
  const user_data = isLoggedIn ? await getUserByUsername(user?.username) : null;

  return (
    <UserProvider initialUserData={user_data} initialIsLoggedIn={isLoggedIn}>
      {children}
    </UserProvider>
  );
}