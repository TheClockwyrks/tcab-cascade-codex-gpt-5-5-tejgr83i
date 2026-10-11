import { describe, expect, it } from "vitest";
import type { InitApi } from "@clockwyrks/simple-2d";
import { CARD_W, STOCK_X, TOP_ROW_Y, WASTE_X } from "./constants";
import { type CascadeDebugApi, type CascadeState, game } from "./game";

function init(): {
  state: CascadeState;
  debug: CascadeDebugApi;
  cues: string[];
  actions: string[];
  diagnostics: string[];
} {
  const cues: string[] = [];
  const actions: string[] = [];
  const diagnostics: string[] = [];
  const api = {
    input: {
      register(name: string) {
        actions.push(name);
      },
      layout: () => null,
    },
    audio: {
      define(cue: string) {
        cues.push(cue);
      },
      load: async () => undefined,
    },
    assets: {
      loadImage: async () => {
        throw new Error("unused");
      },
      loadAudio: async () => {
        throw new Error("unused");
      },
      load: async () => new Blob(),
      resolve: (path: string) => path,
    },
    diagnostics: {
      register(name: string) {
        diagnostics.push(name);
      },
    },
    events: { on: () => () => undefined },
    viewport: () => ({
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
      scale: 1,
      dpr: 1,
    }),
  } as unknown as InitApi<CascadeState>;
  const initialized = game.initialize(api);
  if (initialized instanceof Promise)
    throw new Error("unexpected async initialize");
  const [state, debug] = initialized;
  return { state, debug, cues, actions, diagnostics };
}

describe("Cascade rules", () => {
  it("initializes the required actions, cues, diagnostics, and title state", () => {
    const { state, debug, cues, actions, diagnostics } = init();

    expect(debug.version).toBe(1);
    expect(state.screen).toBe("title");
    expect(actions).toEqual([
      "menu-up",
      "menu-down",
      "menu-confirm",
      "menu-back",
    ]);
    expect(cues).toHaveLength(10);
    expect(diagnostics).toContain("screen");
    expect(diagnostics).toContain("cascade");
  });

  it("deals a full Klondike board with only each column top card face-up", () => {
    const { state, debug } = init();
    const dealt = debug.deal(state);
    const shot = debug.snapshot(dealt);

    expect(shot.stock).toHaveLength(24);
    expect(shot.waste).toHaveLength(0);
    expect(shot.foundations.map((pile) => pile.length)).toEqual([0, 0, 0, 0]);
    expect(shot.tableau.map((pile) => pile.length)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    for (const pile of shot.tableau) {
      expect(pile.slice(0, -1).every((card) => !card.faceUp)).toBe(true);
      expect(pile[pile.length - 1]?.faceUp).toBe(true);
    }
    const ids = new Set(
      [
        ...shot.stock,
        ...shot.tableau.flat(),
        ...shot.waste,
        ...shot.foundations.flat(),
      ].map((card) => card.id),
    );
    expect(ids.size).toBe(52);
  });

  it("turns stock in draw-three sets and recycles waste in reverse", () => {
    const { state, debug } = init();
    let next = debug.deal(state);
    const originalTopThree = next.stock.slice(-3).map((card) => card.id);

    next = debug.turnStock(next);
    let shot = debug.snapshot(next);
    expect(shot.stock).toHaveLength(21);
    expect(shot.waste).toHaveLength(3);
    expect(shot.wasteSets).toEqual([3]);
    expect(shot.waste.map((card) => card.id)).toEqual(
      originalTopThree.reverse(),
    );
    expect(shot.waste.every((card) => card.faceUp)).toBe(true);

    for (let i = 0; i < 7; i += 1) next = debug.turnStock(next);
    shot = debug.snapshot(next);
    expect(shot.stock).toHaveLength(0);
    expect(shot.waste).toHaveLength(24);
    next = debug.turnStock(next);
    shot = debug.snapshot(next);
    expect(shot.stock).toHaveLength(24);
    expect(shot.waste).toHaveLength(0);
    expect(shot.wasteSets).toEqual([]);
    expect(shot.stock.every((card) => !card.faceUp)).toBe(true);
  });

  it("moves cards by tableau and foundation rules and flips exposed cards", () => {
    const { state, debug } = init();
    let next = debug.clearTable(state);
    next = debug.addCard(next, "tableau", 0, "spades", 9, false);
    next = debug.addCard(next, "tableau", 0, "hearts", 8, true);
    next = debug.addCard(next, "tableau", 1, "clubs", 9, true);

    let accepted: boolean;
    [next, accepted] = debug.move(next, "tableau", 0, 1, "tableau", 1);
    expect(accepted).toBe(true);
    let shot = debug.snapshot(next);
    expect(shot.tableau[0]).toHaveLength(1);
    expect(shot.tableau[0]?.[0]?.faceUp).toBe(true);
    expect(shot.tableau[1]?.map((card) => card.rank)).toEqual([9, 8]);

    next = debug.addCard(next, "waste", 0, "diamonds", 1, true);
    next = debug.addWasteSet(next, 1);
    [next, accepted] = debug.move(next, "waste", 0, 0, "foundation", 0);
    shot = debug.snapshot(next);
    expect(accepted).toBe(true);
    expect(shot.foundations[0]?.[0]?.rank).toBe(1);
    expect(shot.wasteVisibleCount).toBe(0);
  });

  it("routes pointer clicks through stock and waste geometry", () => {
    const { state, debug } = init();
    let next = debug.deal(state);
    next = debug.setScreen(next, "playing");
    next = debug.pointerDown(next, STOCK_X + CARD_W / 2, TOP_ROW_Y + 20);
    next = debug.pointerUp(next, STOCK_X + CARD_W / 2, TOP_ROW_Y + 20);
    expect(debug.snapshot(next).wasteVisibleCount).toBe(3);

    next = debug.pointerDown(next, WASTE_X + 2 * 26 + 10, TOP_ROW_Y + 20);
    expect(debug.snapshot(next).drag?.fromPile).toBe("waste");
  });
});
