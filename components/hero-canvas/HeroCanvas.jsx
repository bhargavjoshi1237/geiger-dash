"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ZoomControls from "./ZoomControls";
import CustomNode from "./nodes/CustomNode";
import CommentNode from "./nodes/CommentNode";
import LinkNode from "./nodes/LinkNode";

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: {
      label:
        "Launch Strategy 🚀\n\n- Define core value props\n- Identify target audience\n- Set launch timeline",
      backgroundColor: "#222222",
      reactions: { "🔥": 3, "👍": 1 },
    },
    position: { x: 250, y: 150 },
    style: { width: 400, height: 180 },
  },
  {
    id: "2",
    type: "comment",
    data: {
      label: "We should focus on the developer experience first.",
      reactions: { "❤️": 2 },
    },
    position: { x: 700, y: 100 },
  },
  {
    id: "3",
    type: "link",
    data: {
      url: "https://geiger.studio/design-system",
      backgroundColor: "#1a1a1a",
    },
    position: { x: 700, y: 300 },
    style: { width: 340, height: 68 },
  },
  {
    id: "4",
    type: "custom",
    data: {
      label: "Marketing Assets",
      outline: { enabled: true, color: "#10b981", name: "Ready" },
    },
    position: { x: -150, y: 350 },
    style: { width: 340, height: 68 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#6366f1" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#10b981" },
  },
  {
    id: "e4-1",
    source: "4",
    target: "1",
    animated: true,
    style: { stroke: "#ec4899" },
  },
];

export default function HeroCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
      comment: CommentNode,
      link: LinkNode,
    }),
    [],
  );

  return (
    <div className="w-full h-full bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-zinc-950"
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#333" />
        <ZoomControls />
      </ReactFlow>
    </div>
  );
}
