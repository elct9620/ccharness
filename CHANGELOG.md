# Changelog

## [0.11.1](https://github.com/elct9620/ccharness/compare/v0.11.0...v0.11.1) (2025-10-02)


### Bug Fixes

* handle JSON responses wrapped in markdown code blocks ([ccd6685](https://github.com/elct9620/ccharness/commit/ccd6685f5d7fad6bcc7bb82b708c8f528907ba2a))

## [0.11.0](https://github.com/elct9620/ccharness/compare/v0.10.1...v0.11.0) (2025-09-21)


### Features

* add CCHARNESS_HOOK_DISABLED environment variable support ([260f878](https://github.com/elct9620/ccharness/commit/260f8780377e1d11200e54530f85d38e442a99fd))

## [0.10.1](https://github.com/elct9620/ccharness/compare/v0.10.0...v0.10.1) (2025-09-19)


### Bug Fixes

* rebuild package to resolve bundling issue with Commander.js ([0dc7b0a](https://github.com/elct9620/ccharness/commit/0dc7b0a7e0c5e78255f213a86d0d8f4d3f2ff3e8))

## [0.10.0](https://github.com/elct9620/ccharness/compare/v0.9.0...v0.10.0) (2025-09-15)


### Features

* implement commit reminder PostToolUse hook ([cf28e94](https://github.com/elct9620/ccharness/commit/cf28e949dc378c01ae52054a49589aeeeae28ae6))

## [0.9.0](https://github.com/elct9620/ccharness/compare/v0.8.0...v0.9.0) (2025-09-14)


### Features

* add general code quality rubric ([0d15899](https://github.com/elct9620/ccharness/commit/0d15899a63d589c2af2db77dc13da74b48358296))
* add rubrics for service, handler, and presenter layers ([a04cd8a](https://github.com/elct9620/ccharness/commit/a04cd8adcf3afaa90ac6ca63a2b0667e3e2d6688))
* implement audit-read PreToolUse hook ([c5f2487](https://github.com/elct9620/ccharness/commit/c5f2487b54f79deb109cdd2e0b4c987ce6fb5a80))


### Bug Fixes

* isolate test configuration to prevent real file loading ([4da8784](https://github.com/elct9620/ccharness/commit/4da8784ee95b690a2b38a6791be6e6c499acb398))

## [0.8.0](https://github.com/elct9620/ccharness/compare/v0.7.0...v0.8.0) (2025-09-06)


### Features

* display criteria names in review details table ([a444be0](https://github.com/elct9620/ccharness/commit/a444be043cf36d6757be5c4674591d16e7bef30e))


### Bug Fixes

* add maxLen constraint to criteria column in review table ([c938b5c](https://github.com/elct9620/ccharness/commit/c938b5cd95b9ab51e5c4d90ff430283585015998))
* remove fallback criteria from empty evaluations ([e7098b7](https://github.com/elct9620/ccharness/commit/e7098b70806597b8ceaae66a6b0d6dad925e73a5))

## [0.7.0](https://github.com/elct9620/ccharness/compare/v0.6.0...v0.7.0) (2025-09-06)


### Features

* add domain-focused quality rubrics for entities and use cases ([b670df6](https://github.com/elct9620/ccharness/commit/b670df66ec144f01209b612bec7a20e23d5c75e0))
* add retry functionality to ClaudeReviewService ([5f9ae4b](https://github.com/elct9620/ccharness/commit/5f9ae4bd903e1c94882b970aacb57144743e6397))


### Bug Fixes

* improve Claude API prompt for more reliable JSON parsing ([32d1807](https://github.com/elct9620/ccharness/commit/32d18074054b8a23e2c16d5dee46c12db99254c4))

## [0.6.0](https://github.com/elct9620/ccharness/compare/v0.5.0...v0.6.0) (2025-09-06)


### Features

* add local config support to JsonConfigService ([90f1c28](https://github.com/elct9620/ccharness/commit/90f1c28fa718e8c34a9035559a3fb88a9f8a7520))
* add project configuration and update gitignore for local overrides ([d0d98a9](https://github.com/elct9620/ccharness/commit/d0d98a9b0a3955a4afc072c80433b171635be663))

## [0.5.0](https://github.com/elct9620/ccharness/compare/v0.4.0...v0.5.0) (2025-09-06)


### Features

* add configurable Claude executable path support ([8bcadfb](https://github.com/elct9620/ccharness/commit/8bcadfbd892db340f3457504fa648925a332bec6))
* add console-table-printer dependency ([92973e5](https://github.com/elct9620/ccharness/commit/92973e5ec533d49496cc411a0c7053815d76f599))
* add detailed evaluation items display to ReviewCode output ([7f31964](https://github.com/elct9620/ccharness/commit/7f31964c6104b2472b5593891e19a52cb874d732))
* add progress tracking to ReviewCode use case ([1f81256](https://github.com/elct9620/ccharness/commit/1f812566bd02ec772e556ffdb64289ed158c051e))
* replace console.log with console-table-printer for review reports ([86c111f](https://github.com/elct9620/ccharness/commit/86c111f697ed354ae7fb01124deed49c3224214a))

## [0.4.0](https://github.com/elct9620/ccharness/compare/v0.3.0...v0.4.0) (2025-09-06)


### Features

* add Evaluation and ReviewReport entities for review system ([5dff956](https://github.com/elct9620/ccharness/commit/5dff956a8e3a4cf0f61bcd3597bdaa1c7b34f9d3))
* add review command for direct file evaluation ([ca1b958](https://github.com/elct9620/ccharness/commit/ca1b9589faea9be12e42db8cf974ef2fc82cb472))
* implement ClaudeReviewService with Claude Code API integration ([fc3fe8c](https://github.com/elct9620/ccharness/commit/fc3fe8c3df9e22ead8c79f29006cd34ea50a2593))
* inject ClaudeReviewService into ReviewCode use case ([434b21b](https://github.com/elct9620/ccharness/commit/434b21b475b8c92b59ad06b5dfb0a0ff15c825a7))


### Bug Fixes

* add build step before npm publish in release workflow ([991f40a](https://github.com/elct9620/ccharness/commit/991f40a47f236ec52caef054e4fe3f527dd1bc71))
* correct export issues in ClaudeReviewService ([462e9c8](https://github.com/elct9620/ccharness/commit/462e9c814159ed358a906c58715a41200c8cdfee))

## [0.3.0](https://github.com/elct9620/ccharness/compare/v0.2.0...v0.3.0) (2025-09-03)

### Features

- add block option to review-reminder hook ([d9c5387](https://github.com/elct9620/ccharness/commit/d9c53877acf90552ce0302a4d4783ef5d10593a7))
- improve review reminder message and fix block option priority ([2fcf91f](https://github.com/elct9620/ccharness/commit/2fcf91f605e7d66dd6401c4086c78d1162b90c0a))

### Bug Fixes

- add missing decision field to PostToolUse presenter block output ([07b2074](https://github.com/elct9620/ccharness/commit/07b207451fbfbc8bfc6a9f36ca1ba9d0d46ea2c9))

## [0.2.0](https://github.com/elct9620/ccharness/compare/v0.1.4...v0.2.0) (2025-08-31)

### Features

- add review-reminder hook for post-tool-use events ([27eb6f3](https://github.com/elct9620/ccharness/commit/27eb6f372538194bb450105e60dc72a425b451a9))
- implement rubric-based review reminders ([4fad860](https://github.com/elct9620/ccharness/commit/4fad860fef70852cce601ba3fa74bb9c697e34b6))

## [0.1.4](https://github.com/elct9620/ccharness/compare/v0.1.3...v0.1.4) (2025-08-30)

### Bug Fixes

- add missing [@injectable](https://github.com/injectable) decorator to JsonWorkingStateBuilder ([78ef106](https://github.com/elct9620/ccharness/commit/78ef10614a46cba40a07246e60734f521b16a0a7))
- correct threshold comparison logic in WorkingState ([c173bf8](https://github.com/elct9620/ccharness/commit/c173bf8130a5033b3741220a265df9cd1097c28f))

## [0.1.3](https://github.com/elct9620/ccharness/compare/v0.1.2...v0.1.3) (2025-08-30)

### Bug Fixes

- restore NODE_AUTH_TOKEN for npm publish ([04cbd70](https://github.com/elct9620/ccharness/commit/04cbd708ff759f60a900f91204d1bb877cb3da76))
- simplify bin field to fix package configuration ([abd709f](https://github.com/elct9620/ccharness/commit/abd709f12df8e3faab54a64196840d60fdbb5d5b))

## [0.1.2](https://github.com/elct9620/ccharness/compare/v0.1.1...v0.1.2) (2025-08-30)

### Bug Fixes

- remove NODE_AUTH_TOKEN from release workflow ([34828b6](https://github.com/elct9620/ccharness/commit/34828b61001aeaba368d99d4d2feeed896ef2360))

## [0.1.1](https://github.com/elct9620/ccharness/compare/v0.1.0...v0.1.1) (2025-08-30)

### Bug Fixes

- remove unnecessary NODE_AUTH_TOKEN from release workflow ([e186a2e](https://github.com/elct9620/ccharness/commit/e186a2e4d9039ecfbd896bbc2413a4f55e672d10))
