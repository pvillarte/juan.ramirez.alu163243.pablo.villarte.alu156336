# Roman Numeral Converter - CI/CD System Report

> Note: This report was made by Juan Ramirez (alu.163243) and Pablo Villarte (alu.156336).

## Live Website

**[https://pvillarte.github.io/juan.ramirez.alu163243.pablo.villarte.alu156336/](https://pvillarte.github.io/juan.ramirez.alu163243.pablo.villarte.alu156336/)**

---

## Introduction

The Roman Numeral Converter is publicly available and automatically kept up to date. Any push to `main` that passes all quality gates is live on the website within 2 minutes, with no manual steps involved. The system is built around a GitHub Actions pipeline that enforces two quality gates in sequence; linting and testing, before anything is built or deployed. A separate pipeline runs on every pull request, blocking merges if either gate fails.

---

## What the System Achieves

The pipeline blocks a deploy when a test fails. It also blocks a deploy when the code has style violations, and because linting runs first, a lint failure stops the pipeline before the tests even start. This keeps the feedback precise: a red lint job means style, a red test job means logic, and the deploy only happens when both are clean.

For a developer, this means the feedback loop is nearly instant. Push a commit and within 30 seconds the pipeline reports exactly what is wrong and where. If a regression is introduced (a wrong conversion result, a broken edge case, a style inconsistency) it is caught before it causes any visible damage. There is no need to remember to run tests locally or manually trigger a deployment; the system does it automatically and consistently on every single change, for every contributor.

For a product owner, the consequence is that the live website always reflects code that has been tested and validated. Release confidence does not depend on any one person's discipline or memory. Shipping a new feature is as simple as merging a pull request; the pipeline takes care of everything that follows. And because pull requests are also checked automatically, problems are caught at review time rather than after the fact.

For the end user, the experience is simply that the converter at the live URL always works. They never encounter a broken or half-deployed version, because the pipeline either publishes a fully validated release or publishes nothing at all.

---

## Conclusions

The value of this system is not just automation; it is that quality becomes structural rather than dependent on individual discipline. The same quality bar applies to every commit, every contributor, and every moment of the day. Good code ships itself; bad code does not ship at all.
