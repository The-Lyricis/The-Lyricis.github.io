type GridPt = { gx: number; gy: number };
type DirIndex = 0 | 1 | 2 | 3;
type AnchorKind = "edge" | "inner";
type EdgeSide = "top" | "right" | "bottom" | "left";
type LineKind = "trace" | "bus";

type Anchor = GridPt & {
  kind: AnchorKind;
  side?: EdgeSide;
  inwardDir?: DirIndex;
};

type Layout = {
  viewWidth: number;
  viewHeight: number;
  grid: number;
  busBundleOffsets: readonly number[];
  routeMinX: number;
  routeMaxX: number;
  routeMinY: number;
  routeMaxY: number;
  titleCore: { minX: number; maxX: number; minY: number; maxY: number };
  titleRing: { minX: number; maxX: number; minY: number; maxY: number };
};

type RouteOptions = {
  kind: LineKind;
  maxTurns: number;
  turnPenalty: number;
  busPoints?: Set<string>;
  preferBus?: boolean;
};

type RouteWorkerRequest = {
  id: number;
  start: Anchor;
  end: Anchor;
  occupiedEdges: string[];
  occupiedPoints: string[];
  layout: Layout;
  options: {
    kind: LineKind;
    maxTurns: number;
    turnPenalty: number;
    busPoints?: string[];
    preferBus?: boolean;
  };
};

type RouteWorkerResponse = {
  id: number;
  route: GridPt[] | null;
};

const DIRS: Array<{ dx: number; dy: number }> = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
];

function pointKey(gx: number, gy: number) {
  return `${gx},${gy}`;
}

function edgeKey(a: GridPt, b: GridPt) {
  const one = pointKey(a.gx, a.gy);
  const two = pointKey(b.gx, b.gy);
  return one < two ? `${one}|${two}` : `${two}|${one}`;
}

function manhattan(a: GridPt, b: GridPt) {
  return Math.abs(a.gx - b.gx) + Math.abs(a.gy - b.gy);
}

function inRect(
  point: GridPt,
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  return (
    point.gx >= rect.minX &&
    point.gx <= rect.maxX &&
    point.gy >= rect.minY &&
    point.gy <= rect.maxY
  );
}

function isInsideTitleInterior(point: GridPt, layout: Layout) {
  return (
    point.gx > layout.titleRing.minX &&
    point.gx < layout.titleRing.maxX &&
    point.gy > layout.titleRing.minY &&
    point.gy < layout.titleRing.maxY
  );
}

function nearOccupiedPenalty(point: GridPt, occupiedPoints: Set<string>) {
  let penalty = 0;

  for (let ox = -1; ox <= 1; ox += 1) {
    for (let oy = -1; oy <= 1; oy += 1) {
      if (ox === 0 && oy === 0) continue;
      if (occupiedPoints.has(pointKey(point.gx + ox, point.gy + oy))) {
        penalty += 0.35;
      }
    }
  }

  return penalty;
}

function centerPenalty(point: GridPt, layout: Layout, isEnd = false) {
  const inCore = inRect(point, layout.titleCore);
  const inRing = inRect(point, layout.titleRing);

  if (inCore) return 999;
  if (inRing && !isEnd) return 1.8;

  const centerX = (layout.titleCore.minX + layout.titleCore.maxX) / 2;
  const centerY = (layout.titleCore.minY + layout.titleCore.maxY) / 2;
  const dx = Math.abs(point.gx - centerX);
  const dy = Math.abs(point.gy - centerY);
  return Math.min((dx + dy) * 0.02, 0.6);
}

function reconstructPath(
  endKey: string,
  parentMap: Map<string, string | null>,
  stateMap: Map<string, { point: GridPt; dir: number }>,
) {
  const path: GridPt[] = [];
  let currentKey: string | null = endKey;

  while (currentKey) {
    const state = stateMap.get(currentKey);
    if (!state) break;
    path.push(state.point);
    currentKey = parentMap.get(currentKey) || null;
  }

  return path.reverse();
}

class MinScoreQueue<T extends { score: number }> {
  private heap: T[] = [];

  get size() {
    return this.heap.length;
  }

  push(value: T) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    const tail = this.heap.pop();
    if (!tail) return min;

    this.heap[0] = tail;
    this.bubbleDown(0);
    return min;
  }

  private bubbleUp(index: number) {
    let current = index;

    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.heap[parent].score <= this.heap[current].score) break;

      [this.heap[parent], this.heap[current]] = [this.heap[current], this.heap[parent]];
      current = parent;
    }
  }

  private bubbleDown(index: number) {
    let current = index;

    while (true) {
      const left = current * 2 + 1;
      const right = left + 1;
      let smallest = current;

      if (left < this.heap.length && this.heap[left].score < this.heap[smallest].score) {
        smallest = left;
      }

      if (right < this.heap.length && this.heap[right].score < this.heap[smallest].score) {
        smallest = right;
      }

      if (smallest === current) break;

      [this.heap[current], this.heap[smallest]] = [this.heap[smallest], this.heap[current]];
      current = smallest;
    }
  }
}

function findRoute(
  start: Anchor,
  end: Anchor,
  occupiedEdges: Set<string>,
  occupiedPoints: Set<string>,
  layout: Layout,
  options: RouteOptions,
) {
  const queue = new MinScoreQueue<{
    key: string;
    point: GridPt;
    dir: number;
    cost: number;
    score: number;
    turns: number;
  }>();
  const bestCost = new Map<string, number>();
  const parentMap = new Map<string, string | null>();
  const stateMap = new Map<string, { point: GridPt; dir: number }>();

  const startKey = `${start.gx},${start.gy},-1`;
  queue.push({
    key: startKey,
    point: { gx: start.gx, gy: start.gy },
    dir: -1,
    cost: 0,
    score: manhattan(start, end),
    turns: 0,
  });
  bestCost.set(startKey, 0);
  parentMap.set(startKey, null);
  stateMap.set(startKey, { point: { gx: start.gx, gy: start.gy }, dir: -1 });

  let expanded = 0;

  while (queue.size > 0 && expanded < 9000) {
    const current = queue.pop();
    if (!current) break;
    expanded += 1;

    if (current.point.gx === end.gx && current.point.gy === end.gy) {
      const path = reconstructPath(current.key, parentMap, stateMap);
      return path.length >= 2 ? path : null;
    }

    for (let dir = 0; dir < DIRS.length; dir += 1) {
      const nextPoint = {
        gx: current.point.gx + DIRS[dir].dx,
        gy: current.point.gy + DIRS[dir].dy,
      };

      if (
        nextPoint.gx < layout.routeMinX ||
        nextPoint.gx > layout.routeMaxX ||
        nextPoint.gy < layout.routeMinY ||
        nextPoint.gy > layout.routeMaxY
      ) {
        continue;
      }

      const nextEdge = edgeKey(current.point, nextPoint);
      let nextCost = current.cost + 1;
      let nextTurns = current.turns;

      if (current.dir !== -1 && current.dir !== dir) {
        nextCost += options.turnPenalty;
        nextTurns += 1;
      }

      const isEnd = nextPoint.gx === end.gx && nextPoint.gy === end.gy;

      if (!isEnd && (inRect(nextPoint, layout.titleCore) || isInsideTitleInterior(nextPoint, layout))) {
        continue;
      }

      if (current.dir === -1 && start.inwardDir !== undefined && dir !== start.inwardDir) {
        nextCost += 2.4;
      }

      if (occupiedEdges.has(nextEdge)) {
        nextCost += 8;
      }

      const nextPointLookup = pointKey(nextPoint.gx, nextPoint.gy);
      const isBusPoint = options.busPoints?.has(nextPointLookup);
      const currentDist = manhattan(current.point, end);
      const nextDist = manhattan(nextPoint, end);

      if (occupiedPoints.has(nextPointLookup) && !isEnd && !isBusPoint) {
        nextCost += 2.2;
      }

      nextCost += nearOccupiedPenalty(nextPoint, occupiedPoints);
      nextCost += centerPenalty(nextPoint, layout, isEnd);

      if (nextDist > currentDist) {
        nextCost += options.kind === "bus" ? 0.8 : 1.2;
      }

      if (options.kind === "trace" && isBusPoint) {
        nextCost -= options.preferBus ? 0.18 : 0.04;
      }

      if (options.kind === "bus" && inRect(nextPoint, layout.titleRing) && !isEnd) {
        nextCost += 1.1;
      }

      if (nextTurns > options.maxTurns) continue;

      const heuristic = manhattan(nextPoint, end) * 0.85;
      const stateKey = `${nextPoint.gx},${nextPoint.gy},${dir}`;
      const best = bestCost.get(stateKey);

      if (best !== undefined && best <= nextCost) continue;

      bestCost.set(stateKey, nextCost);
      parentMap.set(stateKey, current.key);
      stateMap.set(stateKey, { point: nextPoint, dir });
      queue.push({
        key: stateKey,
        point: nextPoint,
        dir,
        cost: nextCost,
        score: nextCost + heuristic,
        turns: nextTurns,
      });
    }
  }

  return null;
}

self.onmessage = (event: MessageEvent<RouteWorkerRequest>) => {
  const { id, start, end, occupiedEdges, occupiedPoints, layout, options } = event.data;
  const route = findRoute(
    start,
    end,
    new Set(occupiedEdges),
    new Set(occupiedPoints),
    layout,
    {
      kind: options.kind,
      maxTurns: options.maxTurns,
      turnPenalty: options.turnPenalty,
      busPoints: options.busPoints ? new Set(options.busPoints) : undefined,
      preferBus: options.preferBus,
    },
  );

  const response: RouteWorkerResponse = { id, route };
  self.postMessage(response);
};

export {};
