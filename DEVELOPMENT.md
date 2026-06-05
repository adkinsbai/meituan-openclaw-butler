# Development Guide

## Prerequisites

- Node.js 20+
- npm 10+

## Run Mock Tools

From the repository root:

```bash
npm run test:mock
```

Single command examples:

```bash
npm run mock -- scene.detect --text "我不知道接下来干嘛"
npm run mock -- activity.discover --location "朝阳大悦城" --time "16:40" --weather rain --explore-level medium
npm run mock -- broker.scan --business-area "望京" --time-window "19:00-22:00" --weather rain
npm run mock -- broker.poll-agents --business-area "望京" --activity-types "board_game,ktv,movie" --time-window "19:00-22:00"
npm run mock -- broker.propose-groups --request-id broker_req_001
npm run mock -- group.reserve --group-id group_20260605_001 --venue-id venue_001 --package-id pkg_board_game_4p
```

## Run Web Demo

```bash
npm install --prefix web-demo
npm run dev
```

Then open the local Vite URL printed by the command.

## Build

```bash
npm run build
```

## OpenClaw Integration

The OpenClaw integration assets are in `openclaw/`:

- `openclaw/tools.json`: mock CLI tool definitions.
- `openclaw/prompts/orchestrator.md`: orchestration prompt.
- `openclaw/prompts/guardian.md`: privacy and confirmation prompt.

The current hackathon implementation can run without real Meituan APIs. The mock tools return deterministic JSON, so they can be replaced by internal Meituan services later without changing the Agent flow.
