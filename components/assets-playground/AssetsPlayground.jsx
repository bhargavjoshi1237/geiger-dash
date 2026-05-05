"use client";

import React, { useState } from "react";
import { ProjectSidebar } from "./internal/sidebar/projects/project_sidebar";
import { ProjectTopbar } from "./internal/topbar/projects/topbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProjectProvider } from "./context/project-context";
import { settingsNav } from "./internal/sidebar/projects/sidebar_data";
import { HomeScreen } from "./internal/screens/projects/home/home_screen";
// import { LibraryScreen } from "./internal/screens/projects/library/library_screen"; // if exists

function AssetsPlaygroundContent() {
  const [currentTab, setCurrentTab] = useState("Overview");
  
  // mock project load
  const id = "demo-assets-project";

  const renderScreen = () => {
    const isSettingsTab = settingsNav.some((item) => item.title === currentTab);
    if (isSettingsTab) {
      return (
        <div className="flex items-center justify-center h-full text-[#525252] text-sm">
          Settings: {currentTab}
        </div>
      );
    }

    switch (currentTab) {
      case "Overview":
        return <HomeScreen id={id} />;
      // case "Library":
      //   return <LibraryScreen id={id} />;
      default:
        return <div className="flex items-center justify-center h-full text-[#525252] text-sm">Screen: {currentTab}</div>;
    }
  };

  return (
    <div className="flex-col h-full w-full bg-[#161616] text-[#ededed] font-sans overflow-hidden selection:bg-[#333333] flex">
      <SidebarProvider className="flex-col !flex h-full min-w-0" style={{flexDirection: 'column'}}>
        <ProjectTopbar />
        <div className="flex flex-1 overflow-hidden relative">
          <ProjectSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
          <SidebarInset className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative border-none">
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-white/[0.02] blur-[120px] pointer-events-none rounded-full"></div>
            <main className="relative z-10 flex-1 w-full min-w-0 overflow-y-auto px-2 py-3 sm:px-3 sm:py-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {renderScreen()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export function AssetsPlayground() {
  return (
    <ProjectProvider>
      <AssetsPlaygroundContent />
    </ProjectProvider>
  );
}
