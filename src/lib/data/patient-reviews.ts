import type { PatientReview } from "./types";
import { loadContent } from "../api";

export const reviewSourceLinks = {
  yandex:
    "https://yandex.ru/maps/org/femili_dent/16415187433/reviews/?ll=68.804420%2C38.563485&tab=reviews&z=16.54",
  googleFamilyDent:
    "https://www.google.com/maps/place/Family+Dent/@38.563438,68.8018967,17z/data=!4m8!3m7!1s0x38b5d1aba35cafc3:0xd10cb723db2752e2!8m2!3d38.563438!4d68.8044716!9m1!1b1!16s%2Fg%2F11jv8kdh_9?entry=ttu",
  googleFamilyDent2:
    "https://www.google.com/maps/place/Family+Dent+2/@38.5489051,68.7583137,17z/data=!4m8!3m7!1s0x6bdc250bce99c505:0x19fb711797678402!8m2!3d38.5489009!4d68.7608886!9m1!1b1!16s%2Fg%2F11ymnbcpkx?entry=ttu",
  instagram: "https://www.instagram.com/reel/DdRO6_BIVc6/",
} as const;

export const googleReviewSources = [
  {
    id: "google-family-dent",
    name: "Family Dent",
    branch: "улица Айни, 45",
    href: reviewSourceLinks.googleFamilyDent,
  },
  {
    id: "google-family-dent-2",
    name: "Family Dent 2",
    branch: "второй филиал",
    href: reviewSourceLinks.googleFamilyDent2,
  },
] as const;


export async function getPatientReviews(): Promise<PatientReview[]> {
  return loadContent<PatientReview>("reviews");
}
