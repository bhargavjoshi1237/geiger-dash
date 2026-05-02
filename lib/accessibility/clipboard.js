import { getConnectedEdges } from '@xyflow/react';

const CLIPBOARD_KEY = 'flow-clipboard-nodes';

export const copyToClipboard = (nodes, edges) => {
  const selectedNodes = nodes.filter((node) => node.selected);
  const selectedEdges = getConnectedEdges(selectedNodes, edges);
  
  if (selectedNodes.length === 0) return;

  const clipboardData = {
    nodes: selectedNodes,
    edges: selectedEdges,
  };

  try {
      localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(clipboardData));
  } catch (e) {
      console.error('Failed to copy to clipboard', e);
  }
};

export const pasteFromClipboard = (nodes, setNodes, setEdges) => {
    try {
        const clipboardDataStr = localStorage.getItem(CLIPBOARD_KEY);
        if (!clipboardDataStr) return;

        const { nodes: copiedNodes, edges: copiedEdges } = JSON.parse(clipboardDataStr);
        if (!copiedNodes || copiedNodes.length === 0) return;

        let offsetX = 50;
        let offsetY = 50;
        const step = 50;
        const anchor = copiedNodes[0];

        for (let i = 1; i <= 100; i++) {
            const checkX = anchor.position.x + (i * step);
            const checkY = anchor.position.y + (i * step);
            const collision = nodes.some(n => 
                Math.abs(n.position.x - checkX) < 10 && 
                Math.abs(n.position.y - checkY) < 10
            );

            if (!collision) {
                offsetX = i * step;
                offsetY = i * step;
                break;
            }
        }

        const idMap = {};
        const newNodes = copiedNodes.map((node) => {
            const newId = `${node.id}_copy_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            idMap[node.id] = newId;
            
            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + offsetX, 
                    y: node.position.y + offsetY,
                },
                selected: true, 
            };
        });

        const newEdges = copiedEdges.map((edge) => {
            if (idMap[edge.source] && idMap[edge.target]) {
                const newId = `e${idMap[edge.source]}-${idMap[edge.target]}_${Math.random().toString(36).substr(2, 5)}`;
                return {
                    ...edge,
                    id: newId,
                    source: idMap[edge.source],
                    target: idMap[edge.target],
                    selected: true,
                };
            }
            return null;
        }).filter(Boolean);

        setNodes((nds) => 
            nds.map(n => ({ ...n, selected: false })).concat(newNodes)
        );
        
        setEdges((eds) => 
             eds.map(e => ({ ...e, selected: false })).concat(newEdges)
        );

    } catch (e) {
        console.error('Failed to paste from clipboard', e);
    }
};
