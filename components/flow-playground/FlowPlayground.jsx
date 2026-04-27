"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ProjectSidebar } from "./sidebar/projects/project_sidebar";
import { ProjectTopbar } from "./topbar/projects/topbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ProjectDetailsScreen } from "./screens/projects/overview/project_details";
import { WorkflowsScreen } from "./screens/projects/issues/workflows";
import { ObjectivesScreen } from "./screens/projects/objectives/objectives_screen";
import { TasksScreen } from "./screens/projects/tasks/tasks_screen";
import { GoalsScreen } from "./screens/projects/goals/goals_screen";
import { TeamScreen } from "./screens/projects/team/team";
import { MilestonesScreen } from "./screens/projects/milestones/milestones_screen";
import { ProjectionsScreen } from "./screens/projects/projections/projections_screen";
import { SecurityScreen } from "./screens/projects/security/security_screen";
import { SettingsScreen } from "./screens/projects/settings/settings_screen";
import { VaultScreen } from "./screens/projects/vault/vault_screen";
import { LogsScreen } from "./screens/projects/logs/logs_screen";
import { AssetsScreen } from "./screens/projects/assets/assets_screen";
import { PlanningScreen } from "./screens/projects/planning/planning_screen";
import { ProjectProvider } from "./context/project-context-demo";
import { BannerProvider } from "./context/banner-context";
import { settingsNav } from "./sidebar/projects/sidebar_data";
import { AddonRegistryProvider } from "./addons/registry";
import { getAddonScreens } from "./addons/registry";
import "./addons/sql";

export function FlowPlayground() {
  const [currentTab, setCurrentTab] = useState("Overview");
  const [enabledAddons] = useState([]);

  const addonScreens = getAddonScreens(enabledAddons);

  const renderScreen = () => {
    const isSettingsTab = settingsNav.some((item) => item.title === currentTab);
    if (isSettingsTab) {
      return <SettingsScreen activeSettingsTab={currentTab} />;
    }

    if (addonScreens[currentTab]) {
      const AddonScreen = addonScreens[currentTab];
      return <AddonScreen />;
    }

    switch (currentTab) {
      case "Overview":
        return <ProjectDetailsScreen id="demo-project" />;
      case "Issues":
        return <WorkflowsScreen />;
      case "Tasks":
        return <TasksScreen />;
      case "Goals":
        return <GoalsScreen />;
      case "Objectives":
        return <ObjectivesScreen />;
      case "Projections":
        return <ProjectionsScreen />;
      case "Planning":
        return <PlanningScreen />;
      case "Milestones":
        return <MilestonesScreen />;
      case "Team":
        return <TeamScreen />;
      case "Vault":
        return <VaultScreen />;
      case "Assets":
        return <AssetsScreen />;
      case "Logs":
        return <LogsScreen />;
      case "Security":
        return <SecurityScreen />;
      default:
        return <ProjectDetailsScreen id="demo-project" />;
    }
  };

  return (
    <BannerProvider>
      <ProjectProvider>
        <AddonRegistryProvider>
          <div className="flex-col h-full w-full bg-[#161616] text-[#ededed] font-sans overflow-hidden selection:bg-[#333333] flex">
            <SidebarProvider className="flex-col flex! h-full min-w-0 bg-[#161616]" style={{flexDirection: 'column'}}>
              <ProjectTopbar />
              <div className="flex flex-1 overflow-hidden relative">
                <ProjectSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
                <SidebarInset className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative border-none">
                  <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#161616] blur-[120px] pointer-events-none rounded-full"></div>
                  <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {renderScreen()}
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </div>
        </AddonRegistryProvider>
      </ProjectProvider>
    </BannerProvider>
  );
}



