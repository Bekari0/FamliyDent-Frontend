import type { ClinicSpace } from "./types";

const branchPhotos = [
  { branch: "Айни", count: 18, prefix: "ayni" },
  { branch: "Молодёжный", count: 7, prefix: "molodezhny" },
];

const clinicSpacesData: ClinicSpace[] = branchPhotos.flatMap(({ branch, count, prefix }) =>
  Array.from({ length: count }, (_, index) => ({
    id: `space-${prefix}-${index + 1}`,
    slug: `${prefix}-${index + 1}`,
    title: branch,
    description: `Интерьер филиала Family Dent «${branch}».`,
    image: `/images/clinic-tour/${prefix}-${index + 1}.webp`,
    order: index + 1,
  })),
);

export async function getClinicSpaces(): Promise<ClinicSpace[]> {
  return clinicSpacesData;
}
