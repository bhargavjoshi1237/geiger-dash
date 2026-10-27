import { CREATE_SHOTS } from "@/components/film/events/shots/create_shots";
import { SELL_SHOTS } from "@/components/film/events/shots/sell_shots";
import { DOOR_SHOTS } from "@/components/film/events/shots/door_shots";
import { FINALE_SHOTS } from "@/components/film/events/shots/finale_shots";

// Shot id (as used in events/timeline.js) → component, for both the film and its 15 s cutdown.
export const EVENTS_SHOTS = { ...CREATE_SHOTS, ...SELL_SHOTS, ...DOOR_SHOTS, ...FINALE_SHOTS };
