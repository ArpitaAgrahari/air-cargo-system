import Navbar from "@/components/navbar";
import { withUserProvider } from "@/provider";

function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>
    <Navbar />
    {children}
  </>;
}

export default withUserProvider(RoutesLayout);