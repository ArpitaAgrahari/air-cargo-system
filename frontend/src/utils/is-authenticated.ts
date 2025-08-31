import { authClient } from "@/lib/auth-client";

export const isAuthenticated = async () => {
  const session = await authClient.getSession();
  return session?.data?.user !== null;
};
