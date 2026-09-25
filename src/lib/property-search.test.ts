import assert from "node:assert/strict";
import test from "node:test";
import {
  matchesPropertySearchQuery,
  propertyEnquiryWhatsappMessage,
} from "./property-search.ts";

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

test("matches a property through its name", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Wild Olive"), true);
});

test("matches a property name regardless of case or extra spaces", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "  wILD   oLIVE  "), true);
});

test("matches a property through its business node slug", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "centurion"), true);
});

test("matches a property through its province label", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Gauteng"), true);
});

test("matches a property through its province slug", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "gauteng"), true);
});

test("matches a property through its stored address", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Clubview"), true);
});

test("builds property-specific enquiry messages for any property", () => {
  assert.equal(
    propertyEnquiryWhatsappMessage("The Wild Olive Guesthouse"),
    "Hi, I found The Wild Olive Guesthouse on ACOSA and would like to enquire about accommodation.",
  );

  assert.equal(
    propertyEnquiryWhatsappMessage("Die Eike Gastehuis"),
    "Hi, I found Die Eike Gastehuis on ACOSA and would like to enquire about accommodation.",
  );
});

test("does not match unrelated location queries", () => {
  assert.equal(matchesPropertySearchQuery(wildOlive, "Umhlanga"), false);
});