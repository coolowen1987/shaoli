# Repository instructions

## Keep the English and Chinese sites synchronized

- Whenever the English version changes, update the corresponding Chinese version in the same change.
- Pair each English content file with its Chinese counterpart: `content/<name>.md` and `content/<name>_chn.md`.
- Mirror changes to page structure, navigation, links, downloadable resources, metadata, interface text, and shared site behavior across both language versions.
- Translate prose and interface text naturally into Chinese; do not translate publication entries. Publication authors, titles, journal information, dates, identifiers, and links in `research_chn.md` must remain identical to `research.md`.
- Treat a website change as incomplete until both language versions have been updated and checked for parity.

<!-- sol-luna-delegation:start -->
## Sol -> Luna delegation

- Keep GPT-5.6 Sol as the primary orchestrator and final integrator.
- Delegate suitable bounded, independent work to the global `luna_worker` custom agent (GPT-5.6 Luna), parallelizing independent workstreams when useful.
- Sol reviews and integrates all worker output. Do not exceed six spawned-agent threads.
<!-- sol-luna-delegation:end -->
