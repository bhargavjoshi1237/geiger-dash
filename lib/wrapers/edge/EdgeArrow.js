export function getNodeIntersection(nodeA, nodeB) {
  const { width: wA, height: hA } = nodeA.measured;
  const { x: xA, y: yA } = nodeA.internals.positionAbsolute;
  const { width: wB, height: hB } = nodeB.measured;
  const { x: xB, y: yB } = nodeB.internals.positionAbsolute;

  const wAHalf = wA / 2;
  const hAHalf = hA / 2;
  const wBHalf = wB / 2;
  const hBHalf = hB / 2;

  const centerA = { x: xA + wAHalf, y: yA + hAHalf };
  const centerB = { x: xB + wBHalf, y: yB + hBHalf };

  const dx = centerB.x - centerA.x;
  const dy = centerB.y - centerA.y;

  if (dx === 0 && dy === 0) {
    return { x: centerB.x, y: centerB.y };
  }

  if (Math.abs(dx) > 0) {
    const xEdge = centerB.x + (dx > 0 ? -wBHalf : wBHalf);
    const yAtEdge = centerB.y + (dy / dx) * (xEdge - centerB.x);

    if (Math.abs(yAtEdge - centerB.y) <= hBHalf) {
      return { x: xEdge, y: yAtEdge };
    }
  }

  if (Math.abs(dy) > 0) {
    const yEdge = centerB.y + (dy > 0 ? -hBHalf : hBHalf);
    const xAtEdge = centerB.x + (dx / dy) * (yEdge - centerB.y);

    if (Math.abs(xAtEdge - centerB.x) <= wBHalf) {
      return { x: xAtEdge, y: yEdge };
    }
  }

  return { x: centerB.x, y: centerB.y };
}