// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  createArtifactKit,
  downloadFile,
  formatDate,
  formatDateTime,
} from "./reclamationArtifactKit";

afterEach(cleanup);

describe("date helpers", () => {
  it("renders an em dash for missing values", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("")).toBe("—");
    expect(formatDateTime(undefined)).toBe("—");
  });

  it("formats real values", () => {
    const iso = "2026-03-04T10:00:00.000Z";
    expect(formatDate(iso)).toBe(new Date(iso).toLocaleDateString());
    expect(formatDateTime(iso)).toBe(new Date(iso).toLocaleString());
  });
});

describe("createArtifactKit", () => {
  it("binds every class name to the module's prefix", () => {
    const { Blocks } = createArtifactKit("ruc");
    const { container } = render(
      <Blocks
        blocks={[
          { kind: "lines", value: ["one", "two"] },
          { kind: "p", value: "paragraph" },
        ]}
      />,
    );

    expect(container.querySelector(".ruc-lines")).toBeTruthy();
    expect(container.querySelector(".ruc-p")).toBeTruthy();
    expect(container.querySelectorAll(".ruc-lines span")).toHaveLength(2);
  });

  it("keeps modules visually independent", () => {
    const { Blocks } = createArtifactKit("rur");
    const { container } = render(<Blocks blocks={[{ kind: "p", value: "paragraph" }]} />);

    expect(container.querySelector(".rur-p")).toBeTruthy();
    expect(container.querySelector(".ruc-p")).toBeNull();
  });
});

describe("ArtifactField", () => {
  const { ArtifactField } = createArtifactKit("rug");

  it("omits the sub-question element when none is authored", () => {
    // Polarity authors these fields without a question; an empty <small>
    // would change that module's spacing.
    const { container } = render(
      <ArtifactField label="Range" value="" onChange={() => {}} />,
    );

    expect(container.querySelector("small")).toBeNull();
  });

  it("renders the sub-question when one is authored", () => {
    const { container } = render(
      <ArtifactField label="Range" question="What shifted?" value="" onChange={() => {}} />,
    );

    expect(container.querySelector("small").textContent).toBe("What shifted?");
  });

  it("marks the lever card only when highlighted", () => {
    const { container: plain } = render(
      <ArtifactField label="A" value="" onChange={() => {}} />,
    );
    expect(plain.querySelector(".rug-artifact-card").className).toBe("rug-artifact-card");

    cleanup();

    const { container: lever } = render(
      <ArtifactField label="A" value="" onChange={() => {}} highlight />,
    );
    expect(lever.querySelector(".rug-artifact-card").className).toContain("is-lever");
  });

  it("labels the textarea for assistive tech and reports edits", () => {
    const onChange = vi.fn();
    render(<ArtifactField label="My Lever" value="" onChange={onChange} />);

    const field = screen.getByLabelText("My Lever");
    fireEvent.change(field, { target: { value: "next" } });

    expect(onChange).toHaveBeenCalledWith("next");
  });
});

describe("Drawer", () => {
  const { Drawer } = createArtifactKit("ruc");

  it("stays collapsed until toggled and reports its state", () => {
    const onToggle = vi.fn();
    render(
      <Drawer open={false} onToggle={onToggle} label="the chain" rows={[{ k: "A", v: "one" }]} />,
    );

    const toggle = screen.getByRole("button");
    expect(toggle.textContent).toContain("Show");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("one")).toBeNull();

    fireEvent.click(toggle);
    expect(onToggle).toHaveBeenCalled();
  });

  it("renders keyed rows when given rows", () => {
    render(
      <Drawer open onToggle={() => {}} label="l" rows={[{ k: "A", v: "one" }, { k: "B", v: "two" }]} />,
    );

    expect(screen.getByText("A.")).toBeTruthy();
    expect(screen.getByText(/one/)).toBeTruthy();
    expect(screen.getByText(/two/)).toBeTruthy();
  });

  it("falls back to paragraph bodies when no rows are given", () => {
    render(
      <Drawer open onToggle={() => {}} label="l" body={["first para", "second para"]} />,
    );

    expect(screen.getByText("first para")).toBeTruthy();
    expect(screen.getByText("second para")).toBeTruthy();
  });
});

describe("downloadFile", () => {
  it("builds, clicks, and revokes a blob URL without leaking the anchor", () => {
    const createObjectURL = vi.fn(() => "blob:stub");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    try {
      downloadFile("artifact.md", "# hello", "text/markdown");

      expect(createObjectURL).toHaveBeenCalledOnce();
      expect(click).toHaveBeenCalledOnce();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:stub");
      expect(document.querySelectorAll("a")).toHaveLength(0);
    } finally {
      vi.unstubAllGlobals();
      click.mockRestore();
    }
  });
});
