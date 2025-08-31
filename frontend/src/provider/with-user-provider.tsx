import { UserProvider } from "@/context/user-context";
import { ComponentType, JSX, ReactNode } from "react";

export const withUserProvider = <
  P extends JSX.IntrinsicAttributes & { children?: ReactNode }
>(
  Layout: ComponentType<P>
) => {
  return function WrappedLayout(props: P) {
    return (
      <UserProvider>
        <Layout {...props} />
      </UserProvider>
    );
  };
};
