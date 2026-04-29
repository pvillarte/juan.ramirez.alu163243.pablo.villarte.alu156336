![CI](https://github.com/pvillarte/juan.ramirez.alu163243.pablo.villarte.alu156336/actions/workflows/main.yml/badge.svg)

# Roman Numeral Converter

A strict Roman numeral converter that converts integers (1–3999) to Roman numerals and vice versa, with full structural validation.

## Live Website

[https://pvillarte.github.io/juan.ramirez.alu163243.pablo.villarte.alu156336/](https://pvillarte.github.io/juan.ramirez.alu163243.pablo.villarte.alu156336/)

## CI/CD Pipeline

Every push to `main` triggers a 4-stage pipeline:

1. **Lint** — ESLint checks code style (single quotes, 2-space indent, semicolons)
2. **Test** — All Mocha tests run headlessly in Chrome
3. **Build** — Source files are packaged into a deployable artifact
4. **Deploy** — The app is published live to GitHub Pages

Pull requests trigger a separate `PRChecker` pipeline (lint → test only) to block merging broken code.
