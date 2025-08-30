import { UserProvider } from "@/context/user-context";
import { getRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { User, UserRole } from "@/types/user";
import { ComponentType, JSX, ReactNode } from "react";

export const withUserProvider = <
  P extends JSX.IntrinsicAttributes & { children?: ReactNode }
>(
  Layout: ComponentType<P>
) => {
  return async function WrappedLayout(props: P) {
    // const response = await getRequest<{
    //   data: User | null;
    // }>(ENDPOINTS.USER_VIEW);
    const dummyUser = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "STAFF" as UserRole,
    };
    // const user = response.data!.data!;
    const user = dummyUser;
    return (
      <UserProvider user={user}>
        <Layout {...props} />
      </UserProvider>
    );
  };
};
