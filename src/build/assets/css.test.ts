import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inlineStylesheet } from "./css.ts";

describe("inlineStylesheet", () => {
    const page = '<head><link rel="stylesheet" href="/style.css"/></head>';

    it("swaps the stylesheet link for the CSS", () => {
        assert.equal(inlineStylesheet(page, "a{b:c}"), "<head><style>a{b:c}</style></head>");
    });

    it("keeps the CSS from closing the style element early", () => {
        assert.equal(
            inlineStylesheet(page, 'a::after{content:"</style>"}'),
            '<head><style>a::after{content:"<\\/style>"}</style></head>',
        );
    });

    it("leaves $ patterns in the CSS alone", () => {
        assert.match(inlineStylesheet(page, "a{content:'$&'}"), /content:'\$&'/);
    });

    it("throws for a page without the link", () => {
        assert.throws(() => inlineStylesheet("<head></head>", "a{}"), /No <link/);
    });
});
