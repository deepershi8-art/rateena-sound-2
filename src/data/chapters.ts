export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  principles: { label: string; text: string }[];
  decision: string;
  diagram: string;
}
export const chapters: Chapter[] = [
  {
    id: "sound",
    number: "01",
    title: "Understanding Sound",
    subtitle: "A room begins with moving air.",
    principles: [
      {
        label: "Pressure, not travelling air",
        text: "Sound is a pressure disturbance. Air particles move back and forth while energy travels through the room.",
      },
      {
        label: "Airborne transmission",
        text: "Pressure excites a boundary. Some energy can pass through it into the next space.",
      },
      {
        label: "Structure-borne transmission",
        text: "Vibration travels along connected floors, walls and building elements, then can radiate as sound.",
      },
    ],
    decision:
      "Design both the airborne barrier and the structural junctions. A quiet wall alone cannot control every transmission path.",
    diagram: "wave",
  },
  {
    id: "isolation-treatment",
    number: "02",
    title: "Isolation vs Treatment",
    subtitle: "Two different problems. Two different tools.",
    principles: [
      {
        label: "Across the boundary",
        text: "Isolation limits transmission between spaces. Walls, doors, junctions and airtightness work as a system.",
      },
      {
        label: "Inside the room",
        text: "Treatment manages reflected energy, resonances and decay. It does not replace an isolation envelope.",
      },
    ],
    decision:
      "Develop the isolation shell separately from the internal acoustic treatment; coordinate both before fixing room dimensions.",
    diagram: "compare",
  },
  {
    id: "static-comparison",
    number: "02.1",
    title: "Isolation & Treatment",
    subtitle: "A static comparison. No simulation. No sound playback.",
    principles: [
      { label: "Isolation", text: "Control sound crossing the room boundary." },
      { label: "Treatment", text: "Control sound behaviour within the room." },
    ],
    decision:
      "Keep boundary performance and internal room response as separate design and verification requirements.",
    diagram: "static",
  },
  {
    id: "geometry",
    number: "03",
    title: "Geometry & Proportions",
    subtitle: "A starting hypothesis, not a certificate.",
    principles: [
      {
        label: "Reference envelope",
        text: "Ratios describe candidate rectangular proportions, not the approved finished room polygon.",
      },
      {
        label: "Compare, then validate",
        text: "Golden, Sepmeyer and Bolt references do not establish one universally superior room.",
      },
    ],
    decision:
      "Compare candidate geometries alongside volume, use, placement, circulation and predicted acoustic behaviour.",
    diagram: "geometry",
  },
  {
    id: "modes",
    number: "04",
    title: "Standing Waves & Modes",
    subtitle: "Boundaries shape low-frequency behaviour.",
    principles: [
      {
        label: "Resonant patterns",
        text: "Reflections can form pressure patterns with frequency-dependent peaks and nulls.",
      },
      {
        label: "A limited first estimate",
        text: "Axial estimates describe individual axes of an ideal rectangular room, not an irregular real room’s complete response.",
      },
    ],
    decision:
      "Review modal distribution and source/listener positions before committing to the control-room geometry.",
    diagram: "modes",
  },
  {
    id: "volume",
    number: "05",
    title: "Volume & Ceiling Height",
    subtitle: "Air volume is a design resource.",
    principles: [
      {
        label: "More than floor area",
        text: "Clear height changes the volume, vertical mode spacing and reflection paths.",
      },
      {
        label: "Allow for construction",
        text: "Isolation and treatment occupy space. Structural height is not finished clear height.",
      },
    ],
    decision:
      "Protect finished clear height in the building brief; test the chosen volume against musical use and decay targets.",
    diagram: "volume",
  },
  {
    id: "reflections",
    number: "06",
    title: "Early Reflections & Diffusion",
    subtitle: "Arrival time and direction matter.",
    principles: [
      {
        label: "First arrivals",
        text: "Early reflected sound interacts with direct sound and can affect localisation and tonal balance.",
      },
      {
        label: "Scattering",
        text: "Diffusion redistributes reflected energy. It does not remove the need to assess listening distance and frequency range.",
      },
    ],
    decision:
      "Evaluate monitoring reflection paths before selecting absorption, reflection or diffusion.",
    diagram: "reflections",
  },
  {
    id: "decay",
    number: "07",
    title: "Reverberation & Decay",
    subtitle: "How energy leaves the room.",
    principles: [
      {
        label: "Frequency-dependent",
        text: "Decay is not one universal number. Its spectral balance matters alongside its duration.",
      },
      {
        label: "Use-led targets",
        text: "A live ensemble and critical monitoring need different acoustic briefs.",
      },
    ],
    decision:
      "Set frequency-band decay targets for each use, then verify with suitable room-acoustic measurements.",
    diagram: "decay",
  },
  {
    id: "variable",
    number: "08",
    title: "Variable Acoustics",
    subtitle: "One live room, different musical intentions.",
    principles: [
      {
        label: "Controlled change",
        text: "Reversible surfaces or curtains can alter absorption within their effective frequency range.",
      },
      {
        label: "Repeatable states",
        text: "Each operating state needs documented settings and a clear acoustic purpose.",
      },
    ],
    decision:
      "Assess practical variable treatment without assuming curtains control all bass behaviour.",
    diagram: "variable",
  },
  {
    id: "hvac",
    number: "09",
    title: "Noise & HVAC",
    subtitle: "Silence is designed into the services.",
    principles: [
      {
        label: "Air and vibration",
        text: "Fans, ducts, terminals and mechanical connections create different noise and vibration paths.",
      },
      {
        label: "Background criteria",
        text: "NC and RC assess room background noise. They are not inter-room isolation ratings.",
      },
    ],
    decision:
      "Coordinate airflow, attenuation, vibration isolation and commissioning. NC-15 remains an aspiration, not a result.",
    diagram: "hvac",
  },
  {
    id: "isolation",
    number: "10",
    title: "Isolation Principles",
    subtitle: "Continuity is as important as mass.",
    principles: [
      {
        label: "Mass • decoupling • damping",
        text: "Assemblies must be assessed together, including resonance and flanking transmission.",
      },
      {
        label: "Airtightness • room-within-room",
        text: "Doors, seals, penetrations and structural bridges can compromise a carefully designed shell.",
      },
    ],
    decision:
      "Develop buildable, coordinated junction details. No single material or universal wall angle guarantees isolation.",
    diagram: "isolation",
  },
  {
    id: "verification",
    number: "11",
    title: "Targets & Verification",
    subtitle: "A design claim needs a traceable path.",
    principles: [
      {
        label: "Evidence states",
        text: "Proposed → Calculated → Simulated → Measured → Verified describes evidence maturity, not automatic approval.",
      },
      {
        label: "Scope matters",
        text: "Room-acoustic measurements, insulation tests and background-noise ratings answer different questions.",
      },
    ],
    decision:
      "Record sources, methods, assumptions and outstanding checks. Never treat a preliminary target as achieved.",
    diagram: "verification",
  },
];
