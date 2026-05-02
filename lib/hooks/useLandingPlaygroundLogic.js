"use client";

import { useCallback, useState, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import { copyToClipboard, pasteFromClipboard } from "@/lib/accessibility/clipboard";

const initialNodes = [
  {
    id: "pg-custom-1",
    type: "custom",
    position: { x: 250, y: 80 },
    data: {
      label: "Welcome to the Geiger Notes playground. Drag from the left rail to add nodes.",
      backgroundColor: "#333333",
    },
    style: { width: 390, height: 110 },
  },
  {
    id: "pg-link-1",
    type: "link",
    position: { x: 700, y: 80 },
    data: {
      url: "https://geiger.studio",
      backgroundColor: "#303030",
    },
    style: { width: 340, height: 72 },
  },
  {
    id: "pg-document-1",
    type: "document",
    position: { x: 150, y: 280 },
    data: {
      label: "Roadmap Draft",
      documentId: null,
    },
    style: { width: 260, height: 76 },
  },
  {
    id: "pg-board-1",
    type: "board",
    position: { x: 480, y: 280 },
    data: {
      label: "Product Strategy",
      boardId: "playground-board-1",
      name: "Product Strategy",
      iconName: "LayoutDashboard",
    },
    style: { width: 280, height: 76 },
  },
  {
    id: "pg-comment-1",
    type: "comment",
    position: { x: 820, y: 280 },
    data: {
      label: "Looks good. Add next sprint goals.",
    },
  },
  {
    id: "pg-image-1",
    type: "image",
    position: { x: 250, y: 480 },
    data: {
      label: "Inspiration",
      src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=900&auto=format&fit=crop",
      alt: "Moodboard",
    },
    style: { width: 210, height: 260 },
  },
  {
    id: "pg-file-1",
    type: "file",
    position: { x: 550, y: 480 },
    data: {
      label: "File",
      fileName: "planning-brief.pdf",
      fileSize: 1984523,
      fileType: "application/pdf",
      src: null,
    },
    style: { width: 260, height: 88 },
  },
];

const initialEdges = [
  {
    id: "pg-e-1",
    source: "pg-custom-1",
    target: "pg-link-1",
    type: "center",
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "pg-e-2",
    source: "pg-custom-1",
    target: "pg-comment-1",
    type: "center",
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "pg-e-3",
    source: "pg-link-1",
    target: "pg-document-1",
    type: "center",
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "pg-e-4",
    source: "pg-document-1",
    target: "pg-board-1",
    type: "center",
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
  {
    id: "pg-e-5",
    source: "pg-board-1",
    target: "pg-image-1",
    type: "center",
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
  },
];

const initialViewport = { x: 50, y: 90, zoom: 0.6};

export const useLandingPlaygroundLogic = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [viewport, setViewport] = useState(initialViewport);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "center",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      setNodes((allNodes) =>
        allNodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              position: {
                x: Math.round(n.position.x / 15) * 15,
                y: Math.round(n.position.y / 15) * 15,
              },
            };
          }
          return n;
        }),
      );
    },
    [setNodes],
  );

  const onMove = useCallback((_, nextViewport) => {
    setViewport(nextViewport);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;
      const isInput =
        ["INPUT", "TEXTAREA"].includes(activeElement?.tagName) ||
        activeElement?.isContentEditable;

      if (isInput) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      } else if ((event.metaKey || event.ctrlKey) && event.key === "c") {
        copyToClipboard(nodes, edges);
      } else if ((event.metaKey || event.ctrlKey) && event.key === "v") {
        pasteFromClipboard(nodes, setNodes, setEdges);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, edges, setNodes, setEdges]);

  return {
    nodes,
    edges,
    viewport,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onMove,
    isInitialized: true,
    isLoading: false,
    isSyncing: false,
    panOnDrag: [1],
    selectionOnDrag: true,
    panOnScroll: true,
    zoomOnScroll: true,
    setEdges,
    setNodes,
  };
};