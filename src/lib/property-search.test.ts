import assert from "node:assert/strict";
import test from "node:test";
import { matchesPropertySearchQuery } from "./property-search.ts";

const wildOlive = {
  name: "The Wild Olive Guesthouse",
  propertyTypeLabel: "Guesthouse",
  provinceLabel: "Gauteng",
  businessNode: "centurion",
  businessNodeLabel: "Centurion",
  locationAddress: "83 Jim Van Der Merwe St, Clubview, Centurion, 0014",
};

test("matches a property through its business node label", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Centurion"), true);
});

test("matches a property through its stored address", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Clubview"), true);
});

test("does not match unrelated location queries", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Umhlanga"), false);
});