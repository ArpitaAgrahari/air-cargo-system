import React from "react";
import { withUserProvider } from "@/provider";

function FormLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withUserProvider(FormLayout);
