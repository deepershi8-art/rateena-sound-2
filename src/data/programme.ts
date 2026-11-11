import type { ProgrammeRoom, Evidence, Reference } from "../lib/types";
export const conceptEvidence: Evidence = {
  status: "Proposed",
  source:
    "Owner’s latest architectural concept and existing-application update, 11 Nov 2026",
  method:
    "Transcription of labelled dimensions and provisional net-area targets; not a survey",
  assumptions:
    "Clear internal rectangular reference envelopes. Angled finished polygons, build-ups and final footprint are not approved.",
  date: "2026-11-11",
  revision: 0,
  discipline: "Architecture / acoustics",
  validation:
    "Resolve inconsistent concept dimensions; site survey; circulation, accessibility, doors, structure, services and acoustic design.",
};
const make = (
  id: string,
  name: string,
  shortName: string,
  purpose: string,
  areaTarget: number,
  length: number,
  width: number,
  height: number | null,
  basis: "concept" | "area-derived" = "concept",
): ProgrammeRoom => ({
  id,
  name,
  shortName,
  purpose,
  areaTarget,
  length,
  width,
  height,
  dimensionBasis: basis,
  capacity: GENERIC_CAPACITY,
  evidence: {
    ...conceptEvidence,
    ...(basis === "area-derived"
      ? {
          source:
            "Owner area target; area-derived reference shape, NOT dimensioned in concept",
          method: `Illustrative ${length.toFixed(2)} × ${width.toFixed(2)} m envelope matching the area target`,
          assumptions:
            "Envelope shape chosen only to test true-scale adjacency. This is an explicit spatial-study assumption, not a supplied or approved dimension.",
        }
      : {}),
  },
});
export const GENERIC_CAPACITY =
  "To be validated against the equipment layout and circulation.";
export const LIVE_PROGRAMME_CAPACITY =
  "Design target: up to 25 musicians (owner, 11 Nov 2026; supersedes the earlier 12–15 reference). Layout, circulation, ventilation and egress to be validated.";
export const preliminaryProgramme: ProgrammeRoom[] = [
  {
    ...make(
      "live",
      "Main Live Room",
      "Main Live Room",
      "Ensemble recording",
      100,
      12,
      8.33,
      4.5,
    ),
    capacity: LIVE_PROGRAMME_CAPACITY,
  },
  make(
    "control",
    "Control Room",
    "Control Room",
    "Monitoring and production",
    24.5,
    5,
    4.9,
    3.6,
  ),
  make(
    "percussion",
    "Percussion Isolation Booth",
    "Percussion",
    "Drums and percussion",
    18,
    4,
    4.5,
    null,
  ),
  make(
    "bass",
    "Bass / Rhythm Isolation Booth",
    "Bass / Rhythm",
    "Bass and rhythm recording",
    7.5,
    3,
    2.5,
    null,
  ),
  make(
    "vocal",
    "Vocal Isolation Booth",
    "Vocal",
    "Vocal recording",
    7.5,
    3,
    2.5,
    null,
  ),
  make(
    "equipment",
    "Equipment Room",
    "Equipment / Tech",
    "Technical equipment",
    8,
    2,
    4,
    null,
    "area-derived",
  ),
  make(
    "storage",
    "Storage Room",
    "Storage",
    "Equipment and instrument storage",
    10,
    2,
    5,
    null,
    "area-derived",
  ),
  make(
    "lounge",
    "Lounge & Services",
    "Lounge & Services",
    "Lounge, toilets and supporting facilities",
    70,
    12,
    5.85,
    3,
  ),
];
export const conceptClarifications = [
  "The image labels the overall envelope 12.00 × 14.18 m, but its vertical bands 8.33 + 5.85 + 5.85 total 20.03 m. These cannot describe the same rectangular footprint.",
  "Its room targets total 245.5 m², exceeding 12.00 × 14.18 = 170.16 m² before adding walls, cavities or circulation. The stated overall footprint is therefore not adopted.",
  "The live-room dimensions calculate to 99.96 m² versus a rounded target of 100 m²; the lounge calculates to 70.20 m² versus a rounded target of 70 m². Both target and calculated values are retained.",
  "The middle row’s 4 m percussion, 5 m control and 3 m booth widths already total 12 m, before equipment, storage, partitions or isolation zones. The true-scale study expands the middle band rather than shrinking rooms to fake a fit.",
  "The shown 5.00 × 4.90 control envelope gives 24.5 m² only as a rectangle. Angled corners in the concept cannot retain that net area without dimensioned finished polygons.",
  "Live / control / lounge heights of 4.50 / 3.60 / 3.00 m are Proposed from the concept section. Other room heights are unspecified. The image’s overall 4.50 m height label is not applied to every room.",
  "Equipment 2.00 × 4.00 m and storage 2.00 × 5.00 m are explicit area-derived diagram assumptions, because the image supplies areas but no dimensions. Edit them when actual dimensions are agreed.",
  "The nominal 0.30 m wall zone is a Proposed spatial-study assumption, not an engineered Room-in-Room build-up. Final wall thicknesses, independent leaves, cavities and structural allowances require design.",
  "The spatial study reserves a typical 1.20 m access strip to the east of the booths and below the middle band, outside clear room areas. This is an explicit circulation assumption, not a verified accessible/escape route.",
  "Door locations, WC cubicles and furniture are illustrative typical-size references, not approved access, egress, acoustic-door, sound-lock or accessibility details.",
  "A 2.74 m concert grand leaves only 0.26 m along a 3 m booth axis before player, door and treatment clearance. A viable piano-booth layout is not claimed; the grand is shown in the Main Live Room only.",
  "Room-in-Room is the integrated isolation intent. Mass, decoupling, damping and floating construction are complementary techniques; support type and room-specific loads/resonances remain to be engineered. No universal springs or common isolated raft are assumed.",
  "Building footprint / gross area remains TBD. This true-scale arrangement is an expanded, provisional spatial study, not a traced, approved construction plan.",
];
export const additionalReferences: Reference[] = [
  {
    id: "iec61672",
    name: "IEC 61672-1",
    scope:
      "Sound level meters — performance specifications. Instrument requirements, not a studio room certification.",
    url: "https://webstore.iec.ch/en/search?query=IEC%2061672-1",
  },
  {
    id: "iec61260",
    name: "IEC 61260-1",
    scope:
      "Octave-band and fractional-octave-band filters — specifications. Relevant to measurement instrumentation.",
    url: "https://webstore.iec.ch/en/search?query=IEC%2061260-1",
  },
  {
    id: "itu1116",
    name: "ITU-R BS.1116",
    scope:
      "Methods for subjective assessment of small impairments in audio systems. Not an isolation construction standard.",
    url: "https://www.itu.int/rec/R-REC-BS.1116/en",
  },
  {
    id: "ebu3276",
    name: "EBU Tech 3276",
    scope:
      "Listening conditions for assessment of sound programme material. Applicability and current documents must be reviewed by the consultant.",
    url: "https://tech.ebu.ch/publications/tech3276",
  },
];
