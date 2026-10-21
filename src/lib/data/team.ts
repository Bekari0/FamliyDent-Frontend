import type { TeamMember } from "./types";
import { loadContent } from "../api";

export async function getTeamMembers(): Promise<TeamMember[]> {
  return loadContent<TeamMember>("team");
}

export async function getTeamMembersByCategory(category: import("./types").TeamCategory): Promise<TeamMember[]> {
  return (await getTeamMembers()).filter((member) => member.category === category);
}
