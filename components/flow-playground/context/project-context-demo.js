"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

// Mock project data
const DEMO_PROJECT = {
  id: "demo-project-123",
  name: "Geiger Flow",
  description: "A comprehensive project management demo showcasing Geiger Flow's capabilities",
  status: "active",
  created_at: "2026-01-15T10:00:00Z",
  updated_at: "2026-04-26T09:00:00Z",
  owner_id: "demo-user-456",
  team_size: 8,
  progress: 67,
  budget: 150000,
  spent: 98500,
  start_date: "2026-01-15",
  end_date: "2026-08-30",
  priority: "high",
  category: "Product Development",
  tags: ["web", "mobile", "ai", "saas"],
  visibility: "team",
};

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(DEMO_PROJECT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjectInfo = useCallback(async (projectId) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProject(DEMO_PROJECT);
      setLoading(false);
    }, 300);
  }, []);

  const updateProject = useCallback(async (updates) => {
    setProject((prev) => ({ ...prev, ...updates }));
  }, []);

  const value = {
    project,
    loading,
    error,
    fetchProjectInfo,
    updateProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};



