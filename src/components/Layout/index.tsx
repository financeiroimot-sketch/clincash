import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div style={{ width: "100%", maxWidth: 1500 }}>
      {children}
    </div>
  );
}

export default Layout;
