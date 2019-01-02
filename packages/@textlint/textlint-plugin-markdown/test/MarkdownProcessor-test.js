// LICENSE : MIT
"use strict";
import assert from "power-assert";
import { TextlintKernel } from "@textlint/kernel";
import fs from "fs";
import path from "path";
const MarkdownPlugin = require("../src/index");

const lintFile = (filePath, options = true) => {
    const kernel = new TextlintKernel();
    const text = fs.readFileSync(filePath, "utf-8");
    return kernel.lintText(text, {
        filePath,
        ext: ".md",
        plugins: [
            {
                pluginId: "markdown",
                plugin: MarkdownPlugin,
                options
            }
        ],
        rules: [{ ruleId: "no-todo", rule: require("textlint-rule-no-todo").default }]
    });
};
const lintText = (text, options = true) => {
    const kernel = new TextlintKernel();
    return kernel.lintText(text, {
        plugins: [
            {
                pluginId: "markdown",
                plugin: MarkdownPlugin,
                options
            }
        ],
        rules: [{ ruleId: "no-todo", rule: require("textlint-rule-no-todo").default }]
    });
};
describe("MarkdownPlugin", function() {
    context("when target file is a HTML", function() {
        it("should report error", function() {
            const fixturePath = path.join(__dirname, "/error.md");
            return lintFile(fixturePath).then(results => {
                assert(results.messages.length > 0);
                assert(results.filePath === fixturePath);
            });
        });
    });
    context("extensions", function() {
        it("should report error if extensions define .custom extension", function() {
            const fixturePath = path.join(__dirname, "/error.custom");
            return lintFile(fixturePath, {
                extensions: [".custom"]
            }).then(results => {
                assert(results.messages.length > 0);
                assert(results.filePath === fixturePath);
            });
        });
    });
});
