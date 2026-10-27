import { OPEN_SHOTS } from "@/components/film/shots/open_shots";
import { INTAKE_SHOTS } from "@/components/film/shots/intake_shots";
import { PLAN_SHOTS } from "@/components/film/shots/plan_shots";
import { AI_SHOTS } from "@/components/film/shots/ai_shots";
import { LAUNCH_SHOTS } from "@/components/film/shots/launch_shots";
import { FINALE_SHOTS } from "@/components/film/shots/finale_shots";

// Shot id (as used in timeline.js EDIT) → component. A shot without a component renders its id as a placeholder.
export const SHOT_COMPONENTS = {
  ...OPEN_SHOTS,
  ...INTAKE_SHOTS,
  ...PLAN_SHOTS,
  ...AI_SHOTS,
  ...LAUNCH_SHOTS,
  ...FINALE_SHOTS,
};
