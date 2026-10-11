import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  BOUNCE_DAMP,
  CARD_H,
  CARD_W,
  CASCADE_DEBUG_VERSION,
  COLUMN_BOTTOM_LIMIT,
  COLUMN_X,
  CUES,
  DEAL_MODE,
  DEAL_MODE_LABEL,
  DEAL_STOCK_CARDS,
  DEAL_TABLEAU_CARDS,
  DECK_SIZE,
  DOUBLE_CLICK_SLOP,
  DOUBLE_CLICK_WINDOW,
  DRAG_THRESHOLD,
  FACE_DOWN_OFFSET,
  FACE_UP_OFFSET,
  FACE_UP_OFFSET_MIN,
  FLOOR_Y,
  FOUNDATION_COUNT,
  FOUNDATION_X,
  GRAVITY,
  HOWTO_BACK_LABEL,
  HUD_H,
  HUD_ITEMS,
  HUD_Y,
  LAUNCH_INTERVAL,
  LAUNCH_VX_MAX,
  LAUNCH_VX_MIN,
  LAUNCH_VY,
  MENU_BACK,
  MENU_BINDINGS,
  MENU_CONFIRM,
  MENU_DOWN,
  MENU_UP,
  RANK_MAX,
  RANK_MIN,
  STAGE_H,
  STAGE_W,
  STOCK_X,
  SUITS,
  TABLEAU_COLUMNS,
  TABLEAU_Y,
  TAGLINE_TEXT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TOP_ROW_Y,
  TURN_COUNT,
  WASTE_FAN,
  WASTE_X,
  WIN_TEXT,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";

export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}

export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}

export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}

export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}

export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}

export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}

type Color = "red" | "black";
type CardSnapshot = CardState & { readonly color: Color };
type Rect = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
};
type Snapshot = {
  readonly version: number;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly dealMode: string;
  readonly turnCount: number;
  readonly dealModeLabel: string;
  readonly muted: boolean;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly stock: readonly CardSnapshot[];
  readonly waste: readonly CardSnapshot[];
  readonly wasteSets: readonly number[];
  readonly wasteVisibleCount: number;
  readonly foundations: readonly (readonly CardSnapshot[])[];
  readonly tableau: readonly (readonly CardSnapshot[])[];
  readonly drag:
    | (Omit<DragState, "cards"> & { readonly cards: readonly CardSnapshot[] })
    | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly simTime: number;
};

export interface CascadeDebugApi {
  readonly version: number;
  reset(state: DeepReadonly<CascadeState>): CascadeState;
  snapshot(state: DeepReadonly<CascadeState>): Snapshot;
  reconcile(state: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(state: DeepReadonly<CascadeState>, index: number): Rect | null;
  setScreen(state: DeepReadonly<CascadeState>, screen: Screen): CascadeState;
  setMenuIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  setTitleIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  addCard(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
    suit: Suit,
    rank: number,
    faceUp: boolean,
  ): CascadeState;
  removeCard(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    state: DeepReadonly<CascadeState>,
    id: number,
    faceUp: boolean,
  ): CascadeState;
  clearPile(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
  ): CascadeState;
  clearTable(state: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(state: DeepReadonly<CascadeState>, count: number): CascadeState;
  clearWasteSets(state: DeepReadonly<CascadeState>): CascadeState;
  deal(state: DeepReadonly<CascadeState>): CascadeState;
  turnStock(state: DeepReadonly<CascadeState>): CascadeState;
  move(
    state: DeepReadonly<CascadeState>,
    fromPile: PileKind,
    fromIndex: number,
    fromRow: number,
    toPile: PileKind,
    toIndex: number,
  ): [CascadeState, boolean];
  autoMove(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
  ): [CascadeState, boolean];
  pointerDown(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  setAutoFlip(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setWinDetect(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setLaunching(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setTrailPainting(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  addFlyer(
    state: DeepReadonly<CascadeState>,
    suit: Suit,
    rank: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    state: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    state: DeepReadonly<CascadeState>,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(state: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(
    state: DeepReadonly<CascadeState>,
    seconds: number,
  ): CascadeState;
  clearTrail(state: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}

export const BACKGROUND = "#1f6f5b";

let trailCanvas: HTMLCanvasElement | OffscreenCanvas | null = null;
let trailCtx:
  CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

const TABLE = "#1f6f5b";
const TABLE_DARK = "#15523f";
const TABLE_LINE = "rgba(255,255,255,0.18)";
const CARD_FACE = "#fffaf0";
const CARD_EDGE = "#24352f";
const RED = "#b52435";
const BLACK = "#1c2524";
const GOLD = "#f1c15b";
const PANEL = "rgba(8, 30, 26, 0.74)";

function copyCard(card: DeepReadonly<CardState>): CardState {
  return {
    id: card.id,
    suit: card.suit,
    rank: card.rank,
    faceUp: card.faceUp,
  };
}

function cloneState(state: DeepReadonly<CascadeState>): CascadeState {
  return {
    screen: state.screen,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    stock: state.stock.map(copyCard),
    waste: state.waste.map(copyCard),
    wasteSets: [...state.wasteSets],
    foundations: state.foundations.map((pile) => pile.map(copyCard)),
    tableau: state.tableau.map((pile) => pile.map(copyCard)),
    drag:
      state.drag === null
        ? null
        : {
            cards: state.drag.cards.map(copyCard),
            fromPile: state.drag.fromPile,
            fromIndex: state.drag.fromIndex,
            x: state.drag.x,
            y: state.drag.y,
          },
    dropTarget:
      state.dropTarget === null
        ? null
        : { pile: state.dropTarget.pile, index: state.dropTarget.index },
    pointer: {
      x: state.pointer.x,
      y: state.pointer.y,
      down: state.pointer.down,
    },
    lastPress:
      state.lastPress === null
        ? null
        : {
            x: state.lastPress.x,
            y: state.lastPress.y,
            at: state.lastPress.at,
          },
    autoFlip: state.autoFlip,
    winDetect: state.winDetect,
    launching: state.launching,
    trailPainting: state.trailPainting,
    launchClock: state.launchClock,
    launched: state.launched,
    flyers: state.flyers.map((flyer) => ({ ...flyer })),
    cascadeDone: state.cascadeDone,
    trailStamps: state.trailStamps,
    nextId: state.nextId,
    simTime: state.simTime,
    muted: state.muted,
  };
}

function initialState(muted = false): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau: Array.from({ length: TABLEAU_COLUMNS }, () => []),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}

function rankName(rank: number): string {
  if (rank === 1) return "A";
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return String(rank);
}

function suitGlyph(suit: Suit): string {
  switch (suit) {
    case "spades":
      return "S";
    case "hearts":
      return "H";
    case "diamonds":
      return "D";
    case "clubs":
      return "C";
  }
}

function colorOf(suit: Suit): Color {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

function assertWhole(value: number, name: string): void {
  if (!Number.isInteger(value))
    throw new Error(`${name} must be a whole number`);
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite`);
}

function assertPile(pile: PileKind, index: number): void {
  assertWhole(index, "index");
  if (pile === "stock" || pile === "waste") {
    if (index !== 0) throw new Error(`${pile} index must be 0`);
  } else if (pile === "foundation") {
    if (index < 0 || index >= FOUNDATION_COUNT) {
      throw new Error("foundation index out of range");
    }
  } else if (pile === "tableau") {
    if (index < 0 || index >= TABLEAU_COLUMNS) {
      throw new Error("tableau index out of range");
    }
  }
}

function getPile(
  state: CascadeState,
  pile: PileKind,
  index: number,
): readonly CardState[] {
  assertPile(pile, index);
  if (pile === "stock") return state.stock;
  if (pile === "waste") return state.waste;
  if (pile === "foundation") return state.foundations[index] ?? [];
  return state.tableau[index] ?? [];
}

function setPile(
  state: CascadeState,
  pile: PileKind,
  index: number,
  cards: readonly CardState[],
): CascadeState {
  assertPile(pile, index);
  if (pile === "stock") return { ...state, stock: cards };
  if (pile === "waste") return { ...state, waste: cards };
  if (pile === "foundation") {
    return {
      ...state,
      foundations: state.foundations.map((entry, i) =>
        i === index ? cards : entry,
      ),
    };
  }
  return {
    ...state,
    tableau: state.tableau.map((entry, i) => (i === index ? cards : entry)),
  };
}

function isSuit(value: string): value is Suit {
  return (SUITS as readonly string[]).includes(value);
}

function freshDeck(): CardState[] {
  const deck: CardState[] = [];
  let id = 1;
  for (const suit of SUITS) {
    for (let rank = RANK_MIN; rank <= RANK_MAX; rank += 1) {
      deck.push({ id, suit, rank, faceUp: false });
      id += 1;
    }
  }
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = deck[i] as CardState;
    deck[i] = deck[j] as CardState;
    deck[j] = swap;
  }
  return deck;
}

function dealState(state: DeepReadonly<CascadeState>): CascadeState {
  clearTrailLayer();
  const deck = freshDeck();
  const tableau: CardState[][] = Array.from(
    { length: TABLEAU_COLUMNS },
    () => [],
  );
  let cursor = 0;
  for (let column = 0; column < TABLEAU_COLUMNS; column += 1) {
    for (let row = 0; row <= column; row += 1) {
      const card = deck[cursor] as CardState;
      tableau[column]?.push({ ...card, faceUp: row === column });
      cursor += 1;
    }
  }
  const stock = deck.slice(cursor).map((card) => ({ ...card, faceUp: false }));
  if (cursor !== DEAL_TABLEAU_CARDS || stock.length !== DEAL_STOCK_CARDS) {
    throw new Error("deal constants do not add up");
  }
  return {
    ...cloneState(state),
    stock,
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau,
    drag: null,
    dropTarget: null,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: DECK_SIZE + 1,
  };
}

function resetState(state: DeepReadonly<CascadeState>): CascadeState {
  clearTrailLayer();
  return initialState(state.muted);
}

function turnStockState(state: DeepReadonly<CascadeState>): CascadeState {
  const next = cloneState(state);
  if (next.stock.length > 0) {
    const stock = [...next.stock];
    const waste = [...next.waste];
    let turned = 0;
    const count = Math.min(TURN_COUNT, stock.length);
    for (let i = 0; i < count; i += 1) {
      const card = stock.pop();
      if (card) {
        waste.push({ ...card, faceUp: true });
        turned += 1;
      }
    }
    return { ...next, stock, waste, wasteSets: [...next.wasteSets, turned] };
  }
  if (next.waste.length > 0) {
    return {
      ...next,
      stock: [...next.waste]
        .reverse()
        .map((card) => ({ ...card, faceUp: false })),
      waste: [],
      wasteSets: [],
    };
  }
  return next;
}

function isRun(cards: readonly CardState[]): boolean {
  if (cards.length === 0) return false;
  for (let i = 1; i < cards.length; i += 1) {
    const above = cards[i - 1] as CardState;
    const below = cards[i] as CardState;
    if (
      below.rank !== above.rank - 1 ||
      colorOf(below.suit) === colorOf(above.suit)
    ) {
      return false;
    }
  }
  return true;
}

function foundationAccepts(
  pile: readonly CardState[],
  cards: readonly CardState[],
): boolean {
  const card = cards[0];
  if (cards.length !== 1 || !card?.faceUp) return false;
  const top = pile[pile.length - 1];
  if (!top) return card.rank === RANK_MIN;
  return card.suit === top.suit && card.rank === top.rank + 1;
}

function tableauAccepts(
  pile: readonly CardState[],
  cards: readonly CardState[],
): boolean {
  const lead = cards[0];
  if (!lead?.faceUp || !isRun(cards)) return false;
  const top = pile[pile.length - 1];
  if (!top) return lead.rank === RANK_MAX;
  return (
    top.faceUp &&
    lead.rank === top.rank - 1 &&
    colorOf(lead.suit) !== colorOf(top.suit)
  );
}

function accepts(
  state: CascadeState,
  pile: PileKind,
  index: number,
  cards: readonly CardState[],
): boolean {
  if (pile === "foundation")
    return foundationAccepts(state.foundations[index] ?? [], cards);
  if (pile === "tableau")
    return tableauAccepts(state.tableau[index] ?? [], cards);
  return false;
}

function afterAcceptedMove(
  state: CascadeState,
  sourcePile: PileKind,
  sourceIndex: number,
): {
  readonly state: CascadeState;
  readonly flipped: boolean;
  readonly won: boolean;
} {
  let next = state;
  let flipped = false;
  if (sourcePile === "tableau" && next.autoFlip) {
    const pile = next.tableau[sourceIndex] ?? [];
    const top = pile[pile.length - 1];
    if (top && !top.faceUp) {
      next = setPile(
        next,
        "tableau",
        sourceIndex,
        pile.map((card, i) =>
          i === pile.length - 1 ? { ...card, faceUp: true } : card,
        ),
      );
      flipped = true;
    }
  }
  const won =
    next.winDetect &&
    next.foundations.reduce((sum, pile) => sum + pile.length, 0) === DECK_SIZE;
  if (won)
    next = {
      ...next,
      screen: "won",
      launchClock: LAUNCH_INTERVAL,
      cascadeDone: false,
    };
  return { state: next, flipped, won };
}

function decreaseWasteSet(sets: readonly number[]): readonly number[] {
  const next = [...sets];
  for (let i = next.length - 1; i >= 0; i -= 1) {
    const count = next[i] ?? 0;
    if (count > 0) {
      next[i] = count - 1;
      break;
    }
  }
  return next.filter((count) => count > 0);
}

function moveCards(
  state: DeepReadonly<CascadeState>,
  fromPile: PileKind,
  fromIndex: number,
  fromRow: number,
  toPile: PileKind,
  toIndex: number,
): {
  readonly state: CascadeState;
  readonly accepted: boolean;
  readonly home: boolean;
  readonly flip: boolean;
  readonly win: boolean;
} {
  let next = cloneState(state);
  assertPile(fromPile, fromIndex);
  assertPile(toPile, toIndex);
  assertWhole(fromRow, "fromRow");
  const source = getPile(next, fromPile, fromIndex);
  if (fromRow < 0 || fromRow >= source.length)
    throw new Error("fromRow out of range");
  const run = source.slice(fromRow);
  const legalSource =
    (fromPile === "tableau" && run[0]?.faceUp === true && isRun(run)) ||
    ((fromPile === "waste" || fromPile === "foundation") &&
      fromRow === source.length - 1 &&
      run.length === 1 &&
      run[0]?.faceUp === true);
  if (!legalSource || !accepts(next, toPile, toIndex, run)) {
    return {
      state: next,
      accepted: false,
      home: false,
      flip: false,
      win: false,
    };
  }
  next = setPile(next, fromPile, fromIndex, source.slice(0, fromRow));
  if (fromPile === "waste")
    next = { ...next, wasteSets: decreaseWasteSet(next.wasteSets) };
  next = setPile(next, toPile, toIndex, [
    ...getPile(next, toPile, toIndex),
    ...run,
  ]);
  const settled = afterAcceptedMove(next, fromPile, fromIndex);
  return {
    state: settled.state,
    accepted: true,
    home: toPile === "foundation",
    flip: settled.flipped,
    win: settled.won,
  };
}

function autoMoveCard(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): {
  readonly state: CascadeState;
  readonly accepted: boolean;
  readonly flip: boolean;
  readonly win: boolean;
} {
  const source = getPile(cloneState(state), pile, index);
  if (pile !== "waste" && pile !== "tableau") {
    return {
      state: cloneState(state),
      accepted: false,
      flip: false,
      win: false,
    };
  }
  const row = source.length - 1;
  const card = source[row];
  if (!card?.faceUp)
    return {
      state: cloneState(state),
      accepted: false,
      flip: false,
      win: false,
    };
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    const attempt = moveCards(state, pile, index, row, "foundation", i);
    if (attempt.accepted) {
      return {
        state: attempt.state,
        accepted: true,
        flip: attempt.flip,
        win: attempt.win,
      };
    }
  }
  return { state: cloneState(state), accepted: false, flip: false, win: false };
}

function visibleWasteCount(state: DeepReadonly<CascadeState>): number {
  return state.wasteSets[state.wasteSets.length - 1] ?? 0;
}

function columnOffset(cards: readonly CardState[]): number {
  if (cards.length <= 1) return FACE_UP_OFFSET;
  let y = TABLEAU_Y;
  let faceUpGaps = 0;
  for (let i = 1; i < cards.length; i += 1) {
    const above = cards[i - 1];
    if (above?.faceUp) faceUpGaps += 1;
    y += above?.faceUp ? FACE_UP_OFFSET : FACE_DOWN_OFFSET;
  }
  const overflow = y + CARD_H - COLUMN_BOTTOM_LIMIT;
  if (overflow <= 0 || faceUpGaps === 0) return FACE_UP_OFFSET;
  return Math.max(FACE_UP_OFFSET_MIN, FACE_UP_OFFSET - overflow / faceUpGaps);
}

function cardYInColumn(cards: readonly CardState[], row: number): number {
  const upOffset = columnOffset(cards);
  let y = TABLEAU_Y;
  for (let i = 1; i <= row; i += 1) {
    const above = cards[i - 1];
    y += above?.faceUp ? upOffset : FACE_DOWN_OFFSET;
  }
  return y;
}

function pileRect(state: CascadeState, pile: PileKind, index: number): Rect {
  assertPile(pile, index);
  if (pile === "stock")
    return { x: STOCK_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
  if (pile === "waste")
    return { x: WASTE_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
  if (pile === "foundation") {
    return { x: FOUNDATION_X[index] ?? 0, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
  }
  const cards = state.tableau[index] ?? [];
  if (cards.length === 0)
    return { x: COLUMN_X[index] ?? 0, y: TABLEAU_Y, w: CARD_W, h: CARD_H };
  return {
    x: COLUMN_X[index] ?? 0,
    y: TABLEAU_Y,
    w: CARD_W,
    h: cardYInColumn(cards, cards.length - 1) + CARD_H - TABLEAU_Y,
  };
}

function contains(rect: Rect, x: number, y: number): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function findDropPile(
  state: CascadeState,
  x: number,
  y: number,
): { readonly pile: PileKind; readonly index: number } | null {
  const piles: { readonly pile: PileKind; readonly index: number }[] = [
    { pile: "stock", index: 0 },
    { pile: "waste", index: 0 },
  ];
  for (let i = 0; i < FOUNDATION_COUNT; i += 1)
    piles.push({ pile: "foundation", index: i });
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1)
    piles.push({ pile: "tableau", index: i });
  return (
    piles.find((pile) =>
      contains(pileRect(state, pile.pile, pile.index), x, y),
    ) ?? null
  );
}

function findCardAt(
  state: CascadeState,
  x: number,
  y: number,
): {
  readonly pile: "waste" | "foundation" | "tableau";
  readonly index: number;
  readonly row: number;
  readonly card: CardState;
} | null {
  for (let c = TABLEAU_COLUMNS - 1; c >= 0; c -= 1) {
    const cards = state.tableau[c] ?? [];
    for (let row = cards.length - 1; row >= 0; row -= 1) {
      const card = cards[row];
      if (
        card &&
        contains(
          {
            x: COLUMN_X[c] ?? 0,
            y: cardYInColumn(cards, row),
            w: CARD_W,
            h: CARD_H,
          },
          x,
          y,
        )
      ) {
        return { pile: "tableau", index: c, row, card };
      }
    }
  }
  for (let i = FOUNDATION_COUNT - 1; i >= 0; i -= 1) {
    const pile = state.foundations[i] ?? [];
    const card = pile[pile.length - 1];
    if (card && contains(pileRect(state, "foundation", i), x, y)) {
      return { pile: "foundation", index: i, row: pile.length - 1, card };
    }
  }
  const visible = visibleWasteCount(state);
  if (visible > 0) {
    const start = state.waste.length - visible;
    for (let i = visible - 1; i >= 0; i -= 1) {
      const row = start + i;
      const card = state.waste[row];
      if (
        card &&
        contains(
          { x: WASTE_X + i * WASTE_FAN, y: TOP_ROW_Y, w: CARD_W, h: CARD_H },
          x,
          y,
        )
      ) {
        return { pile: "waste", index: 0, row, card };
      }
    }
  }
  return null;
}

function dragTarget(
  state: CascadeState,
  drag: DragState | null,
): DropTargetState | null {
  if (!drag) return null;
  const pile = findDropPile(state, drag.x + CARD_W / 2, drag.y + CARD_H / 2);
  if (!pile || (pile.pile !== "foundation" && pile.pile !== "tableau"))
    return null;
  return accepts(state, pile.pile, pile.index, drag.cards)
    ? { pile: pile.pile, index: pile.index }
    : null;
}

function returnDrag(state: CascadeState): CascadeState {
  const drag = state.drag;
  if (!drag) return state;
  return {
    ...setPile(state, drag.fromPile, drag.fromIndex, [
      ...getPile(state, drag.fromPile, drag.fromIndex),
      ...drag.cards,
    ]),
    drag: null,
    dropTarget: null,
  };
}

function menuRects(screen: Screen): readonly Rect[] {
  if (screen === "title") {
    return [
      { x: 510, y: 405, w: 260, h: 56 },
      { x: 510, y: 473, w: 260, h: 56 },
    ];
  }
  if (screen === "howto") return [{ x: 540, y: 604, w: 200, h: 52 }];
  if (screen === "playing") {
    return [
      { x: 222, y: HUD_Y + 4, w: 138, h: HUD_H - 8 },
      { x: 380, y: HUD_Y + 4, w: 112, h: HUD_H - 8 },
      { x: 512, y: HUD_Y + 4, w: 118, h: HUD_H - 8 },
    ];
  }
  return [];
}

function menuCount(screen: Screen): number {
  return menuRects(screen).length;
}

function menuIndexAt(state: CascadeState, x: number, y: number): number | null {
  const index = menuRects(state.screen).findIndex((rect) =>
    contains(rect, x, y),
  );
  return index >= 0 ? index : null;
}

type CueSet = Set<string>;

function activateMenu(state: CascadeState): {
  readonly state: CascadeState;
  readonly cues: CueSet;
} {
  const cues: CueSet = new Set();
  if (state.screen === "title") {
    if (state.menuIndex === 0) {
      cues.add(CUES.deal);
      return {
        state: {
          ...dealState(state),
          screen: "playing",
          menuIndex: 0,
          titleIndex: 0,
        },
        cues,
      };
    }
    return {
      state: { ...state, screen: "howto", menuIndex: 0, titleIndex: 1 },
      cues,
    };
  }
  if (state.screen === "howto") {
    return {
      state: { ...state, screen: "title", menuIndex: state.titleIndex },
      cues,
    };
  }
  if (state.screen === "playing") {
    if (state.menuIndex === 0) {
      cues.add(CUES.deal);
      return {
        state: { ...dealState(state), screen: "playing", menuIndex: 0 },
        cues,
      };
    }
    if (state.menuIndex === 1) {
      return {
        state: { ...state, screen: "title", menuIndex: state.titleIndex },
        cues,
      };
    }
  }
  return { state, cues };
}

function pointerDownState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { readonly state: CascadeState; readonly cues: CueSet } {
  let next = cloneState(state);
  const cues: CueSet = new Set();
  if (next.screen === "won") {
    cues.add(CUES.deal);
    const dealt: CascadeState = {
      ...dealState(next),
      screen: "playing",
      menuIndex: 0,
    };
    return {
      state: {
        ...dealt,
        pointer: { x, y, down: true },
        lastPress: { x, y, at: dealt.simTime },
      },
      cues,
    };
  }
  const menuHit = menuIndexAt(next, x, y);
  if (menuHit !== null) next = { ...next, menuIndex: menuHit };
  const press: PressState = { x, y, at: next.simTime };
  if (next.screen !== "playing") {
    return {
      state: { ...next, pointer: { x, y, down: true }, lastPress: press },
      cues,
    };
  }
  const hit = findCardAt(next, x, y);
  const isPlayableTop =
    hit?.pile === "waste" ||
    (hit?.pile === "tableau" &&
      hit.row === (next.tableau[hit.index]?.length ?? 0) - 1);
  const isDouble =
    hit !== null &&
    isPlayableTop &&
    next.lastPress !== null &&
    next.simTime - next.lastPress.at <= DOUBLE_CLICK_WINDOW &&
    Math.hypot(x - next.lastPress.x, y - next.lastPress.y) <= DOUBLE_CLICK_SLOP;
  if (isDouble && hit) {
    const result = autoMoveCard(next, hit.pile, hit.index);
    next = result.state;
    if (result.accepted) cues.add(CUES.home);
    if (result.flip) cues.add(CUES.flip);
    if (result.win) cues.add(CUES.win);
    return {
      state: { ...next, pointer: { x, y, down: true }, lastPress: press },
      cues,
    };
  }
  if (hit?.card.faceUp) {
    const canLift =
      (hit.pile === "tableau" &&
        isRun((next.tableau[hit.index] ?? []).slice(hit.row))) ||
      (hit.pile === "waste" &&
        visibleWasteCount(next) > 0 &&
        hit.row === next.waste.length - 1) ||
      (hit.pile === "foundation" &&
        hit.row === (next.foundations[hit.index]?.length ?? 0) - 1);
    if (canLift) {
      const source = getPile(next, hit.pile, hit.index);
      const run = source.slice(hit.row);
      next = setPile(next, hit.pile, hit.index, source.slice(0, hit.row));
      const cardX =
        hit.pile === "tableau"
          ? (COLUMN_X[hit.index] ?? 0)
          : hit.pile === "foundation"
            ? (FOUNDATION_X[hit.index] ?? 0)
            : WASTE_X + (visibleWasteCount(next) - 1) * WASTE_FAN;
      const cardY =
        hit.pile === "tableau" ? cardYInColumn(source, hit.row) : TOP_ROW_Y;
      const drag: DragState = {
        cards: run,
        fromPile: hit.pile,
        fromIndex: hit.index,
        x: cardX,
        y: cardY,
      };
      next = { ...next, drag, dropTarget: dragTarget(next, drag) };
      cues.add(CUES.lift);
    }
  }
  return {
    state: { ...next, pointer: { x, y, down: true }, lastPress: press },
    cues,
  };
}

function pointerMoveState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CascadeState {
  let next = cloneState(state);
  const menuHit = menuIndexAt(next, x, y);
  if (menuHit !== null) next = { ...next, menuIndex: menuHit };
  if (next.drag && next.pointer.down) {
    const drag = {
      ...next.drag,
      x: next.drag.x + x - next.pointer.x,
      y: next.drag.y + y - next.pointer.y,
    };
    next = { ...next, drag, dropTarget: dragTarget(next, drag) };
  }
  return { ...next, pointer: { x, y, down: next.pointer.down } };
}

function pointerUpState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): {
  readonly state: CascadeState;
  readonly cues: CueSet;
  readonly toggleSound: boolean;
} {
  let next = pointerMoveState(state, x, y);
  const cues: CueSet = new Set();
  let toggleSound = false;
  const press = next.lastPress;
  const releaseMenu = menuIndexAt(next, x, y);
  const pressMenu = press ? menuIndexAt(next, press.x, press.y) : null;
  if (releaseMenu !== null && releaseMenu === pressMenu) {
    next = { ...next, menuIndex: releaseMenu };
    if (next.screen === "playing" && next.menuIndex === 2) {
      toggleSound = true;
      next = { ...next, muted: !next.muted };
    } else {
      const activated = activateMenu(next);
      next = activated.state;
      for (const cue of activated.cues) cues.add(cue);
    }
  }
  if (next.screen === "playing" && press) {
    const clicked = Math.hypot(x - press.x, y - press.y) <= DRAG_THRESHOLD;
    if (clicked) {
      next = returnDrag(next);
      if (contains(pileRect(next, "stock", 0), press.x, press.y)) {
        const hadStock = next.stock.length > 0;
        const hadWaste = next.waste.length > 0;
        next = turnStockState(next);
        if (hadStock) cues.add(CUES.turn);
        else if (hadWaste) cues.add(CUES.recycle);
      }
    } else if (next.drag) {
      const target = next.dropTarget;
      if (target) {
        const source = next.drag.fromPile;
        const sourceIndex = next.drag.fromIndex;
        next = setPile(next, target.pile, target.index, [
          ...getPile(next, target.pile, target.index),
          ...next.drag.cards,
        ]);
        next = { ...next, drag: null, dropTarget: null };
        const settled = afterAcceptedMove(next, source, sourceIndex);
        next = settled.state;
        cues.add(CUES.drop);
        if (target.pile === "foundation") cues.add(CUES.home);
        if (settled.flipped) cues.add(CUES.flip);
        if (settled.won) cues.add(CUES.win);
      } else {
        next = returnDrag(next);
        cues.add(CUES.reject);
      }
    }
  }
  return {
    state: { ...next, pointer: { x, y, down: false } },
    cues,
    toggleSound,
  };
}

function updateMenuFromKeyboard(
  state: CascadeState,
  api: UpdateApi,
): {
  readonly state: CascadeState;
  readonly cues: CueSet;
  readonly toggleSound: boolean;
} {
  let next = state;
  const cues: CueSet = new Set();
  let toggleSound = false;
  const count = menuCount(next.screen);
  if (count === 0) return { state: next, cues, toggleSound };
  const up = api.input.pressed(MENU_UP);
  const down = !up && api.input.pressed(MENU_DOWN);
  const confirm = !up && !down && api.input.pressed(MENU_CONFIRM);
  const back = !up && !down && !confirm && api.input.pressed(MENU_BACK);
  if (up) next = { ...next, menuIndex: (next.menuIndex - 1 + count) % count };
  if (down) next = { ...next, menuIndex: (next.menuIndex + 1) % count };
  if (confirm || (back && next.screen === "howto")) {
    if (next.screen === "playing" && next.menuIndex === 2) {
      toggleSound = true;
    } else {
      const activated = activateMenu(next);
      next = activated.state;
      for (const cue of activated.cues) cues.add(cue);
    }
  }
  return { state: next, cues, toggleSound };
}

function drawLaunchVx(): number {
  const magnitude =
    LAUNCH_VX_MIN + Math.random() * (LAUNCH_VX_MAX - LAUNCH_VX_MIN);
  return Math.random() < 0.5 ? -magnitude : magnitude;
}

function launchOne(state: CascadeState): CascadeState {
  for (let offset = 0; offset < FOUNDATION_COUNT; offset += 1) {
    const index = (state.launched + offset) % FOUNDATION_COUNT;
    const pile = state.foundations[index] ?? [];
    const card = pile[pile.length - 1];
    if (card) {
      const flyer: FlyerState = {
        id: card.id,
        suit: card.suit,
        rank: card.rank,
        x: FOUNDATION_X[index] ?? 0,
        y: TOP_ROW_Y,
        vx: drawLaunchVx(),
        vy: LAUNCH_VY,
      };
      return {
        ...setPile(state, "foundation", index, pile.slice(0, -1)),
        flyers: [...state.flyers, flyer],
        launched: state.launched + 1,
      };
    }
  }
  return state;
}

function advanceCascade(
  state: CascadeState,
  dt: number,
): { readonly state: CascadeState; readonly launched: boolean } {
  if (state.screen !== "won") return { state, launched: false };
  let stamps = state.trailStamps;
  const flyers: FlyerState[] = [];
  for (const flyer of state.flyers) {
    let vy = flyer.vy + GRAVITY * dt;
    const x = flyer.x + flyer.vx * dt;
    let y = flyer.y + vy * dt;
    if (y >= FLOOR_Y && vy > 0) {
      vy = -vy * BOUNCE_DAMP;
      y = FLOOR_Y;
    }
    if (state.trailPainting) {
      stampTrail({ ...flyer, x, y, vy });
      stamps += 1;
    }
    if (!(x + CARD_W < 0 || x > STAGE_W)) flyers.push({ ...flyer, x, y, vy });
  }
  let next: CascadeState = { ...state, flyers, trailStamps: stamps };
  let launched = false;
  if (next.launching && next.launched < DECK_SIZE) {
    let clock = next.launchClock + dt;
    while (clock >= LAUNCH_INTERVAL && next.launched < DECK_SIZE) {
      clock -= LAUNCH_INTERVAL;
      next = launchOne({ ...next, launchClock: clock });
      launched = true;
    }
    next = { ...next, launchClock: clock };
  }
  if (next.launched >= DECK_SIZE && next.flyers.length === 0)
    next = { ...next, cascadeDone: true };
  return { state: next, launched };
}

function ensureTrail():
  CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
  if (trailCtx) return trailCtx;
  if (typeof OffscreenCanvas !== "undefined") {
    trailCanvas = new OffscreenCanvas(STAGE_W, STAGE_H);
    trailCtx = trailCanvas.getContext("2d");
    return trailCtx;
  }
  if (typeof document !== "undefined") {
    trailCanvas = document.createElement("canvas");
    trailCanvas.width = STAGE_W;
    trailCanvas.height = STAGE_H;
    trailCtx = trailCanvas.getContext("2d");
    return trailCtx;
  }
  return null;
}

function clearTrailLayer(): void {
  const ctx = ensureTrail();
  if (ctx) ctx.clearRect(0, 0, STAGE_W, STAGE_H);
}

function stampTrail(flyer: FlyerState): void {
  const ctx = ensureTrail();
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = 0.7;
  drawCard(
    ctx,
    { id: flyer.id, suit: flyer.suit, rank: flyer.rank, faceUp: true },
    flyer.x,
    flyer.y,
  );
  ctx.restore();
}

function cardSnapshot(card: DeepReadonly<CardState>): CardSnapshot {
  return { ...copyCard(card), color: colorOf(card.suit) };
}

function snapshot(state: DeepReadonly<CascadeState>): Snapshot {
  const cloned = cloneState(state);
  return {
    version: CASCADE_DEBUG_VERSION,
    screen: cloned.screen,
    menuIndex: cloned.menuIndex,
    titleIndex: cloned.titleIndex,
    dealMode: DEAL_MODE,
    turnCount: TURN_COUNT,
    dealModeLabel: DEAL_MODE_LABEL,
    muted: cloned.muted,
    autoFlip: cloned.autoFlip,
    winDetect: cloned.winDetect,
    launching: cloned.launching,
    trailPainting: cloned.trailPainting,
    stock: cloned.stock.map(cardSnapshot),
    waste: cloned.waste.map(cardSnapshot),
    wasteSets: [...cloned.wasteSets],
    wasteVisibleCount: visibleWasteCount(cloned),
    foundations: cloned.foundations.map((pile) => pile.map(cardSnapshot)),
    tableau: cloned.tableau.map((pile) => pile.map(cardSnapshot)),
    drag:
      cloned.drag === null
        ? null
        : {
            ...cloned.drag,
            cards: cloned.drag.cards.map(cardSnapshot),
          },
    dropTarget: dragTarget(cloned, cloned.drag),
    pointer: { ...cloned.pointer },
    lastPress: cloned.lastPress === null ? null : { ...cloned.lastPress },
    launchClock: cloned.launchClock,
    launched: cloned.launched,
    flyers: cloned.flyers.map((flyer) => ({ ...flyer })),
    cascadeDone: cloned.cascadeDone,
    trailStamps: cloned.trailStamps,
    simTime: cloned.simTime,
  };
}

function removeCardById(
  state: DeepReadonly<CascadeState>,
  id: number,
): CascadeState {
  let next = cloneState(state);
  let found = false;
  for (const pile of ["stock", "waste"] as const) {
    const cards = getPile(next, pile, 0);
    if (cards.some((card) => card.id === id)) {
      next = setPile(
        next,
        pile,
        0,
        cards.filter((card) => card.id !== id),
      );
      if (pile === "waste")
        next = { ...next, wasteSets: decreaseWasteSet(next.wasteSets) };
      found = true;
    }
  }
  for (const pile of ["foundation", "tableau"] as const) {
    const count = pile === "foundation" ? FOUNDATION_COUNT : TABLEAU_COLUMNS;
    for (let i = 0; i < count; i += 1) {
      const cards = getPile(next, pile, i);
      if (cards.some((card) => card.id === id)) {
        next = setPile(
          next,
          pile,
          i,
          cards.filter((card) => card.id !== id),
        );
        found = true;
      }
    }
  }
  if (!found) throw new Error("card not found");
  return next;
}

function mapCardById(
  state: DeepReadonly<CascadeState>,
  id: number,
  map: (card: CardState) => CardState,
): CascadeState {
  let found = false;
  const next = cloneState(state);
  const mapPile = (pile: readonly CardState[]) =>
    pile.map((card) => {
      if (card.id === id) {
        found = true;
        return map(card);
      }
      return card;
    });
  const mapped: CascadeState = {
    ...next,
    stock: mapPile(next.stock),
    waste: mapPile(next.waste),
    foundations: next.foundations.map(mapPile),
    tableau: next.tableau.map(mapPile),
    drag:
      next.drag === null
        ? null
        : { ...next.drag, cards: mapPile(next.drag.cards) },
  };
  if (!found) throw new Error("card not found");
  return mapped;
}

function mapFlyerById(
  state: DeepReadonly<CascadeState>,
  id: number,
  map: (flyer: FlyerState) => FlyerState,
): CascadeState {
  const next = cloneState(state);
  let found = false;
  const flyers = next.flyers.map((flyer) => {
    if (flyer.id === id) {
      found = true;
      return map(flyer);
    }
    return flyer;
  });
  if (!found) throw new Error("flyer not found");
  return { ...next, flyers };
}

function createDebug(): CascadeDebugApi {
  return {
    version: CASCADE_DEBUG_VERSION,
    reset: resetState,
    snapshot,
    reconcile: (state) => {
      const next = cloneState(state);
      return { ...next, dropTarget: dragTarget(next, next.drag) };
    },
    menuItemRect: (state, index) => menuRects(state.screen)[index] ?? null,
    setScreen: (state, screen) => ({ ...cloneState(state), screen }),
    setMenuIndex: (state, index) => ({
      ...cloneState(state),
      menuIndex: index,
    }),
    setTitleIndex: (state, index) => ({
      ...cloneState(state),
      titleIndex: index,
    }),
    addCard: (state, pile, index, suit, rank, faceUp) => {
      assertPile(pile, index);
      if (!isSuit(suit)) throw new Error("invalid suit");
      if (!Number.isInteger(rank) || rank < RANK_MIN || rank > RANK_MAX)
        throw new Error("invalid rank");
      const next = cloneState(state);
      return {
        ...setPile(next, pile, index, [
          ...getPile(next, pile, index),
          { id: next.nextId, suit, rank, faceUp },
        ]),
        nextId: next.nextId + 1,
      };
    },
    removeCard: removeCardById,
    setCardFaceUp: (state, id, faceUp) =>
      mapCardById(state, id, (card) => ({ ...card, faceUp })),
    clearPile: (state, pile, index) => {
      const next = setPile(cloneState(state), pile, index, []);
      return pile === "waste" ? { ...next, wasteSets: [] } : next;
    },
    clearTable: (state) => ({
      ...cloneState(state),
      stock: [],
      waste: [],
      wasteSets: [],
      foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
      tableau: Array.from({ length: TABLEAU_COLUMNS }, () => []),
      drag: null,
      dropTarget: null,
    }),
    addWasteSet: (state, count) => {
      assertWhole(count, "count");
      if (count < 0) throw new Error("count must be non-negative");
      const next = cloneState(state);
      return { ...next, wasteSets: [...next.wasteSets, count] };
    },
    clearWasteSets: (state) => ({ ...cloneState(state), wasteSets: [] }),
    deal: dealState,
    turnStock: turnStockState,
    move: (state, fromPile, fromIndex, fromRow, toPile, toIndex) => {
      const result = moveCards(
        state,
        fromPile,
        fromIndex,
        fromRow,
        toPile,
        toIndex,
      );
      return [result.state, result.accepted];
    },
    autoMove: (state, pile, index) => {
      const result = autoMoveCard(state, pile, index);
      return [result.state, result.accepted];
    },
    pointerDown: (state, x, y) => pointerDownState(state, x, y).state,
    pointerMove: pointerMoveState,
    pointerUp: (state, x, y) => pointerUpState(state, x, y).state,
    setAutoFlip: (state, enabled) => ({
      ...cloneState(state),
      autoFlip: enabled,
    }),
    setWinDetect: (state, enabled) => ({
      ...cloneState(state),
      winDetect: enabled,
    }),
    setLaunching: (state, enabled) => ({
      ...cloneState(state),
      launching: enabled,
    }),
    setTrailPainting: (state, enabled) => ({
      ...cloneState(state),
      trailPainting: enabled,
    }),
    addFlyer: (state, suit, rank, x, y, vx, vy) => {
      if (!isSuit(suit)) throw new Error("invalid suit");
      for (const [value, name] of [
        [rank, "rank"],
        [x, "x"],
        [y, "y"],
        [vx, "vx"],
        [vy, "vy"],
      ] as const) {
        assertFinite(value, name);
      }
      const next = cloneState(state);
      return {
        ...next,
        flyers: [...next.flyers, { id: next.nextId, suit, rank, x, y, vx, vy }],
        nextId: next.nextId + 1,
      };
    },
    setFlyerPosition: (state, id, x, y) =>
      mapFlyerById(state, id, (flyer) => ({ ...flyer, x, y })),
    setFlyerVelocity: (state, id, vx, vy) =>
      mapFlyerById(state, id, (flyer) => ({ ...flyer, vx, vy })),
    removeFlyer: (state, id) => {
      const next = cloneState(state);
      if (!next.flyers.some((flyer) => flyer.id === id))
        throw new Error("flyer not found");
      return {
        ...next,
        flyers: next.flyers.filter((flyer) => flyer.id !== id),
      };
    },
    clearFlyers: (state) => ({ ...cloneState(state), flyers: [] }),
    setLaunchClock: (state, seconds) => {
      assertFinite(seconds, "seconds");
      return { ...cloneState(state), launchClock: seconds };
    },
    clearTrail: (state) => {
      clearTrailLayer();
      return { ...cloneState(state), trailStamps: 0 };
    },
    drawLaunchVx,
  };
}

function playCues(api: UpdateApi, cues: CueSet): void {
  for (const cue of cues) api.audio.play(cue);
}

function roundRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCard(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  card: CardState,
  x: number,
  y: number,
): void {
  ctx.save();
  roundRect(ctx, x, y, CARD_W, CARD_H, 10);
  ctx.fillStyle = card.faceUp ? CARD_FACE : "#214c78";
  ctx.fill();
  ctx.strokeStyle = CARD_EDGE;
  ctx.lineWidth = 2;
  ctx.stroke();
  if (card.faceUp) {
    ctx.fillStyle = colorOf(card.suit) === "red" ? RED : BLACK;
    ctx.font = "700 24px Georgia, serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(rankName(card.rank), x + 10, y + 9);
    ctx.fillText(suitGlyph(card.suit), x + 10, y + 38);
    ctx.font = "700 48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(suitGlyph(card.suit), x + CARD_W / 2, y + CARD_H / 2 + 8);
  } else {
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i += 1) {
      roundRect(
        ctx,
        x + 14 + i * 8,
        y + 18 + i * 8,
        CARD_W - 28 - i * 16,
        CARD_H - 36 - i * 16,
        7,
      );
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "800 26px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("C", x + CARD_W / 2, y + CARD_H / 2);
  }
  ctx.restore();
}

function drawTable(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = TABLE;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = "rgba(255,255,255,0.035)";
  for (let x = -STAGE_H; x < STAGE_W; x += 42) ctx.fillRect(x, 0, 2, STAGE_H);
  ctx.fillStyle = TABLE_DARK;
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H + 4);
}

function drawSlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label = "",
): void {
  roundRect(ctx, x, y, CARD_W, CARD_H, 9);
  ctx.fillStyle = "rgba(0,0,0,0.11)";
  ctx.fill();
  ctx.strokeStyle = TABLE_LINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  if (label) {
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.font = "700 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + CARD_W / 2, y + CARD_H / 2);
  }
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  label: string,
  selected: boolean,
): void {
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 6);
  ctx.fillStyle = selected ? GOLD : "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.strokeStyle = selected ? "#fff4c8" : "rgba(255,255,255,0.24)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = selected ? "#18372f" : "#f6f0dc";
  ctx.font = "700 15px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 0.5);
}

function drawTrail(ctx: CanvasRenderingContext2D): void {
  if (trailCanvas) ctx.drawImage(trailCanvas, 0, 0);
}

function drawPiles(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  const next = cloneState(state);
  const target = dragTarget(next, next.drag);
  if (target) {
    const rect = pileRect(next, target.pile, target.index);
    ctx.fillStyle = "rgba(241,193,91,0.34)";
    roundRect(
      ctx,
      rect.x - 6,
      rect.y - 6,
      rect.w + 12,
      Math.max(rect.h, CARD_H) + 12,
      12,
    );
    ctx.fill();
  }
  drawSlot(ctx, STOCK_X, TOP_ROW_Y, "STOCK");
  if (next.stock.length > 0)
    drawCard(ctx, next.stock[next.stock.length - 1]!, STOCK_X, TOP_ROW_Y);
  drawSlot(ctx, WASTE_X, TOP_ROW_Y, "WASTE");
  const shown = visibleWasteCount(next);
  if (shown > 0) {
    const start = next.waste.length - shown;
    for (let i = 0; i < shown; i += 1) {
      const card = next.waste[start + i];
      if (card) drawCard(ctx, card, WASTE_X + i * WASTE_FAN, TOP_ROW_Y);
    }
  }
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    const x = FOUNDATION_X[i] ?? 0;
    drawSlot(ctx, x, TOP_ROW_Y, "A");
    const pile = next.foundations[i] ?? [];
    const top = pile[pile.length - 1];
    if (top) drawCard(ctx, top, x, TOP_ROW_Y);
  }
  for (let c = 0; c < TABLEAU_COLUMNS; c += 1) {
    const x = COLUMN_X[c] ?? 0;
    const pile = next.tableau[c] ?? [];
    if (pile.length === 0) drawSlot(ctx, x, TABLEAU_Y, "K");
    for (let row = 0; row < pile.length; row += 1) {
      const card = pile[row];
      if (card) drawCard(ctx, card, x, cardYInColumn(pile, row));
    }
  }
  if (next.drag) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.42)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 12;
    for (let i = 0; i < next.drag.cards.length; i += 1) {
      const card = next.drag.cards[i];
      if (card)
        drawCard(ctx, card, next.drag.x, next.drag.y + i * FACE_UP_OFFSET);
    }
    ctx.restore();
  }
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = TABLE_DARK;
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H);
  const rects = menuRects("playing");
  for (let i = 0; i < rects.length; i += 1) {
    drawButton(ctx, rects[i]!, HUD_ITEMS[i] ?? "", state.menuIndex === i);
  }
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "700 16px system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  ctx.fillText(DEAL_MODE_LABEL, 1056, HUD_Y + HUD_H / 2);
  ctx.textAlign = "left";
  ctx.fillText(state.muted ? "MUTED" : "SOUND ON", 1080, HUD_Y + HUD_H / 2);
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  drawTable(ctx);
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = "#f7ead1";
  ctx.font = "800 96px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(TITLE_TEXT, STAGE_W / 2, 218);
  ctx.fillStyle = GOLD;
  ctx.font = "700 24px system-ui, sans-serif";
  ctx.fillText(TAGLINE_TEXT, STAGE_W / 2, 292);
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText(DEAL_MODE_LABEL, STAGE_W / 2, 346);
  const rects = menuRects("title");
  for (let i = 0; i < rects.length; i += 1) {
    drawButton(ctx, rects[i]!, TITLE_ITEMS[i] ?? "", state.menuIndex === i);
  }
}

function drawHowto(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  drawTable(ctx);
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = "#f7ead1";
  ctx.font = "800 58px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("HOW TO PLAY", STAGE_W / 2, 110);
  ctx.font = "24px system-ui, sans-serif";
  ctx.textAlign = "left";
  const lines = [
    "Build each foundation from ACE up to KING in a single suit.",
    "Tableau columns build downward in rank, alternating red and black.",
    "Only a KING can move into an empty column.",
    "Click the STOCK to turn three cards; click it empty to recycle the waste.",
    "Drag cards or runs to move them. DOUBLE-CLICK a playable card to send it home.",
  ];
  for (let i = 0; i < lines.length; i += 1)
    ctx.fillText(lines[i]!, 300, 220 + i * 48);
  drawButton(
    ctx,
    menuRects("howto")[0]!,
    HOWTO_BACK_LABEL,
    state.menuIndex === 0,
  );
}

function drawWon(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  drawTable(ctx);
  drawTrail(ctx);
  drawPiles(ctx, state);
  for (const flyer of state.flyers) {
    drawCard(
      ctx,
      { id: flyer.id, suit: flyer.suit, rank: flyer.rank, faceUp: true },
      flyer.x,
      flyer.y,
    );
  }
  if (state.cascadeDone) {
    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    ctx.fillStyle = "#fff4c8";
    ctx.font = "800 82px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(WIN_TEXT, STAGE_W / 2, STAGE_H / 2);
  }
}

export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>): [CascadeState, CascadeDebugApi] {
    for (const [name, keys] of Object.entries(MENU_BINDINGS)) {
      api.input.register(name, { keys: [...keys] });
    }
    api.audio.define(CUES.deal, {
      wave: "triangle",
      freq: 220,
      freqTo: 330,
      durationMs: 120,
      gain: 0.18,
    });
    api.audio.define(CUES.turn, {
      wave: "sine",
      freq: 420,
      freqTo: 520,
      durationMs: 70,
      gain: 0.14,
    });
    api.audio.define(CUES.recycle, {
      wave: "sawtooth",
      freq: 180,
      freqTo: 120,
      durationMs: 130,
      gain: 0.12,
    });
    api.audio.define(CUES.lift, {
      wave: "sine",
      freq: 520,
      freqTo: 620,
      durationMs: 55,
      gain: 0.11,
    });
    api.audio.define(CUES.drop, {
      wave: "triangle",
      freq: 300,
      freqTo: 240,
      durationMs: 80,
      gain: 0.14,
    });
    api.audio.define(CUES.reject, {
      wave: "square",
      freq: 130,
      freqTo: 90,
      durationMs: 90,
      gain: 0.1,
    });
    api.audio.define(CUES.flip, {
      wave: "sine",
      freq: 650,
      freqTo: 780,
      durationMs: 80,
      gain: 0.12,
    });
    api.audio.define(CUES.home, {
      wave: "triangle",
      freq: 740,
      freqTo: 980,
      durationMs: 110,
      gain: 0.13,
    });
    api.audio.define(CUES.launch, {
      wave: "sawtooth",
      freq: 340,
      freqTo: 180,
      durationMs: 100,
      gain: 0.12,
    });
    api.audio.define(CUES.win, {
      wave: "triangle",
      freq: 440,
      freqTo: 880,
      durationMs: 220,
      gain: 0.16,
    });
    api.diagnostics.register("screen", (state) => state.screen);
    api.diagnostics.register("deal", () => DEAL_MODE);
    api.diagnostics.register("stock", (state) => state.stock.length);
    api.diagnostics.register("waste", (state) => state.waste.length);
    for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
      api.diagnostics.register(
        `f${i}`,
        (state) => state.foundations[i]?.length ?? 0,
      );
    }
    for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
      api.diagnostics.register(
        `c${i}`,
        (state) => state.tableau[i]?.length ?? 0,
      );
    }
    api.diagnostics.register("hand", (state) =>
      state.drag ? `yes:${state.drag.cards.length}` : "no",
    );
    api.diagnostics.register("cascade", (state) =>
      state.screen === "won" ? `${state.launched}/${state.flyers.length}` : "",
    );
    clearTrailLayer();
    return [initialState(false), createDebug()];
  },

  update(
    state: DeepReadonly<CascadeState>,
    api: UpdateApi,
    dt: number,
  ): CascadeState {
    let next: CascadeState = {
      ...cloneState(state),
      simTime: state.simTime + dt,
    };
    const cues: CueSet = new Set();
    const menu = updateMenuFromKeyboard(next, api);
    next = menu.state;
    for (const cue of menu.cues) cues.add(cue);
    if (menu.toggleSound) api.audio.setMuted(!api.audio.muted());
    for (const sample of api.input.pointerSamples()) {
      if (!sample.primary) continue;
      if (sample.type === "down") {
        const result = pointerDownState(next, sample.x, sample.y);
        next = result.state;
        for (const cue of result.cues) cues.add(cue);
      } else if (sample.type === "move") {
        next = pointerMoveState(next, sample.x, sample.y);
      } else {
        const result = pointerUpState(next, sample.x, sample.y);
        next = result.state;
        for (const cue of result.cues) cues.add(cue);
        if (result.toggleSound) api.audio.setMuted(!api.audio.muted());
      }
    }
    const cascade = advanceCascade(next, dt);
    next = cascade.state;
    if (cascade.launched) cues.add(CUES.launch);
    next = { ...next, muted: api.audio.muted() };
    playCues(api, cues);
    return next;
  },

  render(state: DeepReadonly<CascadeState>, api: RenderApi): void {
    const ctx = api.ctx;
    if (state.screen === "title") {
      drawTitle(ctx, state);
      return;
    }
    if (state.screen === "howto") {
      drawHowto(ctx, state);
      return;
    }
    if (state.screen === "won") {
      drawWon(ctx, state);
      return;
    }
    drawTable(ctx);
    drawPiles(ctx, state);
    drawHud(ctx, state);
  },
};
