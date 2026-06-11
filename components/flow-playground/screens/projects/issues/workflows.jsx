"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Play, GitBranch } from "lucide-react";
import { MainScreenWrapper } from "@/components/flow-playground/shared/screen_wrappers";
import { IssueItem } from "@/components/ui/issue-item";

export function WorkflowsScreen() {

  return (
    <MainScreenWrapper>
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Issues</h1>
          <p className="text-muted-foreground mt-1">
            Design and manage your automation Issues.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Issue
          </Button>
      </div>
      
  <div className="space-y-2">
          <IssueItem
            title="API response time exceeding 500ms on /users endpoint"
            severity="critical"
            status="open"
            assignee="Alex M."
            dueDate="Today"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">API response time exceeding 500ms on /users endpoint</h2>
              <p className="text-sm text-muted-foreground mb-4">Critical issue requiring immediate attention.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Alex M.</p>
                <p><span className="text-text-secondary">Status:</span> Open</p>
                <p><span className="text-text-secondary">Due:</span> Today</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Memory leak in websocket connection handler"
            severity="critical"
            status="in_progress"
            assignee="Sarah J."
            dueDate="Tomorrow"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Memory leak in websocket connection handler</h2>
              <p className="text-sm text-muted-foreground mb-4">Critical issue requiring immediate attention.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Sarah J.</p>
                <p><span className="text-text-secondary">Status:</span> In Progress</p>
                <p><span className="text-text-secondary">Due:</span> Tomorrow</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Database connection pool exhaustion"
            severity="high"
            status="open"
            assignee="Mike T."
            dueDate="Mar 10"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Database connection pool exhaustion</h2>
              <p className="text-sm text-muted-foreground mb-4">High priority issue.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Mike T.</p>
                <p><span className="text-text-secondary">Status:</span> Open</p>
                <p><span className="text-text-secondary">Due:</span> Mar 10</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Authentication token refresh failing intermittently"
            severity="high"
            status="in_progress"
            assignee="Lisa K."
            dueDate="Mar 12"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Authentication token refresh failing intermittently</h2>
              <p className="text-sm text-muted-foreground mb-4">High priority issue.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Lisa K.</p>
                <p><span className="text-text-secondary">Status:</span> In Progress</p>
                <p><span className="text-text-secondary">Due:</span> Mar 12</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Frontend build size exceeds 2MB limit"
            severity="medium"
            status="resolved"
            assignee="Chris P."
            dueDate="Mar 8"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Frontend build size exceeds 2MB limit</h2>
              <p className="text-sm text-muted-foreground mb-4">Medium priority issue.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Chris P.</p>
                <p><span className="text-text-secondary">Status:</span> Resolved</p>
                <p><span className="text-text-secondary">Due:</span> Mar 8</p>
              </div>
            </div>
          </IssueItem>
           <IssueItem
            title="Database connection pool exhaustion"
            severity="high"
            status="open"
            assignee="Mike T."
            dueDate="Mar 10"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Database connection pool exhaustion</h2>
              <p className="text-sm text-muted-foreground mb-4">High priority issue.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Mike T.</p>
                <p><span className="text-text-secondary">Status:</span> Open</p>
                <p><span className="text-text-secondary">Due:</span> Mar 10</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Authentication token refresh failing intermittently"
            severity="high"
            status="in_progress"
            assignee="Lisa K."
            dueDate="Mar 12"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Authentication token refresh failing intermittently</h2>
              <p className="text-sm text-muted-foreground mb-4">High priority issue.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Lisa K.</p>
                <p><span className="text-text-secondary">Status:</span> In Progress</p>
                <p><span className="text-text-secondary">Due:</span> Mar 12</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Frontend build size exceeds 2MB limit"
            severity="medium"
            status="resolved"
            assignee="Chris P."
            dueDate="Mar 8"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Frontend build size exceeds 2MB limit</h2>
              <p className="text-sm text-muted-foreground mb-4">Medium priority issue.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Chris P.</p>
                <p><span className="text-text-secondary">Status:</span> Resolved</p>
                <p><span className="text-text-secondary">Due:</span> Mar 8</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Tooltip text overlaps on small screens"
            severity="low"
            status="open"
            assignee="Jamie L."
            dueDate="Mar 18"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Tooltip text overlaps on small screens</h2>
              <p className="text-sm text-muted-foreground mb-4">Low priority cosmetic issue on mobile viewports.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Jamie L.</p>
                <p><span className="text-text-secondary">Status:</span> Open</p>
                <p><span className="text-text-secondary">Due:</span> Mar 18</p>
              </div>
            </div>
          </IssueItem>
          <IssueItem
            title="Dark mode color mismatch on settings page"
            severity="low"
            status="resolved"
            assignee="Taylor R."
            dueDate="Mar 20"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">Dark mode color mismatch on settings page</h2>
              <p className="text-sm text-muted-foreground mb-4">Low priority styling inconsistency.</p>
              <div className="space-y-2 text-sm">
                <p><span className="text-text-secondary">Assignee:</span> Taylor R.</p>
                <p><span className="text-text-secondary">Status:</span> Resolved</p>
                <p><span className="text-text-secondary">Due:</span> Mar 20</p>
              </div>
            </div>
          </IssueItem>
        </div>
      {/* <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <GitBranch className="w-12 h-12 opacity-20" />
                 Issues Canvas Placeholder
              </div>  
            </div> */}
    </MainScreenWrapper>
  );
}



