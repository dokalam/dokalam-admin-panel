"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main>
        <Sidebar />
        <div className={"pr-0 md:pr-72"}>
          <Header />
          <div className="bg-background dark:bg-background_dark">{children}</div>
        </div>
      </main>
    </>
  );
};

export default DashLayout;
