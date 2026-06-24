# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **Jekyll static site published to GitHub Pages** that serves as the course site and content repository for *เทคโนโลยีดิจิทัลสำหรับวิศวกรรม (Digital Technology for Engineering)* — a 15-week IoT course for 1st-year mechanical engineering students. **Nearly all prose content is in Thai.** Match the existing Thai writing style (professional, accessible, university-level) when editing chapters or labs.

Published at `https://alfaXphoori.github.io/TechEngineering` (note the `baseurl: /TechEngineering` in `_config.yml`).

## Repository layout

- `index.html` — the homepage (`layout: home`); hand-authored HTML with the 15-week schedule, CLOs, grading, and tools tables.
- `weekly-lesson-plan.md` — full weekly lesson plan (CLO/LLO mapping, assessment). Served as a page.
- `chapters/chNN-*/README.md` — the 10 theory chapters. **These are the primary content.**
- `chapters/summary.md` — course-wide summary; treat it as the canonical structure/terminology reference that chapters must stay consistent with.
- `labs/labNN-*.md` — 15 hands-on lab worksheets (3 hrs each), paired roughly to weeks.
- `_layouts/` (`default.html`, `home.html`) + `_includes/` (`head`, `header`, `footer`) — custom layout, **no off-the-shelf theme**.
- `assets/css/style.css` — single stylesheet for the whole site.
- `generate_mermaid.py` — standalone helper that renders a Mermaid diagram to PNG via the `mermaid.ink` web API (writes into `chapters/ch01-iot-introduction/images/`). Run with plain `python3 generate_mermaid.py`.

### Important Jekyll quirk
`_config.yml` **excludes `README.md` from the build**. So `chapters/*/README.md` are *source content viewed on GitHub*, not rendered site pages — they have no front matter and start directly with a `# Chapter N` heading. Only `index.html`, `weekly-lesson-plan.md`, `chapters/summary.md`, and `labs/*.md` become site pages. Don't add Jekyll front matter to chapter READMEs.

## Building / previewing locally

There is **no Gemfile** — the site relies on the GitHub Pages default Jekyll environment. To preview locally you need Jekyll installed, and because `baseurl` is `/TechEngineering` you must override it:

```bash
jekyll serve --baseurl ""        # serves at http://localhost:4000/
```

`.gitignore` reserves `_config_local.yml` for a local-only config override (and ignores `_site/`, `.jekyll-cache/`). There is no test/lint step — validation is visual review of the rendered Markdown/HTML and the published Pages site.

## Content conventions (chapters & labs)

When expanding or editing course content, follow the standard established in `PROJECT.md`:

1. **Theoretical depth** — explain the underlying physics/computation (e.g., ADC conversion, PWM duty-cycle math, MQTT topic structure), not just usage.
2. **Mechanical/industrial examples** — ground concepts in relatable ME applications (vibration-based predictive maintenance, boiler temperature control, conveyor belts).
3. **Correct, compilable code** — C++ for Arduino/ESP32, Python for ML, JSON for payloads.
4. **Consistency** — keep headings, tables, and terminology aligned with `chapters/summary.md`.
5. **Diagrams** — chapters favor hand-authored **CSS-animated inline SVG** embedded directly in the Markdown (see recent git history); prefer this over external image files for new diagrams.

The course toolchain referenced throughout: **Wokwi** (ESP32 simulation, the main lab platform), **Arduino IDE** (ESP32 core), **ThingsBoard Cloud**, **Node-RED**, **Google Colab**.

## The `.agents/` directory

`.agents/` is a multi-agent orchestration workspace (orchestrator → explorer/worker/reviewer roles, organized by chapter and milestone) used to drive bulk chapter-expansion work. It is scratch/handoff state (`BRIEFING.md`, `progress.md`, `handoff.md`, etc.), **not course content** — ignore it unless you are specifically continuing that workflow.
