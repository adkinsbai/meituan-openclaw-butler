#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(root, "data");

function readJson(name) {
  return JSON.parse(readFileSync(join(dataDir, name), "utf8"));
}

function writeJson(name, value) {
  writeFileSync(join(dataDir, name), `${JSON.stringify(value, null, 2)}\n`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function notFound(command) {
  output({
    error: "unknown_command",
    command,
    available: [
      "scene.detect",
      "service.suggest",
      "activity.discover",
      "preference.update",
      "broker.scan",
      "broker.poll-agents",
      "broker.propose-groups",
      "agent.explore",
      "a2a.propose",
      "a2a.negotiate",
      "group.plan",
      "group.match",
      "group.invite",
      "group.reserve"
    ]
  });
  process.exitCode = 1;
}

const [command, ...rest] = process.argv.slice(2);
const args = parseArgs(rest);

switch (command) {
  case "scene.detect": {
    const text = args.text || "";
    const context = readJson("context.json");
    const scene = text.includes("商场") || text.includes("不知道")
      ? "mall_discovery"
      : text.includes("玩") || text.includes("组")
        ? "group_activity"
        : "late_work_rainy_home";
    output({
      scene,
      confidence: 0.91,
      signals: scene === "mall_discovery"
        ? ["in_mall", "no_next_plan", "rain", "not_meal_time", "low_energy"]
        : ["wants_group", "after_work", "rain", "indoor_preferred"],
      context,
      needs: scene === "mall_discovery"
        ? ["rest", "light_activity", "future_dinner_plan"]
        : ["activity", "companions", "venue", "reservation"]
    });
    break;
  }

  case "service.suggest": {
    const catalog = readJson("service_catalog.json");
    output(catalog.slice(0, 4).map((service, index) => ({
      ...service,
      priority: index + 1,
      reason: `当前场景命中 ${service.solves[0]}，适合唤醒 ${service.name}`
    })));
    break;
  }

  case "activity.discover": {
    const activities = readJson("activities.json");
    output({
      location: args.location || "朝阳大悦城",
      time: args.time || "16:40",
      weather: args.weather || "rain",
      explore_level: args["explore-level"] || "medium",
      recommendations: activities
    });
    break;
  }

  case "preference.update": {
    output({
      status: "updated",
      activity_id: args["activity-id"] || "act_003",
      feedback: args.feedback || "interested",
      changed_weights: [
        { category: "experience_course", delta: 0.12 },
        { category: "indoor_activity", delta: 0.08 }
      ],
      next_explore_level: args.feedback === "safe" ? "low" : "medium"
    });
    break;
  }

  case "broker.scan": {
    const venues = readJson("venues.json");
    output({
      business_area: args["business-area"] || "望京",
      time_window: args["time-window"] || "19:00-22:00",
      context: {
        weather: args.weather || "rain",
        recommended_activity_type: "indoor"
      },
      available_resources: venues,
      suggested_poll: {
        candidate_activity_types: ["board_game", "ktv", "movie"],
        budget_ranges: ["50-100", "100-150"],
        group_sizes: [4, 6]
      }
    });
    break;
  }

  case "broker.poll-agents": {
    const agents = readJson("agent_profiles.json");
    output({
      request_id: "broker_req_001",
      polled_agents: agents.length,
      responses: agents,
      privacy: {
        only_anonymous_summary: true,
        exact_location_hidden: true,
        real_contact_hidden: true
      }
    });
    break;
  }

  case "broker.propose-groups": {
    output(readJson("group_proposals.json"));
    break;
  }

  case "agent.explore": {
    output({
      owner_id: args["owner-id"] || "user_001",
      explore_mode: args.mode || "low_interrupt",
      opportunities: [
        {
          opportunity_id: "opp_001",
          type: "group_activity",
          activity: "轻策略桌游",
          business_area: "望京",
          time: "19:30-21:30",
          match_score: 0.86,
          reason: "主人周五晚常空闲，收藏过桌游店，当前下雨适合室内活动",
          suggested_action: "a2a_probe"
        }
      ]
    });
    break;
  }

  case "a2a.propose": {
    output({
      proposal_id: "proposal_001",
      status: "probing",
      sent_to_agents: ["agent_user_102", "agent_user_203", "agent_user_316"],
      shared_info: {
        activity: args.activity || "board_game",
        business_area: args["business-area"] || "望京",
        time_window: args["time-window"] || "19:30-21:30",
        budget_per_person: "50-100",
        verified_venue_only: true
      },
      privacy: {
        exact_location_hidden: true,
        real_contact_hidden: true,
        owner_identity_hidden_until_confirmed: true
      }
    });
    break;
  }

  case "a2a.negotiate": {
    output(readJson("a2a_proposal.json"));
    break;
  }

  case "group.plan": {
    output({
      group_intent: "indoor_social_activity",
      recommended_activity: "board_game",
      reason: "今晚下雨，用户 19:00 后空闲，历史收藏过桌游和密室，适合室内低门槛社交",
      target_size: 4,
      time_window: "19:30-21:30",
      budget_per_person: 80,
      candidate_services: ["board_game", "dinner_deal", "drink_pickup"],
      fallback_activity: "movie"
    });
    break;
  }

  case "group.match": {
    output(readJson("group_matches.json"));
    break;
  }

  case "group.invite": {
    output({
      group_id: "group_20260605_001",
      status: "inviting",
      activity: args.activity || "board_game",
      time: args.time || "19:30",
      venue_id: args["venue-id"] || "venue_001",
      rsvp: [
        { user_id: "friend_001", status: "accepted" },
        { user_id: "match_001", status: "accepted" },
        { user_id: "match_002", status: "pending" }
      ]
    });
    break;
  }

  case "group.reserve": {
    const reservation = {
      reservation_id: "reserve_20260605_001",
      status: "reserved",
      venue: "岛上桌游 望京店",
      time: "19:30-21:30",
      package: "4 人轻策略桌游套餐",
      price_per_person: 68,
      payment_mode: "AA",
      next_suggestion: {
        service: "dinner_deal",
        title: "结束后可接 21:40 夜宵套餐，人均 88 元"
      }
    };
    writeJson("reservations.json", [reservation]);
    output(reservation);
    break;
  }

  default:
    notFound(command);
}
