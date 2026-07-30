import { describe, expect, it } from "vitest";
import { getSectionPhase } from "./HermeticCurriculumModule";

describe("Hermetic learning experience section mapping", () => {
  it("maps authored lesson sections into reusable educational phases", () => {
    expect(
      getSectionPhase({ heading: "Introduction", type: "doctrine" }, 0, 12),
    ).toBe("intro");
    expect(
      getSectionPhase({ heading: "The Structure of a Cycle", type: "doctrine" }, 3, 12),
    ).toBe("patterns");
    expect(
      getSectionPhase({ heading: "The Reclamation Lens", type: "doctrine" }, 7, 12),
    ).toBe("reclamation");
    expect(
      getSectionPhase({ heading: "Reflection", type: "reflection" }, 9, 12),
    ).toBe("reflect");
    expect(
      getSectionPhase({ heading: "Reclamation Protocol", type: "activation" }, 10, 12),
    ).toBe("protocol");
    expect(
      getSectionPhase({ heading: "Artifact", type: "activation" }, 11, 12),
    ).toBe("artifact");
  });

  it("uses concept as the stable fallback for teaching sections", () => {
    expect(
      getSectionPhase({ heading: "What Is Rhythm?", type: "doctrine" }, 2, 12),
    ).toBe("concept");
  });

  it("keeps all seven journey tabs as distinct phases", () => {
    const tabs = [
      { heading: "Intro", type: "doctrine" },
      { heading: "Concept", type: "doctrine" },
      { heading: "Patterns", type: "case-study" },
      { heading: "Reclamation Lens", type: "activation" },
      { heading: "Reflect", type: "exercise" },
      { heading: "Protocol", type: "exercise" },
      { heading: "Artifact", type: "activation" },
    ];

    expect(
      tabs.map((tab, index) => getSectionPhase(tab, index, tabs.length)),
    ).toEqual([
      "intro",
      "concept",
      "patterns",
      "reclamation",
      "reflect",
      "protocol",
      "artifact",
    ]);
  });
});
