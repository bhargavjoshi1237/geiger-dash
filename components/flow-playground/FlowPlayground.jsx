"use client";

import React, { useState, useCallback, useMemo } from "react";
import { ProjectSidebar } from "./sidebar/projects/project_sidebar";
import { ProjectTopbar } from "./topbar/projects/topbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => (
  <div className="h-full w-full flex items-center justify-center text-zinc-500">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

const ProjectDetailsScreen = dynamic(() => import("./screens/projects/overview/project_details").then((mod) => mod.ProjectDetailsScreen), { loading: LoadingScreen });
const WorkflowsScreen = dynamic(() => import("./screens/projects/issues/workflows").then((mod) => mod.WorkflowsScreen), { loading: LoadingScreen });
const ObjectivesScreen = dynamic(() => import("./screens/projects/objectives/objectives_screen").then((mod) => mod.ObjectivesScreen), { loading: LoadingScreen });
const TasksScreen = dynamic(() => import("./screens/projects/tasks/tasks_screen").then((mod) => mod.TasksScreen), { loading: LoadingScreen });
const GoalsScreen = dynamic(() => import("./screens/projects/goals/goals_screen").then((mod) => mod.GoalsScreen), { loading: LoadingScreen });
const TeamScreen = dynamic(() => import("./screens/projects/team/team").then((mod) => mod.TeamScreen), { loading: LoadingScreen });
const MilestonesScreen = dynamic(() => import("./screens/projects/milestones/milestones_screen").then((mod) => mod.MilestonesScreen), { loading: LoadingScreen });
const ProjectionsScreen = dynamic(() => import("./screens/projects/projections/projections_screen").then((mod) => mod.ProjectionsScreen), { loading: LoadingScreen });
const SecurityScreen = dynamic(() => import("./screens/projects/security/security_screen").then((mod) => mod.SecurityScreen), { loading: LoadingScreen });
const SettingsScreen = dynamic(() => import("./screens/projects/settings/settings_screen").then((mod) => mod.SettingsScreen), { loading: LoadingScreen });
const VaultScreen = dynamic(() => import("./screens/projects/vault/vault_screen").then((mod) => mod.VaultScreen), { loading: LoadingScreen });
const LogsScreen = dynamic(() => import("./screens/projects/logs/logs_screen").then((mod) => mod.LogsScreen), { loading: LoadingScreen });
const AssetsScreen = dynamic(() => import("./screens/projects/assets/assets_screen").then((mod) => mod.AssetsScreen), { loading: LoadingScreen });
const PlanningScreen = dynamic(() => import("./screens/projects/planning/planning_screen").then((mod) => mod.PlanningScreen), { loading: LoadingScreen });

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
                  <main className="relative z-10 flex-1 w-full min-w-0 overflow-y-auto px-2 py-3 sm:px-3 sm:py-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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



