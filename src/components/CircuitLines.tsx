import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Pt = { x: number; y: number };
type GridPt = { gx: number; gy: number };
type Node = { x: number; y: number; frac: number };
type DirIndex = 0 | 1 | 2 | 3;
type AnchorKind = "edge" | "inner";
type EdgeSide = "top" | "right" | "bottom" | "left";
type LineKind = "trace" | "bus";

type Anchor = GridPt & {
  kind: AnchorKind;
  side?: EdgeSide;
  inwardDir?: DirIndex;
};

type Circuit = {
  id: string;
  kind: LineKind;
  side: EdgeSide;
  createdAt: number;
  d: string;
  renderPaths: string[];
  busBundleOffsets?: readonly number[];
  busJoin?: {
    busId: string;
    busIndex: number;
    traceIndex: number;
    laneSide: -1 | 1;
    laneRank: number;
  };
  nodes: Node[];
  gridPts: GridPt[];
  drawDuration: number;
  holdDuration: number;
  fadeDuration: number;
  totalDuration: number;
  strokeWidth: number;
};

type TraceBusJoin = {
  route: GridPt[];
  traceIndex: number;
  busIndex: number;
  bus: Circuit;
  laneSide: -1 | 1;
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

type TitleBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const GRID = 20;
const MARGIN = 60;

const TRACE_MIN_TURNS = 2;
const TRACE_MAX_TURNS = 5;
const BUS_MIN_TURNS = 1;
const BUS_MAX_TURNS = 2;

const MIN_ACTIVE_LINES = 8;
const MAX_ACTIVE_LINES = 16;
const INITIAL_ACTIVE_LINES = 10;
const MIN_BUS_LINES = 1;
const MAX_BUS_LINES = 2;
const MAX_CANVAS_DPR = 1.5;
const INITIAL_SPAWN_INTERVAL_MS = 60;
const MIN_FILL_INTERVAL_MS = 120;
const NORMAL_SPAWN_INTERVAL_MIN_MS = 900;
const NORMAL_SPAWN_INTERVAL_MAX_MS = 1700;

const REGION_COLS = 3;
const REGION_ROWS = 3;
const MAX_LINES_PER_REGION = 3;
const EDGE_SIDE_TARGET = 2;
const BUS_JOIN_POINT_LIMIT = 4;
const BUS_LINE_SPACING = 4.6;
const BUS_LANE_STEP = 3.5;

const DIRS: Array<{ dx: number; dy: number }> = [
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

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

function dist(a: Pt, b: Pt) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getCircuitPerformanceTier(width: number) {
  const deviceMemory =
    typeof navigator !== "undefined"
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
      : 8;

  if (width < 768 || deviceMemory <= 4) return "low";
  if (width < 1200 || deviceMemory <= 8) return "medium";
  return "high";
}

function getBusBundleOffsets(width: number) {
  const tier = getCircuitPerformanceTier(width);

  if (tier === "low") {
    return Math.random() < 0.14
      ? ([-BUS_LINE_SPACING, 0, BUS_LINE_SPACING] as const)
      : ([-BUS_LINE_SPACING / 2, BUS_LINE_SPACING / 2] as const);
  }

  if (tier === "medium") {
    return Math.random() < 0.22
      ? ([-BUS_LINE_SPACING, 0, BUS_LINE_SPACING] as const)
      : ([-BUS_LINE_SPACING / 2, BUS_LINE_SPACING / 2] as const);
  }

  return Math.random() < 0.3
    ? ([-BUS_LINE_SPACING, 0, BUS_LINE_SPACING] as const)
    : ([-BUS_LINE_SPACING / 2, BUS_LINE_SPACING / 2] as const);
}

function getBusSideBaseOffset(offsets: readonly number[], laneSide: -1 | 1) {
  return laneSide < 0 ? offsets[0] : offsets[offsets.length - 1];
}

function buildLayout(width: number, height: number, titleBounds?: TitleBounds | null): Layout {
  const safeWidth = Math.max(width, 640);
  const safeHeight = Math.max(height, 480);

  const maxGridX = Math.floor(safeWidth / GRID);
  const maxGridY = Math.floor(safeHeight / GRID);
  const routeMinX = Math.round(MARGIN / GRID);
  const routeMinY = Math.round(MARGIN / GRID);
  const routeMaxX = maxGridX - routeMinX;
  const routeMaxY = maxGridY - routeMinY;

  const centerX = (routeMinX + routeMaxX) / 2;
  const centerY = (routeMinY + routeMaxY) / 2;
  const spanX = routeMaxX - routeMinX;
  const spanY = routeMaxY - routeMinY;

  const fallbackCoreHalfW = Math.max(5, Math.round(spanX * 0.12));
  const fallbackCoreHalfH = Math.max(5, Math.round(spanY * 0.14));
  const fallbackRingHalfW = Math.max(8, Math.round(spanX * 0.2));
  const fallbackRingHalfH = Math.max(8, Math.round(spanY * 0.22));

  const titleRect = titleBounds
    ? {
        minX: clamp(Math.floor(titleBounds.x / GRID), routeMinX + 2, routeMaxX - 2),
        maxX: clamp(
          Math.ceil((titleBounds.x + titleBounds.width) / GRID),
          routeMinX + 2,
          routeMaxX - 2,
        ),
        minY: clamp(Math.floor(titleBounds.y / GRID), routeMinY + 2, routeMaxY - 2),
        maxY: clamp(
          Math.ceil((titleBounds.y + titleBounds.height) / GRID),
          routeMinY + 2,
          routeMaxY - 2,
        ),
      }
    : null;

  const ringRect = titleRect
    ? {
        minX: titleRect.minX,
        maxX: titleRect.maxX,
        minY: titleRect.minY,
        maxY: titleRect.maxY,
      }
    : null;
  const coreRect = titleRect
    ? (() => {
        const minX = clamp(titleRect.minX + 1, routeMinX + 2, routeMaxX - 2);
        const maxX = clamp(titleRect.maxX - 1, routeMinX + 2, routeMaxX - 2);
        const minY = clamp(titleRect.minY + 1, routeMinY + 2, routeMaxY - 2);
        const maxY = clamp(titleRect.maxY - 1, routeMinY + 2, routeMaxY - 2);

        return {
          minX: Math.min(minX, maxX),
          maxX: Math.max(minX, maxX),
          minY: Math.min(minY, maxY),
          maxY: Math.max(minY, maxY),
        };
      })()
    : null;

  return {
    viewWidth: safeWidth,
    viewHeight: safeHeight,
    grid: GRID,
    busBundleOffsets: getBusBundleOffsets(safeWidth),
    routeMinX,
    routeMaxX,
    routeMinY,
    routeMaxY,
    titleCore: coreRect || {
      minX: Math.round(centerX - fallbackCoreHalfW),
      maxX: Math.round(centerX + fallbackCoreHalfW),
      minY: Math.round(centerY - fallbackCoreHalfH),
      maxY: Math.round(centerY + fallbackCoreHalfH),
    },
    titleRing: ringRect || {
      minX: Math.round(centerX - fallbackRingHalfW),
      maxX: Math.round(centerX + fallbackRingHalfW),
      minY: Math.round(centerY - fallbackRingHalfH),
      maxY: Math.round(centerY + fallbackRingHalfH),
    },
  };
}

function getLineTargets(width: number, height: number) {
  const tier = getCircuitPerformanceTier(width);
  const lineCap = tier === "low" ? 10 : tier === "medium" ? 13 : MAX_ACTIVE_LINES;
  const areaFactor = Math.max(1, Math.floor((width * height) / 240000));
  const min = clamp(areaFactor + 3, MIN_ACTIVE_LINES, lineCap - 2);
  const max = clamp(min + 3, min + 1, lineCap - 1);
  const initial = clamp(min + 1, min, max);

  return { min, max, initial };
}

function toPixel(point: GridPt, layout: Layout): Pt {
  return {
    x: point.gx * layout.grid,
    y: point.gy * layout.grid,
  };
}

function buildEdgeAnchors(layout: Layout) {
  const anchors: Anchor[] = [];
  const step = 4;

  for (let gx = layout.routeMinX + 2; gx <= layout.routeMaxX - 2; gx += step) {
    anchors.push({
      gx,
      gy: layout.routeMinY,
      kind: "edge",
      side: "top",
      inwardDir: 1,
    });
    anchors.push({
      gx,
      gy: layout.routeMaxY,
      kind: "edge",
      side: "bottom",
      inwardDir: 3,
    });
  }

  for (let gy = layout.routeMinY + 2; gy <= layout.routeMaxY - 2; gy += step) {
    anchors.push({
      gx: layout.routeMinX,
      gy,
      kind: "edge",
      side: "left",
      inwardDir: 0,
    });
    anchors.push({
      gx: layout.routeMaxX,
      gy,
      kind: "edge",
      side: "right",
      inwardDir: 2,
    });
  }

  return anchors;
}

function sampleBandPositions(min: number, max: number, count: number) {
  if (count <= 1) return [Math.round((min + max) / 2)];

  const values: number[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    values.push(Math.round(min + (max - min) * t));
  }
  return [...new Set(values)];
}

function buildInnerAnchors(layout: Layout) {
  const anchors: Anchor[] = [];
  const xs = sampleBandPositions(layout.routeMinX + 5, layout.routeMaxX - 5, 8);
  const ys = sampleBandPositions(layout.routeMinY + 4, layout.routeMaxY - 4, 7);

  xs.forEach((gx) => {
    ys.forEach((gy) => {
      const inTitleCore =
        gx >= layout.titleCore.minX &&
        gx <= layout.titleCore.maxX &&
        gy >= layout.titleCore.minY &&
        gy <= layout.titleCore.maxY;

      if (!inTitleCore) {
        anchors.push({ gx, gy, kind: "inner" });
      }
    });
  });

  return anchors;
}

function buildTitleRingAnchors(layout: Layout) {
  const anchors: Anchor[] = [];
  const xs = sampleBandPositions(layout.titleRing.minX + 1, layout.titleRing.maxX - 1, 6);
  const ys = sampleBandPositions(layout.titleRing.minY + 1, layout.titleRing.maxY - 1, 6);

  xs.forEach((gx) => {
    anchors.push({ gx, gy: layout.titleRing.minY, kind: "inner", side: "top" });
    anchors.push({ gx, gy: layout.titleRing.maxY, kind: "inner", side: "bottom" });
  });

  ys.forEach((gy) => {
    anchors.push({ gx: layout.titleRing.minX, gy, kind: "inner", side: "left" });
    anchors.push({ gx: layout.titleRing.maxX, gy, kind: "inner", side: "right" });
  });

  return anchors;
}

function buildCenterTargetAnchors(layout: Layout, innerAnchors: Anchor[], ringAnchors: Anchor[]) {
  void layout;
  void innerAnchors;
  return ringAnchors;
}

function inRect(point: GridPt, rect: { minX: number; maxX: number; minY: number; maxY: number }) {
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

function hasSelfOverlap(points: GridPt[]) {
  const seen = new Set<string>();
  for (const point of points) {
    const key = pointKey(point.gx, point.gy);
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

function buildOccupancy(circuits: Circuit[]) {
  const occupiedEdges = new Set<string>();
  const occupiedPoints = new Set<string>();

  circuits.forEach((circuit) => {
    circuit.gridPts.forEach((point, idx) => {
      occupiedPoints.add(pointKey(point.gx, point.gy));
      if (idx > 0) {
        occupiedEdges.add(edgeKey(circuit.gridPts[idx - 1], point));
      }
    });
  });

  return { occupiedEdges, occupiedPoints };
}

function getRegionKey(points: GridPt[], layout: Layout) {
  const avgX =
    points.reduce((sum, point) => sum + point.gx, 0) / Math.max(points.length, 1);
  const avgY =
    points.reduce((sum, point) => sum + point.gy, 0) / Math.max(points.length, 1);
  const spanX = layout.routeMaxX - layout.routeMinX;
  const spanY = layout.routeMaxY - layout.routeMinY;
  const normalizedX = (avgX - layout.routeMinX) / Math.max(spanX, 1);
  const normalizedY = (avgY - layout.routeMinY) / Math.max(spanY, 1);

  const col = Math.min(REGION_COLS - 1, Math.floor(normalizedX * REGION_COLS));
  const row = Math.min(REGION_ROWS - 1, Math.floor(normalizedY * REGION_ROWS));
  return `${col}-${row}`;
}

function getRegionCounts(circuits: Circuit[], layout: Layout) {
  const counts = new Map<string, number>();
  circuits.forEach((circuit) => {
    const key = getRegionKey(circuit.gridPts, layout);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

function isTurn(prev: GridPt, current: GridPt, next: GridPt) {
  const dx1 = current.gx - prev.gx;
  const dy1 = current.gy - prev.gy;
  const dx2 = next.gx - current.gx;
  const dy2 = next.gy - current.gy;
  return dx1 !== dx2 || dy1 !== dy2;
}

function countTurns(points: GridPt[]) {
  let turns = 0;
  for (let i = 1; i < points.length - 1; i += 1) {
    if (isTurn(points[i - 1], points[i], points[i + 1])) {
      turns += 1;
    }
  }
  return turns;
}

function mergeRoutes(first: GridPt[], second: GridPt[]) {
  if (first.length === 0) return second;
  if (second.length === 0) return first;

  const merged = [...first];
  const startIndex =
    first[first.length - 1].gx === second[0].gx &&
    first[first.length - 1].gy === second[0].gy
      ? 1
      : 0;

  for (let i = startIndex; i < second.length; i += 1) {
    merged.push(second[i]);
  }

  return merged;
}

function buildPathData(points: GridPt[], layout: Layout, includeTurnNodes = true) {
  const pxPts = points.map((point) => toPixel(point, layout));
  const cumulative: number[] = [0];

  for (let i = 1; i < pxPts.length; i += 1) {
    cumulative[i] = cumulative[i - 1] + dist(pxPts[i - 1], pxPts[i]);
  }

  const total = cumulative[cumulative.length - 1] || 1;

  const d = pxPts
    .map((point, idx) =>
      idx === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");

  const nodes: Node[] = [];
  points.forEach((point, idx) => {
    const isStart = idx === 0;
    const isEnd = idx === points.length - 1;
    const keepTurn =
      includeTurnNodes &&
      idx > 0 &&
      idx < points.length - 1 &&
      isTurn(points[idx - 1], point, points[idx + 1]);

    if (isStart || isEnd || keepTurn) {
      const px = toPixel(point, layout);
      nodes.push({
        x: px.x,
        y: px.y,
        frac: cumulative[idx] / total,
      });
    }
  });

  return { d, nodes };
}

function buildPathString(points: Pt[]) {
  return points
    .map((point, idx) =>
      idx === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

function buildRenderablePaths(
  circuit: Pick<Circuit, "kind" | "d" | "gridPts" | "busBundleOffsets">,
  layout: Layout,
) {
  if (circuit.kind !== "bus") {
    return [circuit.d];
  }

  const bundleOffsets = circuit.busBundleOffsets ?? layout.busBundleOffsets;
  return bundleOffsets.map((offset) =>
    buildOffsetPathData(circuit.gridPts, layout, offset),
  );
}

function countBusLaneAttachments(
  circuits: Circuit[],
  busId: string,
  laneSide: -1 | 1,
) {
  return circuits.filter(
    (circuit) =>
      circuit.kind === "trace" &&
      circuit.busJoin?.busId === busId &&
      circuit.busJoin.laneSide === laneSide,
  ).length;
}

function countBusAttachments(circuits: Circuit[], busId: string) {
  return circuits.filter((circuit) => circuit.busJoin?.busId === busId).length;
}

function isCompatibleBusSide(traceSide: EdgeSide, busSide: EdgeSide) {
  if (traceSide === busSide) return true;

  const adjacent: Record<EdgeSide, EdgeSide[]> = {
    top: ["left", "right"],
    right: ["top", "bottom"],
    bottom: ["left", "right"],
    left: ["top", "bottom"],
  };

  return adjacent[traceSide].includes(busSide);
}

function buildBusRenderPathMap(circuits: Circuit[], layout: Layout) {
  const map = new Map<string, string[]>();

  circuits
    .filter((circuit) => circuit.kind === "bus")
    .forEach((bus) => {
      const bundleOffsets = bus.busBundleOffsets ?? layout.busBundleOffsets;
      const basePaths = bundleOffsets.map((offset) =>
        buildOffsetPathData(bus.gridPts, layout, offset),
      );

      const attachedLanePaths = circuits
        .filter(
          (circuit) =>
            circuit.kind === "trace" &&
            circuit.busJoin?.busId === bus.id,
        )
        .sort(
          (a, b) =>
            (a.busJoin?.busIndex || 0) - (b.busJoin?.busIndex || 0),
        )
        .map((circuit) => {
          const join = circuit.busJoin;
          if (!join) return null;

          const laneOffset =
            getBusSideBaseOffset(bundleOffsets, join.laneSide) +
            join.laneSide * join.laneRank * BUS_LANE_STEP;

          return buildOffsetPathData(
            bus.gridPts.slice(join.busIndex),
            layout,
            laneOffset,
          );
        })
        .filter((path): path is string => Boolean(path));

      map.set(bus.id, [...basePaths, ...attachedLanePaths]);
    });

  return map;
}

function buildBusRenderPointMap(circuits: Circuit[], layout: Layout) {
  const map = new Map<string, RenderStroke[]>();
  const titleRect = {
    minX: layout.titleRing.minX * layout.grid,
    maxX: layout.titleRing.maxX * layout.grid,
    minY: layout.titleRing.minY * layout.grid,
    maxY: layout.titleRing.maxY * layout.grid,
  };

  circuits
    .filter((circuit) => circuit.kind === "bus")
    .forEach((bus) => {
      const bundleOffsets = bus.busBundleOffsets ?? layout.busBundleOffsets;
      const clippedLanes = bundleOffsets.map((offset) =>
        clipBusLaneToTargetFace(
          buildOffsetPoints(bus.gridPts, layout, offset),
          bus.side,
          titleRect,
        ),
      ).filter((points): points is Pt[] => Boolean(points && points.length >= 2));

      const lengths = clippedLanes.map((points) => buildPolylineMetrics(points)?.totalLength || 0);
      const maxLength = Math.max(...lengths, 1);

      map.set(
        bus.id,
        clippedLanes.map((points, idx) => ({
          points,
          reachScale: lengths[idx] / maxLength,
        })),
      );
    });

  return map;
}

function buildJoinedTraceRenderPoints(circuit: Circuit, parentBus: Circuit, layout: Layout) {
  const join = circuit.busJoin;
  if (!join) return circuit.gridPts.map((point) => toPixel(point, layout));

  const preJoinPx = circuit.gridPts
    .slice(0, join.traceIndex)
    .map((point) => toPixel(point, layout));
  const bundleOffsets = parentBus.busBundleOffsets ?? layout.busBundleOffsets;
  const laneOffset =
    getBusSideBaseOffset(bundleOffsets, join.laneSide) +
    join.laneSide * join.laneRank * BUS_LANE_STEP;
  const busTailPoints = buildOffsetPoints(
    parentBus.gridPts.slice(join.busIndex),
    layout,
    laneOffset,
  );

  return [...preJoinPx, ...busTailPoints];
}

function buildCircuitRenderPointMap(circuits: Circuit[], layout: Layout) {
  const map = new Map<string, RenderStroke[]>();
  const busById = new Map(
    circuits
      .filter((circuit) => circuit.kind === "bus")
      .map((circuit) => [circuit.id, circuit] as const),
  );

  circuits.forEach((circuit) => {
    if (circuit.kind === "bus") {
      map.set(circuit.id, buildBusRenderPointMap([circuit], layout).get(circuit.id) || []);
      return;
    }

    if (circuit.busJoin) {
      const parentBus = busById.get(circuit.busJoin.busId);
      if (parentBus) {
        map.set(circuit.id, [{ points: buildJoinedTraceRenderPoints(circuit, parentBus, layout) }]);
        return;
      }
    }

    map.set(circuit.id, [{ points: circuit.gridPts.map((point) => toPixel(point, layout)) }]);
  });

  return map;
}

function buildCircuitRenderStrokes(
  circuit: Circuit,
  circuitsById: Map<string, Circuit>,
  layout: Layout,
) {
  if (circuit.kind === "bus") {
    return buildBusRenderPointMap([circuit], layout).get(circuit.id) || [];
  }

  if (circuit.busJoin) {
    const parentBus = circuitsById.get(circuit.busJoin.busId);
    if (parentBus) {
      return [{ points: buildJoinedTraceRenderPoints(circuit, parentBus, layout) }];
    }
  }

  return [{ points: circuit.gridPts.map((point) => toPixel(point, layout)) }];
}

function resolveLinkedLifecycle(parent: Circuit, now: number, fallbackDraw: number) {
  const elapsed = Math.max(0, (now - parent.createdAt) / 1000);
  const fadeStart = parent.drawDuration + parent.holdDuration;
  const timeUntilFade = Math.max(0, fadeStart - elapsed);
  const remainingFade = Math.max(0.25, parent.totalDuration - Math.max(elapsed, fadeStart));

  if (timeUntilFade <= 0.2) {
    const drawDuration = Math.min(Math.max(fallbackDraw * 0.35, 0.18), remainingFade * 0.3);
    return {
      drawDuration,
      holdDuration: 0,
      fadeDuration: Math.max(0.25, remainingFade),
    };
  }

  const drawDuration = Math.min(fallbackDraw, Math.max(0.35, Math.min(0.9, timeUntilFade * 0.45)));
  const holdDuration = Math.max(0, timeUntilFade - drawDuration);

  return {
    drawDuration,
    holdDuration,
    fadeDuration: Math.max(0.25, remainingFade),
  };
}

type PolylineMetrics = {
  points: Pt[];
  lengths: number[];
  totalLength: number;
};

type RenderStroke = {
  points: Pt[];
  reachScale?: number;
};

type RenderStrokeMetrics = {
  metrics: PolylineMetrics;
  reachScale?: number;
};

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

      if (
        left < this.heap.length &&
        this.heap[left].score < this.heap[smallest].score
      ) {
        smallest = left;
      }

      if (
        right < this.heap.length &&
        this.heap[right].score < this.heap[smallest].score
      ) {
        smallest = right;
      }

      if (smallest === current) break;

      [this.heap[current], this.heap[smallest]] = [this.heap[smallest], this.heap[current]];
      current = smallest;
    }
  }
}

function buildPolylineMetrics(points: Pt[]): PolylineMetrics | null {
  if (points.length < 2) return null;

  const lengths: number[] = [0];
  for (let i = 1; i < points.length; i += 1) {
    lengths[i] = lengths[i - 1] + dist(points[i - 1], points[i]);
  }

  const totalLength = lengths[lengths.length - 1];
  if (totalLength <= 0.001) return null;

  return { points, lengths, totalLength };
}

function buildCircuitRenderMetricsMap(circuitRenderPointMap: Map<string, RenderStroke[]>) {
  const map = new Map<string, RenderStrokeMetrics[]>();

  circuitRenderPointMap.forEach((strokes, circuitId) => {
    const strokeMetrics: RenderStrokeMetrics[] = [];

    strokes.forEach((stroke) => {
      const metrics = buildPolylineMetrics(stroke.points);
      if (!metrics) return;

      strokeMetrics.push({
        metrics,
        reachScale: stroke.reachScale,
      });
    });

    map.set(circuitId, strokeMetrics);
  });

  return map;
}

function getAffectedRenderIds(nextCircuits: Circuit[], changedCircuits: Circuit[]) {
  const ids = new Set<string>();
  const changedBusIds = new Set<string>();

  changedCircuits.forEach((circuit) => {
    ids.add(circuit.id);
    if (circuit.kind === "bus") {
      changedBusIds.add(circuit.id);
    }
    if (circuit.busJoin) {
      ids.add(circuit.busJoin.busId);
      changedBusIds.add(circuit.busJoin.busId);
    }
  });

  if (changedBusIds.size > 0) {
    nextCircuits.forEach((circuit) => {
      if (circuit.busJoin && changedBusIds.has(circuit.busJoin.busId)) {
        ids.add(circuit.id);
      }
    });
  }

  return ids;
}

function updateCircuitRenderMetricsMap(
  currentMap: Map<string, RenderStrokeMetrics[]>,
  nextCircuits: Circuit[],
  changedCircuits: Circuit[],
  layout: Layout,
) {
  const nextMap = new Map(currentMap);
  const circuitsById = new Map(nextCircuits.map((circuit) => [circuit.id, circuit] as const));
  const affectedIds = getAffectedRenderIds(nextCircuits, changedCircuits);

  affectedIds.forEach((id) => {
    const circuit = circuitsById.get(id);
    if (!circuit) {
      nextMap.delete(id);
      return;
    }

    const strokes = buildCircuitRenderStrokes(circuit, circuitsById, layout);
    const strokeMetrics: RenderStrokeMetrics[] = [];

    strokes.forEach((stroke) => {
      const metrics = buildPolylineMetrics(stroke.points);
      if (!metrics) return;
      strokeMetrics.push({
        metrics,
        reachScale: stroke.reachScale,
      });
    });

    nextMap.set(id, strokeMetrics);
  });

  return nextMap;
}

function samplePointAtDistance(metrics: PolylineMetrics, targetDistance: number) {
  if (targetDistance <= 0) return metrics.points[0];
  if (targetDistance >= metrics.totalLength) {
    return metrics.points[metrics.points.length - 1];
  }

  for (let i = 1; i < metrics.points.length; i += 1) {
    const segStart = metrics.lengths[i - 1];
    const segEnd = metrics.lengths[i];
    if (targetDistance > segEnd) continue;

    const t = (targetDistance - segStart) / Math.max(segEnd - segStart, 0.001);
    return {
      x: metrics.points[i - 1].x + (metrics.points[i].x - metrics.points[i - 1].x) * t,
      y: metrics.points[i - 1].y + (metrics.points[i].y - metrics.points[i - 1].y) * t,
    };
  }

  return metrics.points[metrics.points.length - 1];
}

function inPixelRect(point: Pt, rect: { minX: number; maxX: number; minY: number; maxY: number }) {
  return (
    point.x >= rect.minX &&
    point.x <= rect.maxX &&
    point.y >= rect.minY &&
    point.y <= rect.maxY
  );
}

function getFirstRectIntersection(
  a: Pt,
  b: Pt,
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let t0 = 0;
  let t1 = 1;

  const clip = (p: number, q: number) => {
    if (Math.abs(p) < 0.0001) {
      return q >= 0;
    }

    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };

  if (
    !clip(-dx, a.x - rect.minX) ||
    !clip(dx, rect.maxX - a.x) ||
    !clip(-dy, a.y - rect.minY) ||
    !clip(dy, rect.maxY - a.y)
  ) {
    return null;
  }

  if (t0 < 0 || t0 > 1) return null;

  return {
    x: a.x + dx * t0,
    y: a.y + dy * t0,
  };
}

function clipPolylineToRectBoundary(
  points: Pt[],
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  if (points.length < 2) return null;
  const result: Pt[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const currentInside = inPixelRect(current, rect);
    const intersection = getFirstRectIntersection(prev, current, rect);

    if (currentInside || (intersection && !inPixelRect(prev, rect))) {
      const clippedPoint = intersection || current;
      if (dist(result[result.length - 1], clippedPoint) > 0.5) {
        result.push(clippedPoint);
      }
      return result.length >= 2 ? result : null;
    }

    result.push(current);
  }

  return result.length >= 2 ? result : null;
}

function clipBusLaneToTargetFace(
  points: Pt[],
  side: EdgeSide,
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  if (points.length < 2) return null;
  const result: Pt[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const dx = current.x - prev.x;
    const dy = current.y - prev.y;

    let projectedStop: Pt | null = null;

    if (side === "left" || side === "right") {
      const targetX = side === "left" ? rect.minX : rect.maxX;
      const movingTowardFace =
        Math.abs(dx) > 0.001 &&
        ((side === "left" && dx > 0) || (side === "right" && dx < 0));

      if (
        movingTowardFace &&
        prev.y >= rect.minY &&
        prev.y <= rect.maxY &&
        ((side === "left" && targetX >= prev.x) ||
          (side === "right" && targetX <= prev.x))
      ) {
        projectedStop = {
          x: targetX,
          y: prev.y,
        };
      }
    } else {
      const targetY = side === "top" ? rect.minY : rect.maxY;
      const movingTowardFace =
        Math.abs(dy) > 0.001 &&
        ((side === "top" && dy > 0) || (side === "bottom" && dy < 0));

      if (
        movingTowardFace &&
        prev.x >= rect.minX &&
        prev.x <= rect.maxX &&
        ((side === "top" && targetY >= prev.y) ||
          (side === "bottom" && targetY <= prev.y))
      ) {
        projectedStop = {
          x: prev.x,
          y: targetY,
        };
      }
    }

    if (projectedStop) {
      if (dist(result[result.length - 1], projectedStop) > 0.5) {
        result.push(projectedStop);
      }
      return result.length >= 2 ? result : null;
    }

    const currentInside = inPixelRect(current, rect);
    const intersection = getFirstRectIntersection(prev, current, rect);

    if (currentInside || (intersection && !inPixelRect(prev, rect))) {
      const clippedPoint = intersection || current;
      if (dist(result[result.length - 1], clippedPoint) > 0.5) {
        result.push(clippedPoint);
      }
      return result.length >= 2 ? result : null;
    }

    result.push(current);
  }

  return result.length >= 2 ? result : null;
}

function buildSubPath(metrics: PolylineMetrics, startFrac: number, endFrac: number) {
  const startDistance = clamp(startFrac, 0, 1) * metrics.totalLength;
  const endDistance = clamp(endFrac, 0, 1) * metrics.totalLength;

  if (endDistance - startDistance <= 0.5) return null;

  const result: Pt[] = [samplePointAtDistance(metrics, startDistance)];

  for (let i = 1; i < metrics.points.length - 1; i += 1) {
    if (metrics.lengths[i] > startDistance && metrics.lengths[i] < endDistance) {
      result.push(metrics.points[i]);
    }
  }

  result.push(samplePointAtDistance(metrics, endDistance));
  return result.length >= 2 ? result : null;
}

function strokePolyline(
  ctx: CanvasRenderingContext2D,
  points: Pt[],
  lineWidth: number,
  strokeStyle: string | CanvasGradient,
  alpha: number,
  shadowBlur = 0,
) {
  if (points.length < 2 || alpha <= 0.001 || lineWidth <= 0.001) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = strokeStyle;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowColor = typeof strokeStyle === "string" ? strokeStyle : "#64FFDA";
  ctx.stroke();
  ctx.restore();
}

function drawCircuitStroke(
  ctx: CanvasRenderingContext2D,
  metrics: PolylineMetrics,
  circuit: Circuit,
  now: number,
  reachScale = 1,
) {
  const elapsed = Math.max(0, (now - circuit.createdAt) / 1000);
  if (elapsed >= circuit.totalDuration) return;

  const reachDuration =
    circuit.kind === "bus"
      ? circuit.drawDuration * Math.max(reachScale, 0.05)
      : circuit.drawDuration + circuit.holdDuration;
  const moveProgress = clamp(elapsed / Math.max(reachDuration, 0.001), 0, 1);
  const fadeStart =
    circuit.kind === "bus"
      ? circuit.drawDuration + circuit.holdDuration
      : circuit.drawDuration + circuit.holdDuration;
  const fadeProgress = clamp(
    (elapsed - fadeStart) / Math.max(circuit.fadeDuration, 0.001),
    0,
    1,
  );
  const trailTarget = circuit.kind === "bus" ? 0.38 : 0.26;
  const trailWindow =
    circuit.kind === "bus"
      ? trailTarget
      : trailTarget *
        clamp(elapsed / Math.max(circuit.drawDuration, 0.001), 0, 1) *
        (1 - fadeProgress);
  const headWindow = circuit.kind === "bus" ? 0.075 : 0.055;
  const startFrac =
    circuit.kind === "bus"
      ? moveProgress < 0.999
        ? 0
        : clamp(fadeProgress, 0, 1)
      : Math.max(0, moveProgress - trailWindow);
  const headStartFrac = Math.max(startFrac, moveProgress - headWindow);

  const trailPoints = buildSubPath(metrics, startFrac, moveProgress);
  if (!trailPoints) return;

  const trailAlphaBase = circuit.kind === "bus" ? 0.48 : 0.36;
  const trailColor = circuit.kind === "bus" ? "#3FAF9D" : "#2F8D80";
  strokePolyline(
    ctx,
    trailPoints,
    circuit.strokeWidth,
    trailColor,
    trailAlphaBase * (1 - fadeProgress * 0.9),
    circuit.kind === "bus" ? 3 : 2,
  );

  const headPoints = buildSubPath(metrics, headStartFrac, moveProgress);
  if (!headPoints) return;

  if (circuit.kind === "bus") {
    const headStart = headPoints[0];
    const headEnd = headPoints[headPoints.length - 1];
    const gradient = ctx.createLinearGradient(headStart.x, headStart.y, headEnd.x, headEnd.y);
    gradient.addColorStop(0, "rgba(76, 173, 156, 0)");
    gradient.addColorStop(0.55, "rgba(92, 196, 178, 0.28)");
    gradient.addColorStop(1, "rgba(171, 245, 231, 0.82)");
    strokePolyline(
      ctx,
      headPoints,
      circuit.strokeWidth + 0.55,
      gradient,
      0.9 - fadeProgress * 0.82,
      5,
    );
    return;
  }

  strokePolyline(
    ctx,
    headPoints,
    circuit.strokeWidth + 0.18,
    "#8FD8CB",
    0.62 - fadeProgress * 0.48,
    2,
  );
}

function chooseWaypoint(
  start: Anchor,
  end: Anchor,
  innerAnchors: Anchor[],
  ringAnchors: Anchor[],
  layout: Layout,
) {
  const ringCandidates = ringAnchors.filter(
    (anchor) => manhattan(start, anchor) >= 6 && manhattan(end, anchor) >= 6,
  );
  const baseCandidates = innerAnchors.filter(
    (anchor) =>
      manhattan(start, anchor) >= 6 &&
      manhattan(end, anchor) >= 6 &&
      !inRect(anchor, layout.titleCore) &&
      !isInsideTitleInterior(anchor, layout),
  );

  const preferRing = ringCandidates.length > 0 && Math.random() < 0.2;
  const pool = preferRing ? ringCandidates : baseCandidates;

  if (pool.length === 0) return null;
  return pickRandom(pool);
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

type RouteOptions = {
  kind: LineKind;
  maxTurns: number;
  turnPenalty: number;
  busPoints?: Set<string>;
  preferBus?: boolean;
};

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

      const nextEdgeKey = edgeKey(current.point, nextPoint);
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

      if (occupiedEdges.has(nextEdgeKey)) {
        nextCost += 8;
      }

      const nextPointKey = pointKey(nextPoint.gx, nextPoint.gy);
      const isBusPoint = options.busPoints?.has(nextPointKey);
      const currentDist = manhattan(current.point, end);
      const nextDist = manhattan(nextPoint, end);

      if (occupiedPoints.has(nextPointKey) && !isEnd && !isBusPoint) {
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

function countKind(circuits: Circuit[], kind: LineKind) {
  return circuits.filter((circuit) => circuit.kind === kind).length;
}

function getSideRingAnchors(ringAnchors: Anchor[], side: EdgeSide) {
  return ringAnchors.filter((anchor) => anchor.side === side);
}

function buildBusJoinAnchors(circuits: Circuit[], layout: Layout) {
  const anchors: Anchor[] = [];

  circuits
    .filter((circuit) => circuit.kind === "bus")
    .forEach((bus) => {
      const candidates = bus.gridPts.filter((point, idx) => {
        if (idx < 3 || idx > bus.gridPts.length - 3) return false;
        if (inRect(point, layout.titleCore) || isInsideTitleInterior(point, layout)) {
          return false;
        }
        return idx % 2 === 0;
      });

      candidates.slice(-BUS_JOIN_POINT_LIMIT).forEach((point) => {
        anchors.push({
          gx: point.gx,
          gy: point.gy,
          kind: "inner",
          side: bus.side,
        });
      });
    });

  return anchors;
}

function buildBusPointSet(circuits: Circuit[]) {
  const points = new Set<string>();

  circuits
    .filter((circuit) => circuit.kind === "bus")
    .forEach((bus) => {
      bus.gridPts.forEach((point) => {
        points.add(pointKey(point.gx, point.gy));
      });
    });

  return points;
}

type SpawnCache = {
  occupiedEdges: Set<string>;
  occupiedPoints: Set<string>;
  regionCounts: Map<string, number>;
  busPoints: Set<string>;
};

function buildSpawnCache(circuits: Circuit[], layout: Layout): SpawnCache {
  return {
    ...buildOccupancy(circuits),
    regionCounts: getRegionCounts(circuits, layout),
    busPoints: buildBusPointSet(circuits),
  };
}

function createEmptySpawnCache(): SpawnCache {
  return {
    occupiedEdges: new Set(),
    occupiedPoints: new Set(),
    regionCounts: new Map(),
    busPoints: new Set(),
  };
}

function cloneSpawnCache(cache: SpawnCache): SpawnCache {
  return {
    occupiedEdges: new Set(cache.occupiedEdges),
    occupiedPoints: new Set(cache.occupiedPoints),
    regionCounts: new Map(cache.regionCounts),
    busPoints: new Set(cache.busPoints),
  };
}

function addRouteToOccupancy(
  route: GridPt[],
  occupiedEdges: Set<string>,
  occupiedPoints: Set<string>,
) {
  route.forEach((point, idx) => {
    occupiedPoints.add(pointKey(point.gx, point.gy));
    if (idx > 0) {
      occupiedEdges.add(edgeKey(route[idx - 1], point));
    }
  });
}

function applyCircuitToSpawnCache(cache: SpawnCache, circuit: Circuit, layout: Layout) {
  addRouteToOccupancy(circuit.gridPts, cache.occupiedEdges, cache.occupiedPoints);

  const regionKey = getRegionKey(circuit.gridPts, layout);
  cache.regionCounts.set(regionKey, (cache.regionCounts.get(regionKey) || 0) + 1);

  if (circuit.kind === "bus") {
    circuit.gridPts.forEach((point) => {
      cache.busPoints.add(pointKey(point.gx, point.gy));
    });
  }
}

function pickTraceBusLaneSide(
  route: GridPt[],
  traceIndex: number,
  bus: Circuit,
  busIndex: number,
  layout: Layout,
) {
  const incomingPoint = toPixel(route[traceIndex - 1], layout);
  const busTail = bus.gridPts.slice(busIndex, Math.min(busIndex + 3, bus.gridPts.length));
  const bundleOffsets = bus.busBundleOffsets ?? layout.busBundleOffsets;
  const leftStart = buildOffsetPoints(busTail, layout, bundleOffsets[0])[0];
  const rightStart = buildOffsetPoints(
    busTail,
    layout,
    bundleOffsets[bundleOffsets.length - 1],
  )[0];

  if (!leftStart) return 1;
  if (!rightStart) return -1;

  return dist(incomingPoint, leftStart) <= dist(incomingPoint, rightStart) ? -1 : 1;
}

function attachTraceToBus(
  route: GridPt[],
  circuits: Circuit[],
  layout: Layout,
  traceSide: EdgeSide,
) {
  const buses = circuits.filter((circuit) => circuit.kind === "bus");
  let bestMatch:
    | TraceBusJoin
    | undefined;

  buses.forEach((bus) => {
    if (!isCompatibleBusSide(traceSide, bus.side)) return;
    if (countBusAttachments(circuits, bus.id) >= 3) return;

    const pointToIndex = new Map<string, number>();
    bus.gridPts.forEach((point, idx) => {
      pointToIndex.set(pointKey(point.gx, point.gy), idx);
    });

    for (let i = Math.max(2, Math.floor(route.length * 0.45)); i < route.length - 1; i += 1) {
      const matchIndex = pointToIndex.get(pointKey(route[i].gx, route[i].gy));
      if (matchIndex === undefined) continue;
      if (matchIndex >= bus.gridPts.length - 1) continue;

      if (
        !bestMatch ||
        i < bestMatch.traceIndex ||
        (i === bestMatch.traceIndex && matchIndex < bestMatch.busIndex)
      ) {
        bestMatch = {
          traceIndex: i,
          busIndex: matchIndex,
          bus,
          laneSide: pickTraceBusLaneSide(route, i, bus, matchIndex, layout),
          route: [
            ...route.slice(0, i),
            ...bus.gridPts.slice(matchIndex),
          ],
        };
      }
      break;
    }
  });

  return bestMatch;
}

function getSegmentNormal(a: Pt, b: Pt) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: -dy / length,
    y: dx / length,
  };
}

function intersectLines(a1: Pt, a2: Pt, b1: Pt, b2: Pt) {
  const aDx = a2.x - a1.x;
  const aDy = a2.y - a1.y;
  const bDx = b2.x - b1.x;
  const bDy = b2.y - b1.y;
  const denom = aDx * bDy - aDy * bDx;

  if (Math.abs(denom) < 0.001) {
    return {
      x: (a2.x + b1.x) / 2,
      y: (a2.y + b1.y) / 2,
    };
  }

  const t = ((b1.x - a1.x) * bDy - (b1.y - a1.y) * bDx) / denom;
  return {
    x: a1.x + aDx * t,
    y: a1.y + aDy * t,
  };
}

function buildOffsetPoints(points: GridPt[], layout: Layout, offset: number) {
  const pxPts = points.map((point) => toPixel(point, layout));
  if (pxPts.length < 2 || Math.abs(offset) < 0.001) {
    return pxPts;
  }

  const offsetPts: Pt[] = [];

  for (let i = 0; i < pxPts.length; i += 1) {
    const current = pxPts[i];

    if (i === 0) {
      const next = pxPts[i + 1];
      const normal = getSegmentNormal(current, next);
      offsetPts.push({
        x: current.x + normal.x * offset,
        y: current.y + normal.y * offset,
      });
      continue;
    }

    if (i === pxPts.length - 1) {
      const prev = pxPts[i - 1];
      const normal = getSegmentNormal(prev, current);
      offsetPts.push({
        x: current.x + normal.x * offset,
        y: current.y + normal.y * offset,
      });
      continue;
    }

    const prev = pxPts[i - 1];
    const next = pxPts[i + 1];
    const prevNormal = getSegmentNormal(prev, current);
    const nextNormal = getSegmentNormal(current, next);

    const prevOffsetStart = {
      x: prev.x + prevNormal.x * offset,
      y: prev.y + prevNormal.y * offset,
    };
    const prevOffsetEnd = {
      x: current.x + prevNormal.x * offset,
      y: current.y + prevNormal.y * offset,
    };
    const nextOffsetStart = {
      x: current.x + nextNormal.x * offset,
      y: current.y + nextNormal.y * offset,
    };
    const nextOffsetEnd = {
      x: next.x + nextNormal.x * offset,
      y: next.y + nextNormal.y * offset,
    };

    offsetPts.push(
      intersectLines(prevOffsetStart, prevOffsetEnd, nextOffsetStart, nextOffsetEnd),
    );
  }

  return offsetPts;
}

function buildOffsetPathData(points: GridPt[], layout: Layout, offset: number) {
  return buildPathString(buildOffsetPoints(points, layout, offset));
}

function buildJoinedTraceRenderPath(
  join: TraceBusJoin,
  layout: Layout,
  laneRank: number,
) {
  const preJoinPx = join.route
    .slice(0, join.traceIndex)
    .map((point) => toPixel(point, layout));
  const busTail = join.bus.gridPts.slice(join.busIndex);
  const bundleOffsets = join.bus.busBundleOffsets ?? layout.busBundleOffsets;
  const laneOffset =
    getBusSideBaseOffset(bundleOffsets, join.laneSide) +
    join.laneSide * laneRank * BUS_LANE_STEP;
  const offsetTailPts = buildOffsetPoints(busTail, layout, laneOffset);

  if (preJoinPx.length === 0 || offsetTailPts.length === 0) {
    return buildPathString(offsetTailPts);
  }

  return buildPathString([...preJoinPx, ...offsetTailPts]);
}

function countEdgeUsage(circuits: Circuit[], layout: Layout) {
  const counts: Record<EdgeSide, number> = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  circuits.forEach((circuit) => {
    const start = circuit.gridPts[0];
    if (!start) return;

    if (start.gy === layout.routeMinY) counts.top += 1;
    else if (start.gy === layout.routeMaxY) counts.bottom += 1;
    else if (start.gx === layout.routeMinX) counts.left += 1;
    else if (start.gx === layout.routeMaxX) counts.right += 1;
  });

  return counts;
}

function chooseAnchorsWithQuota(
  existingCircuits: Circuit[],
  layout: Layout,
  edgeAnchors: Anchor[],
  targetAnchors: Anchor[],
) {
  const sideCounts = countEdgeUsage(existingCircuits, layout);
  const sideOrder = (Object.entries(sideCounts) as Array<[EdgeSide, number]>)
    .sort((a, b) => a[1] - b[1])
    .map(([side]) => side);

  const preferredSide =
    sideOrder.find((side) => sideCounts[side] < EDGE_SIDE_TARGET) || sideOrder[0];

  const preferredStarts = edgeAnchors.filter((anchor) => anchor.side === preferredSide);
  const fallbackStarts = edgeAnchors.filter((anchor) => anchor.side !== preferredSide);
  const startPool =
    preferredStarts.length > 0 && Math.random() < 0.85
      ? preferredStarts
      : [...preferredStarts, ...fallbackStarts];

  const start = pickRandom(startPool);
  const filteredTargets = targetAnchors.filter(
    (anchor) =>
      manhattan(start, anchor) >= 10 &&
      (anchor.gx !== start.gx || anchor.gy !== start.gy),
  );

  return {
    start,
    end:
      filteredTargets.length > 0
        ? pickRandom(filteredTargets)
        : pickRandom(targetAnchors),
  };
}

function chooseBusAnchors(
  existingCircuits: Circuit[],
  layout: Layout,
  edgeAnchors: Anchor[],
  ringAnchors: Anchor[],
) {
  const activeBusSides = new Set(
    existingCircuits
      .filter((circuit) => circuit.kind === "bus")
      .map((circuit) => circuit.side),
  );
  const sideCounts = countEdgeUsage(existingCircuits, layout);
  const sideOrder = (Object.entries(sideCounts) as Array<[EdgeSide, number]>)
    .sort((a, b) => a[1] - b[1])
    .map(([side]) => side)
    .filter((side) => !activeBusSides.has(side));

  const side = sideOrder[0];
  if (!side) return null;

  const starts = edgeAnchors.filter((anchor) => anchor.side === side);
  if (starts.length === 0) return null;

  const start = pickRandom(starts);
  const ends = getSideRingAnchors(ringAnchors, side).filter(
    (anchor) => manhattan(anchor, start) >= 8,
  );

  if (ends.length === 0) return null;

  return {
    side,
    start,
    end: pickRandom(ends),
  };
}

function chooseTraceAnchors(
  existingCircuits: Circuit[],
  layout: Layout,
  edgeAnchors: Anchor[],
  ringAnchors: Anchor[],
) {
  void layout;
  return chooseAnchorsWithQuota(existingCircuits, layout, edgeAnchors, ringAnchors);
}

function createCircuit(
  id: string,
  kind: LineKind,
  now: number,
  existingCircuits: Circuit[],
  spawnCache: SpawnCache,
  layout: Layout,
  edgeAnchors: Anchor[],
  innerAnchors: Anchor[],
  ringAnchors: Anchor[],
) {
  const { occupiedEdges, occupiedPoints, regionCounts, busPoints } = spawnCache;

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const selection =
      kind === "bus"
        ? chooseBusAnchors(existingCircuits, layout, edgeAnchors, ringAnchors)
        : chooseTraceAnchors(existingCircuits, layout, edgeAnchors, ringAnchors);

    if (!selection) continue;

    const { start, end } = selection;
    const side = start.side;
    if (!side) continue;
    const shouldTryJoinBus =
      kind === "trace" &&
      busPoints.size > 0 &&
      Math.random() < 0.35;

    let route: GridPt[] | null = null;

    if (kind === "trace" && Math.random() < 0.68) {
      const waypoint = chooseWaypoint(start, end, innerAnchors, ringAnchors, layout);
      if (waypoint) {
        const firstLeg = findRoute(start, waypoint, occupiedEdges, occupiedPoints, layout, {
          kind: "trace",
          maxTurns: TRACE_MAX_TURNS,
          turnPenalty: 0.42,
          busPoints,
          preferBus: shouldTryJoinBus,
        });
        if (firstLeg && firstLeg.length >= 3) {
          const stagedCache = cloneSpawnCache(spawnCache);
          addRouteToOccupancy(firstLeg, stagedCache.occupiedEdges, stagedCache.occupiedPoints);
          const secondLeg = findRoute(
            waypoint,
            end,
            stagedCache.occupiedEdges,
            stagedCache.occupiedPoints,
            layout,
            {
              kind: "trace",
              maxTurns: TRACE_MAX_TURNS,
              turnPenalty: 0.42,
              busPoints,
              preferBus: shouldTryJoinBus,
            },
          );

          if (secondLeg && secondLeg.length >= 3) {
            route = mergeRoutes(firstLeg, secondLeg);
          }
        }
      }
    }

    if (!route) {
      route = findRoute(start, end, occupiedEdges, occupiedPoints, layout, {
        kind,
        maxTurns: kind === "bus" ? BUS_MAX_TURNS : TRACE_MAX_TURNS,
        turnPenalty: kind === "bus" ? 0.78 : 0.42,
        busPoints: kind === "trace" ? busPoints : undefined,
        preferBus: shouldTryJoinBus,
      });
    }

    let traceJoin: TraceBusJoin | undefined;

    if (!route || route.length < 5) continue;
    if (kind === "trace" && shouldTryJoinBus) {
      traceJoin = attachTraceToBus(route, existingCircuits, layout, side);
      if (traceJoin) {
        route = traceJoin.route;
      }
    }
    if (hasSelfOverlap(route)) continue;

    const turnCount = countTurns(route);
    if (turnCount < (kind === "bus" ? BUS_MIN_TURNS : TRACE_MIN_TURNS)) continue;
    if (turnCount > (kind === "bus" ? BUS_MAX_TURNS : TRACE_MAX_TURNS)) continue;

    const regionKey = getRegionKey(route, layout);
    const regionCount = regionCounts.get(regionKey) || 0;
    if (kind === "trace" && attempt < 18 && regionCount >= MAX_LINES_PER_REGION) continue;

    const laneRank =
      kind === "trace" && traceJoin
        ? countBusLaneAttachments(
            existingCircuits,
            traceJoin.bus.id,
            traceJoin.laneSide,
          ) + 1
        : 0;
    const { d, nodes } = buildPathData(route, layout, kind !== "bus" && !traceJoin);
    const defaultDrawDuration = kind === "bus" ? rand(2.6, 3.8) : rand(1.4, 2.4);
    const defaultHoldDuration = kind === "bus" ? rand(3.1, 4.6) : rand(1.2, 2.8);
    const defaultFadeDuration = kind === "bus" ? rand(1.4, 2.2) : rand(0.9, 1.7);
    const linkedLifecycle =
      kind === "trace" && traceJoin
        ? resolveLinkedLifecycle(traceJoin.bus, now, defaultDrawDuration)
        : null;
    const drawDuration = linkedLifecycle?.drawDuration ?? defaultDrawDuration;
    const holdDuration = linkedLifecycle?.holdDuration ?? defaultHoldDuration;
    const fadeDuration = linkedLifecycle?.fadeDuration ?? defaultFadeDuration;
    const baseCircuit = {
      id,
      kind,
      side,
      createdAt: now,
      d,
      gridPts: route,
      nodes,
      busBundleOffsets: kind === "bus" ? getBusBundleOffsets(layout.viewWidth) : undefined,
      busJoin:
        kind === "trace" && traceJoin
          ? {
              busId: traceJoin.bus.id,
              busIndex: traceJoin.busIndex,
              traceIndex: traceJoin.traceIndex,
              laneSide: traceJoin.laneSide,
              laneRank,
            }
          : undefined,
      drawDuration,
      holdDuration,
      fadeDuration,
      totalDuration: drawDuration + holdDuration + fadeDuration,
      strokeWidth: kind === "bus" ? rand(1.45, 1.8) : rand(0.9, 1.15),
    };

    return {
      ...baseCircuit,
      renderPaths:
        kind === "trace" && traceJoin
          ? [buildJoinedTraceRenderPath(traceJoin, layout, laneRank)]
          : buildRenderablePaths(baseCircuit, layout),
    };
  }

  return null;
}

export function CircuitLines({
  titleBounds,
  active = true,
}: {
  titleBounds?: TitleBounds | null;
  active?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 720,
  }));
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    typeof document === "undefined" ? true : !document.hidden,
  );
  const [isResizing, setIsResizing] = useState(false);
  const circuitsRef = useRef<Circuit[]>([]);
  const spawnCacheRef = useRef<SpawnCache>(createEmptySpawnCache());
  const circuitRenderMetricsRef = useRef<Map<string, RenderStrokeMetrics[]>>(new Map());
  const nextIdRef = useRef(0);
  const removalTimersRef = useRef<Map<string, number>>(new Map());
  const spawnLoopTimerRef = useRef<number | null>(null);
  const refillTimerRef = useRef<number | null>(null);
  const resizeTimerRef = useRef<number | null>(null);

  const layout = useMemo(
    () => buildLayout(size.width, size.height, titleBounds),
    [size.width, size.height, titleBounds],
  );
  const layoutResetKey = useMemo(
    () =>
      [
        layout.viewWidth,
        layout.viewHeight,
        layout.titleCore.minX,
        layout.titleCore.maxX,
        layout.titleCore.minY,
        layout.titleCore.maxY,
        layout.titleRing.minX,
        layout.titleRing.maxX,
        layout.titleRing.minY,
        layout.titleRing.maxY,
      ].join(":"),
    [layout],
  );
  const edgeAnchors = useMemo(() => buildEdgeAnchors(layout), [layout]);
  const innerAnchors = useMemo(() => buildInnerAnchors(layout), [layout]);
  const ringAnchors = useMemo(() => buildTitleRingAnchors(layout), [layout]);
  const lineTargets = useMemo(
    () => getLineTargets(size.width, size.height),
    [size.width, size.height],
  );
  const isRunning = active && isDocumentVisible && !isResizing;
  const syncAllRenderMetrics = useCallback(
    (nextCircuits: Circuit[]) => {
      circuitRenderMetricsRef.current = buildCircuitRenderMetricsMap(
        buildCircuitRenderPointMap(nextCircuits, layout),
      );
    },
    [layout],
  );
  const syncPartialRenderMetrics = useCallback(
    (nextCircuits: Circuit[], changedCircuits: Circuit[]) => {
      circuitRenderMetricsRef.current = updateCircuitRenderMetricsMap(
        circuitRenderMetricsRef.current,
        nextCircuits,
        changedCircuits,
        layout,
      );
    },
    [layout],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSize({
        width: Math.max(1, Math.round(rect.width)),
        height: Math.max(1, Math.round(rect.height)),
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(() => {
    const handleResizeStart = () => {
      setIsResizing(true);
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = window.setTimeout(() => {
        setIsResizing(false);
        resizeTimerRef.current = null;
      }, 160);
    };

    window.addEventListener("resize", handleResizeStart);
    return () => {
      window.removeEventListener("resize", handleResizeStart);
      if (resizeTimerRef.current) {
        window.clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  const clearTimers = useCallback(() => {
    removalTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    removalTimersRef.current.clear();
    if (spawnLoopTimerRef.current) {
      window.clearTimeout(spawnLoopTimerRef.current);
      spawnLoopTimerRef.current = null;
    }
    if (refillTimerRef.current) {
      window.clearTimeout(refillTimerRef.current);
      refillTimerRef.current = null;
    }
  }, []);

  const removeCircuit = useCallback(
    (id: string) => {
      const idsToRemove = new Set<string>([
        id,
        ...circuitsRef.current
          .filter((circuit) => circuit.busJoin?.busId === id)
          .map((circuit) => circuit.id),
      ]);

      idsToRemove.forEach((targetId) => {
        const timer = removalTimersRef.current.get(targetId);
        if (timer) {
          window.clearTimeout(timer);
          removalTimersRef.current.delete(targetId);
        }
      });

      const removedCircuits = circuitsRef.current.filter((circuit) => idsToRemove.has(circuit.id));
      const next = circuitsRef.current.filter((circuit) => !idsToRemove.has(circuit.id));
      circuitsRef.current = next;
      spawnCacheRef.current = buildSpawnCache(next, layout);
      syncPartialRenderMetrics(next, removedCircuits);
    },
    [layout, syncPartialRenderMetrics],
  );

  const spawnCircuit = useCallback(
    (maxCount = MAX_ACTIVE_LINES) => {
      if (circuitsRef.current.length >= maxCount) return false;
      const now = Date.now();

      const busCount = countKind(circuitsRef.current, "bus");
      const desiredKind: LineKind =
        busCount < MIN_BUS_LINES
          ? "bus"
          : busCount < MAX_BUS_LINES && Math.random() < 0.09
            ? "bus"
            : "trace";

      const circuit = createCircuit(
        `c-${nextIdRef.current}`,
        desiredKind,
        now,
        circuitsRef.current,
        spawnCacheRef.current,
        layout,
        edgeAnchors,
        innerAnchors,
        ringAnchors,
      );

      const fallbackCircuit =
        circuit ||
        createCircuit(
          `c-${nextIdRef.current}`,
          desiredKind === "bus" ? "trace" : "bus",
          now,
          circuitsRef.current,
          spawnCacheRef.current,
          layout,
          edgeAnchors,
          innerAnchors,
          ringAnchors,
        );

      if (!fallbackCircuit) return false;

      nextIdRef.current += 1;
      const next = [...circuitsRef.current, fallbackCircuit];
      circuitsRef.current = next;
      applyCircuitToSpawnCache(spawnCacheRef.current, fallbackCircuit, layout);
      syncPartialRenderMetrics(next, [fallbackCircuit]);

      if (!fallbackCircuit.busJoin) {
        const removalTimer = window.setTimeout(() => {
          removeCircuit(fallbackCircuit.id);
        }, fallbackCircuit.totalDuration * 1000);

        removalTimersRef.current.set(fallbackCircuit.id, removalTimer);
      }
      return true;
    },
    [edgeAnchors, innerAnchors, layout, removeCircuit, ringAnchors, syncPartialRenderMetrics],
  );

  const scheduleRefill = useCallback(
    (targetCount: number, delay = MIN_FILL_INTERVAL_MS) => {
      if (!isRunning) return;
      if (refillTimerRef.current) return;

      refillTimerRef.current = window.setTimeout(() => {
        refillTimerRef.current = null;
        if (!isRunning) return;
        if (circuitsRef.current.length >= targetCount) return;

        const spawned = spawnCircuit(targetCount);
        if (!spawned) return;

        if (circuitsRef.current.length < targetCount) {
          scheduleRefill(targetCount, MIN_FILL_INTERVAL_MS);
        }
      }, delay);
    },
    [isRunning, spawnCircuit],
  );

  useEffect(() => {
    if (!isRunning) {
      clearTimers();
      circuitsRef.current = [];
      spawnCacheRef.current = buildSpawnCache([], layout);
      circuitRenderMetricsRef.current = new Map();
      return;
    }

    clearTimers();
    circuitsRef.current = [];
    spawnCacheRef.current = buildSpawnCache([], layout);
    circuitRenderMetricsRef.current = new Map();
    scheduleRefill(lineTargets.initial, INITIAL_SPAWN_INTERVAL_MS);

    return () => {
      clearTimers();
    };
  }, [clearTimers, isRunning, layout, layoutResetKey, lineTargets.initial, scheduleRefill]);

  useEffect(() => {
    if (!isRunning) return;
    let cancelled = false;

    const scheduleNextSpawn = () => {
      const nextDelay = rand(NORMAL_SPAWN_INTERVAL_MIN_MS, NORMAL_SPAWN_INTERVAL_MAX_MS);
      spawnLoopTimerRef.current = window.setTimeout(() => {
        if (cancelled) return;

        const count = circuitsRef.current.length;
        if (count < lineTargets.min) {
          scheduleRefill(lineTargets.min);
        } else if (count < lineTargets.max && Math.random() < 0.82) {
          spawnCircuit(lineTargets.max);
        }

        scheduleNextSpawn();
      }, nextDelay);
    };

    scheduleNextSpawn();

    return () => {
      cancelled = true;
      if (spawnLoopTimerRef.current) {
        window.clearTimeout(spawnLoopTimerRef.current);
      }
    };
  }, [isRunning, lineTargets.max, lineTargets.min, scheduleRefill, spawnCircuit]);

  useEffect(() => {
    if (!isRunning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
    const width = Math.max(1, Math.round(size.width));
    const height = Math.max(1, Math.round(size.height));

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    let frameId = 0;

    const draw = () => {
      const now = Date.now();
      context.clearRect(0, 0, width, height);

      circuitsRef.current.forEach((circuit) => {
        const strokes = circuitRenderMetricsRef.current.get(circuit.id) || [];
        strokes.forEach((stroke) => {
          drawCircuitStroke(context, stroke.metrics, circuit, now, stroke.reachScale);
        });
      });

      frameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isRunning, size.height, size.width]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
