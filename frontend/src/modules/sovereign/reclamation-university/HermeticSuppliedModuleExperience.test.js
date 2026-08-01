import { describe, expect, it } from "vitest";
import { MODULE_COPY } from "./HermeticSuppliedModuleExperience";

const expectedSections = [
  "INTRO", "PRINCIPLE", "KEY CONCEPTS", "WHY IT MATTERS", "DOMAINS",
  "RECLAMATION", "2026 LENS", "REFLECTION", "PROTOCOL", "ARTIFACT", "SUMMARY",
];

describe("supplied Hermetic module copy", () => {
  it.each([
    ["mentalism", "Who was shaping your mind", "Mental Model Map"],
    ["correspondence", "What can the patterns", "Correspondence Map"],
  ])("populates every tab for %s", (slug, introCopy, artifactCopy) => {
    expect(Object.keys(MODULE_COPY[slug].sections)).toEqual(expectedSections);
    expect(MODULE_COPY[slug].sections.INTRO).toContain(introCopy);
    expect(MODULE_COPY[slug].sections.ARTIFACT).toContain(artifactCopy);
    expectedSections.forEach((section) => expect(MODULE_COPY[slug].sections[section]).not.toBe("") );
  });
});
