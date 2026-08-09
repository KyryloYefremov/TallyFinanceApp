import { describe, expect, it } from "vitest";
import { normalizeEntityName } from "./nameValidation.js";

describe("name validation", () => {
  it("trims valid entity names", () => {
    expect(normalizeEntityName("  Main card  ", "Account")).toBe("Main card");
  });

  it("rejects blank entity names", () => {
    expect(() => normalizeEntityName("   ", "Category")).toThrow("Category name is required");
  });
});
