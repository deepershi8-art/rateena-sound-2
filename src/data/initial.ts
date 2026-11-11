import type { AppData, Evidence } from "../lib/types";
export const initialEvidence: Evidence = {
  status: "Proposed",
  source: "Owner’s master application brief, §8–11",
  method: "Preliminary room programme; not a surveyed layout",
  assumptions:
    "Clear internal dimensions after isolation and acoustic finishes. Rectangular reference envelopes only.",
  date: "2026-11-11",
  revision: 0,
  discipline: "Architecture / acoustics",
  validation:
    "Survey; approved geometry; equipment layout, circulation and acoustic optimisation.",
};
export const qualifications = [
  "Every listed height is FINISHED CLEAR HEIGHT after isolation and acoustic construction.",
  "All dimensions are preliminary design candidates, not approved construction measurements.",
  "Areas exclude circulation, sound locks, wall thickness, mechanical services and support facilities.",
  "Overall building area remains TBD until a verified layout exists.",
  "Capacities require equipment-layout and circulation validation.",
  "Control Room and booth dimensions have not yet passed acoustic optimisation.",
];
export const initialData: AppData = {
  schemaVersion: 1,
  projects: [
    {
      id: "flagship-study",
      name: "Flagship Studio — Phase One",
      facilityIds: ["flagship"],
    },
    {
      id: "centre-study",
      name: "RATEENA Sound Center — Phase Two",
      facilityIds: ["centre"],
    },
  ],
  facilities: [
    { id: "flagship", name: "Flagship Studio", phase: 1, state: "active" },
    { id: "centre", name: "RATEENA Sound Center", phase: 2, state: "future" },
  ],
  rooms: [
    {
      id: "live",
      name: "Main Live Room",
      use: "Ensemble recording",
      length: 12,
      width: 7.42,
      height: 4.58,
      capacity: "12–15 musicians",
      evidence: { ...initialEvidence },
    },
    {
      id: "iso1",
      name: "Isolation Room 01",
      use: "Drums / Percussion",
      length: 4.5,
      width: 4,
      height: 3.2,
      evidence: { ...initialEvidence },
    },
    {
      id: "iso2",
      name: "Isolation Room 02",
      use: "Backing Vocals",
      length: 4,
      width: 3.5,
      height: 3,
      evidence: { ...initialEvidence },
    },
    {
      id: "iso3",
      name: "Isolation Room 03",
      use: "Solo Vocal / Instrument",
      length: 3.5,
      width: 3,
      height: 3,
      evidence: { ...initialEvidence },
    },
    {
      id: "control",
      name: "Control Room",
      use: "Monitoring / Production",
      length: 8,
      width: 6,
      height: 3.5,
      evidence: { ...initialEvidence },
    },
  ],
  geometry: {
    units: "m",
    approval: "pending",
    revision: 0,
    walls: [],
    polygons: [],
    openings: [],
    soundLocks: [],
    routes: [],
    dimensions: [],
    layers: [
      { id: "grid", name: "Metric grid", visible: true },
      { id: "walls", name: "Walls & openings", visible: true },
      { id: "rooms", name: "Room geometry", visible: true },
      { id: "dimensions", name: "Dimensions", visible: true },
      { id: "routes", name: "Sightlines & circulation", visible: true },
    ],
  },
  references: [
    {
      id: "iso3382-1",
      name: "ISO 3382-1",
      scope: "Measurement of room acoustic parameters — performance spaces.",
      url: "https://www.iso.org/search.html?q=ISO%203382-1",
    },
    {
      id: "iso3382-2",
      name: "ISO 3382-2",
      scope: "Measurement of reverberation time in ordinary rooms.",
      url: "https://www.iso.org/search.html?q=ISO%203382-2",
    },
    {
      id: "iso16283-1",
      name: "ISO 16283-1",
      scope:
        "Field measurement of sound insulation — airborne sound insulation between rooms.",
      url: "https://www.iso.org/search.html?q=ISO%2016283-1",
    },
    {
      id: "iso16283-3",
      name: "ISO 16283-3",
      scope: "Field measurement of sound insulation — façade sound insulation.",
      url: "https://www.iso.org/search.html?q=ISO%2016283-3",
    },
    {
      id: "iso717",
      name: "ISO 717-1",
      scope: "Rating of sound insulation — airborne sound insulation.",
      url: "https://www.iso.org/search.html?q=ISO%20717-1",
    },
    {
      id: "noise",
      name: "NC / RC curves",
      scope:
        "Noise Criteria / Room Criteria methodologies for assessing indoor background noise. Not a sound-insulation rating.",
    },
    {
      id: "sepmeyer",
      name: "Sepmeyer (1965)",
      scope:
        "Rectangular room modal-distribution research; candidate ratios, not certification.",
      url: "https://doi.org/10.1121/1.1909344",
    },
    {
      id: "ratios",
      name: "Published proportion table",
      scope:
        "Secondary source cross-check of Sepmeyer A 1:1.14:1.39; B 1:1.28:1.54; C 1:1.60:2.33.",
      url: "https://acoustic.ua/forms/rr.en.html",
    },
    {
      id: "bolt",
      name: "Bolt (1946)",
      scope:
        "Illustrative proportional regions for preliminary modal distribution. No compliance assessment implemented.",
      url: "https://doi.org/10.1121/1.1916349",
    },
  ],
  targets: [
    {
      id: "hvac",
      name: "HVAC background noise",
      target: {
        value: "NC-15 aspiration",
        unit: "",
        evidence: {
          ...initialEvidence,
          method: "Proposed aspiration only; no achieved rating",
          validation:
            "Services design, octave-band noise prediction and field commissioning; confirm suitability with acoustician.",
        },
      },
    },
    {
      id: "isolation",
      name: "Inter-room isolation",
      target: {
        value: "Performance brief pending",
        unit: "",
        evidence: {
          ...initialEvidence,
          method: "Define source spectra and receiving-room needs",
          validation:
            "Set frequency-dependent requirements; junction and door design; field sound-insulation tests.",
        },
      },
    },
    {
      id: "decay",
      name: "Reverberation by frequency band",
      target: {
        value: "Targets to be developed",
        unit: "",
        evidence: {
          ...initialEvidence,
          method: "Room-use-led acoustic brief; no numeric RT target yet",
          validation:
            "Define octave-band targets, model treatment and commission measurements.",
        },
      },
    },
    {
      id: "monitor",
      name: "Monitoring accuracy",
      target: {
        value: "Acceptance criteria pending",
        unit: "",
        evidence: {
          ...initialEvidence,
          method: "Monitoring design and commissioning plan to be developed",
          validation:
            "Speaker/listener geometry, transfer functions and in-room measurements.",
        },
      },
    },
    {
      id: "variable",
      name: "Flexible live-room acoustics",
      target: {
        value: "Design intent",
        unit: "",
        evidence: {
          ...initialEvidence,
          method: "Assess reversible absorption and reflective surfaces",
          validation: "Specify operating states and compare measured decay.",
        },
      },
    },
  ],
  verification: [
    {
      id: "survey",
      title: "Site survey and approved geometric layout",
      stage: "Pending",
      note: "",
    },
    {
      id: "capacity",
      title: "Equipment, circulation and capacity validation",
      stage: "Pending",
      note: "",
    },
    {
      id: "modal",
      title: "Modal comparison and acoustic simulation",
      stage: "Pending",
      note: "",
    },
    {
      id: "services",
      title: "HVAC noise and vibration assessment",
      stage: "Pending",
      note: "",
    },
    {
      id: "isolation",
      title: "Isolation detail review and field testing",
      stage: "Pending",
      note: "",
    },
    {
      id: "commissioning",
      title: "Monitoring and room-acoustic commissioning",
      stage: "Pending",
      note: "",
    },
  ],
  verificationResults: [],
  decisions: [],
  revisions: [],
};
