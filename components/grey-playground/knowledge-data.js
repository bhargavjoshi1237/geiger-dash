// Kestrel Aero's knowledge graph and a few scripted answers: a local stand-in for Geiger Grey's graph and cited answers.

// The suite palette is neutral (see /pallet), so types differ by shape, not colour.
export const ENTITY_TYPES = [
  { id: "person", label: "Person", shape: "circle" },
  { id: "procedure", label: "Procedure", shape: "square" },
  { id: "source", label: "Source", shape: "diamond" },
  { id: "aircraft", label: "Aircraft", shape: "triangle" },
  { id: "place", label: "Place", shape: "ring" },
];

export const SHAPE_BY_TYPE = Object.fromEntries(ENTITY_TYPES.map((type) => [type.id, type.shape]));

export const NODES = [
  { id: "priya", type: "person", label: "Priya Nair", blurb: "the line maintenance lead" },
  { id: "marco", type: "person", label: "Marco Silva", blurb: "the day-shift ramp controller" },
  { id: "ana", type: "person", label: "Ana Ruiz", blurb: "a B1 licensed engineer" },
  { id: "tom", type: "person", label: "Tom Okafor", blurb: "the safety officer" },
  { id: "lena", type: "person", label: "Lena Hart", blurb: "the crew scheduler" },
  { id: "sam", type: "person", label: "Sam Achebe", blurb: "the hangar planner" },
  { id: "ines", type: "person", label: "Ines Duarte", blurb: "the stores controller" },
  { id: "ravi", type: "person", label: "Ravi Menon", blurb: "a B2 avionics engineer" },
  { id: "hana", type: "person", label: "Hana Kim", blurb: "the quality auditor" },
  { id: "owen", type: "person", label: "Owen Price", blurb: "an apprentice mechanic" },
  { id: "zoe", type: "person", label: "Zoe Laurent", blurb: "the operations duty manager" },
  { id: "felix", type: "person", label: "Felix Brandt", blurb: "the tooling coordinator" },

  { id: "apu", type: "procedure", label: "APU start", blurb: "the ground APU start procedure" },
  { id: "deice", type: "procedure", label: "De-icing", blurb: "the de-icing procedure" },
  { id: "runup", type: "procedure", label: "Engine run-up", blurb: "the engine run-up procedure" },
  { id: "handover", type: "procedure", label: "Shift handover", blurb: "the night-to-day shift handover" },
  { id: "acheck", type: "procedure", label: "A-check", blurb: "the routine A-check" },
  { id: "tyres", type: "procedure", label: "Tyre change", blurb: "the main-wheel tyre change" },
  { id: "brakes", type: "procedure", label: "Brake wear check", blurb: "the brake wear-pin check" },
  { id: "oil", type: "procedure", label: "Oil top-up", blurb: "the engine oil top-up" },
  { id: "borescope", type: "procedure", label: "Borescope inspection", blurb: "the engine borescope inspection" },
  { id: "cabinlog", type: "procedure", label: "Cabin defect log", blurb: "how cabin defects are logged and deferred" },
  { id: "toolctrl", type: "procedure", label: "Tool control", blurb: "the tool sign-out and shadow-board check" },
  { id: "partsreq", type: "procedure", label: "Parts requisition", blurb: "how parts are ordered from stores" },
  { id: "pushback", type: "procedure", label: "Pushback", blurb: "the pushback procedure" },
  { id: "fuel", type: "procedure", label: "Fuel sampling", blurb: "the daily fuel water check" },
  { id: "lightning", type: "procedure", label: "Lightning strike check", blurb: "the post-strike inspection" },

  { id: "manual", type: "source", label: "A320 line maintenance manual.pdf", where: "p. 301", blurb: "the A320 line maintenance manual" },
  { id: "deicedoc", type: "source", label: "De-icing procedure.docx", where: "§4.2", blurb: "the written de-icing procedure" },
  { id: "checklist", type: "source", label: "Engine run-up checklist", where: "Note", blurb: "the engine run-up checklist" },
  { id: "briefing", type: "source", label: "Ramp safety briefing.mp4", where: "14:32", blurb: "the ramp safety briefing video" },
  { id: "roster", type: "source", label: "Crew rostering policy", where: "Web page", blurb: "the crew rostering policy" },
  { id: "schedule", type: "source", label: "Fleet schedule Q4.xlsx", where: "Row 88", blurb: "the Q4 fleet schedule" },
  { id: "nightaudio", type: "source", label: "Night shift handover.m4a", where: "06:12", blurb: "a recorded night-shift handover" },
  { id: "layout", type: "source", label: "Hangar 2 layout.png", where: "Image", blurb: "the Hangar 2 floor plan" },
  { id: "tyremanual", type: "source", label: "Wheel and brake manual.pdf", where: "p. 42", blurb: "the wheel and brake manual" },
  { id: "stockcat", type: "source", label: "Stores catalogue.xlsx", where: "Sheet 2", blurb: "the stores catalogue" },
  { id: "toolpolicy", type: "source", label: "Tool control policy", where: "Web page", blurb: "the tool control policy" },
  { id: "borefind", type: "source", label: "Borescope findings.mp4", where: "03:51", blurb: "a recorded borescope inspection" },
  { id: "audit", type: "source", label: "Quality audit 2026.pdf", where: "p. 9", blurb: "this year's quality audit" },
  { id: "pushbrief", type: "source", label: "Pushback briefing.mp4", where: "02:10", blurb: "the pushback briefing video" },
  { id: "deflog", type: "source", label: "Defect log export.csv", where: "Row 214", blurb: "an export of the defect log" },
  { id: "mel", type: "source", label: "A320 MEL.pdf", where: "§25", blurb: "the A320 minimum equipment list" },
  { id: "toolbox", type: "source", label: "Toolbox talk.m4a", where: "01:47", blurb: "a recorded toolbox talk" },

  { id: "ksta", type: "aircraft", label: "G-KSTA", blurb: "an A320 in the Kestrel fleet" },
  { id: "kstb", type: "aircraft", label: "G-KSTB", blurb: "an A320 in the Kestrel fleet" },
  { id: "kstc", type: "aircraft", label: "G-KSTC", blurb: "an A321neo in the Kestrel fleet" },
  { id: "kstd", type: "aircraft", label: "G-KSTD", blurb: "an A320 in the Kestrel fleet" },
  { id: "kste", type: "aircraft", label: "G-KSTE", blurb: "an A321neo in the Kestrel fleet" },
  { id: "kstf", type: "aircraft", label: "G-KSTF", blurb: "an A320 in the Kestrel fleet" },

  { id: "stand14", type: "place", label: "Stand 14", blurb: "the stand that faces the terminal" },
  { id: "hangar2", type: "place", label: "Hangar 2", blurb: "the line maintenance hangar" },
  { id: "pad", type: "place", label: "De-icing pad", blurb: "the remote de-icing pad" },
  { id: "tower", type: "place", label: "Ramp control", blurb: "the ramp control tower" },
  { id: "hangar1", type: "place", label: "Hangar 1", blurb: "the heavy maintenance hangar" },
  { id: "stores", type: "place", label: "Stores", blurb: "the parts stores" },
  { id: "toolcrib", type: "place", label: "Tool crib", blurb: "the tool crib" },
  { id: "engineshop", type: "place", label: "Engine shop", blurb: "the engine shop" },
  { id: "stand9", type: "place", label: "Stand 9", blurb: "a remote stand" },
  { id: "stand22", type: "place", label: "Stand 22", blurb: "a contact stand" },
  { id: "fuelfarm", type: "place", label: "Fuel farm", blurb: "the airport fuel farm" },
];

export const LINKS = [
  ["priya", "handover"], ["priya", "acheck"], ["priya", "hangar2"], ["priya", "nightaudio"], ["priya", "ana"], ["priya", "sam"],
  ["marco", "tower"], ["marco", "stand14"], ["marco", "briefing"], ["marco", "apu"], ["marco", "pushback"], ["marco", "zoe"],
  ["ana", "apu"], ["ana", "runup"], ["ana", "manual"], ["ana", "acheck"], ["ana", "ravi"], ["ana", "owen"],
  ["tom", "briefing"], ["tom", "deicedoc"], ["tom", "runup"], ["tom", "hana"], ["tom", "toolbox"],
  ["lena", "roster"], ["lena", "schedule"], ["lena", "deice"], ["lena", "zoe"],
  ["sam", "hangar1"], ["sam", "hangar2"], ["sam", "schedule"], ["sam", "acheck"], ["sam", "kstd"], ["sam", "felix"],
  ["ines", "stores"], ["ines", "stockcat"], ["ines", "partsreq"], ["ines", "felix"],
  ["ravi", "borescope"], ["ravi", "borefind"], ["ravi", "engineshop"], ["ravi", "kste"], ["ravi", "lightning"],
  ["hana", "audit"], ["hana", "toolctrl"], ["hana", "deflog"],
  ["owen", "tyres"], ["owen", "brakes"], ["owen", "toolbox"], ["owen", "oil"],
  ["zoe", "tower"], ["zoe", "mel"], ["zoe", "kstf"], ["zoe", "cabinlog"],
  ["felix", "toolcrib"], ["felix", "toolctrl"], ["felix", "toolpolicy"], ["felix", "toolbox"],
  ["apu", "manual"], ["apu", "checklist"], ["apu", "stand14"],
  ["runup", "checklist"], ["runup", "stand14"], ["runup", "engineshop"],
  ["deice", "deicedoc"], ["deice", "pad"], ["deice", "kstb"],
  ["handover", "nightaudio"], ["handover", "hangar2"], ["handover", "roster"],
  ["acheck", "schedule"], ["acheck", "hangar2"], ["acheck", "manual"], ["acheck", "kstc"],
  ["tyres", "tyremanual"], ["tyres", "stand9"], ["tyres", "ksta"], ["tyres", "partsreq"],
  ["brakes", "tyremanual"], ["brakes", "kstd"], ["brakes", "hangar1"],
  ["oil", "manual"], ["oil", "stand22"], ["oil", "kstf"],
  ["borescope", "borefind"], ["borescope", "engineshop"], ["borescope", "kste"], ["borescope", "manual"],
  ["cabinlog", "deflog"], ["cabinlog", "mel"], ["cabinlog", "kstb"],
  ["toolctrl", "toolpolicy"], ["toolctrl", "toolcrib"], ["toolctrl", "toolbox"], ["toolctrl", "audit"],
  ["partsreq", "stockcat"], ["partsreq", "stores"], ["partsreq", "schedule"],
  ["pushback", "pushbrief"], ["pushback", "stand14"], ["pushback", "stand22"],
  ["fuel", "fuelfarm"], ["fuel", "manual"], ["fuel", "stand9"],
  ["lightning", "manual"], ["lightning", "kstc"], ["lightning", "hangar1"],
  ["audit", "deflog"], ["mel", "ksta"], ["mel", "kstf"], ["layout", "hangar2"],
  ["schedule", "ksta"], ["schedule", "kstb"], ["schedule", "kstc"], ["schedule", "kstd"], ["schedule", "kste"], ["schedule", "kstf"],
  ["kstc", "hangar2"], ["ksta", "stand14"], ["kstb", "pad"], ["kstd", "hangar1"], ["kste", "stand22"], ["kstf", "stand9"],
  ["stand14", "tower"], ["stand9", "tower"], ["stand22", "tower"], ["fuelfarm", "tower"], ["briefing", "stand14"],
  ["stores", "hangar1"], ["toolcrib", "hangar2"], ["engineshop", "hangar1"],
];

export const NODE_BY_ID = Object.fromEntries(NODES.map((node) => [node.id, node]));

export function neighboursOf(id) {
  return LINKS.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));
}

// Scripted answers. `{n}` in the text is a citation of sources[n - 1]; `focus` is what the graph turns to.
export const QUESTIONS = [
  {
    id: "apu",
    prompt: "Who clears an APU start on Stand 14?",
    keywords: ["apu", "stand 14", "stand14", "clear", "ramp"],
    text: "Ramp control does. Stand 14 faces the terminal, so call ramp control before any APU or engine start and wait for clearance {1}. On days that's Marco Silva {2}. Before the start, the engineer confirms the inlet and exhaust are clear {3}.",
    sources: ["checklist", "briefing", "manual"],
    focus: ["stand14", "tower", "marco", "apu", "ana"],
  },
  {
    id: "kstc",
    prompt: "When is G-KSTC in Hangar 2?",
    keywords: ["kstc", "hangar", "a321", "a-check", "acheck"],
    text: "G-KSTC is booked into Hangar 2 for its A-check on the night of 18 November {1}. Priya Nair runs that shift, and the last handover notes that the bay 3 jacks were moved to make room {2}.",
    sources: ["schedule", "nightaudio"],
    focus: ["kstc", "hangar2", "acheck", "priya", "handover"],
  },
  {
    id: "deice",
    prompt: "What if de-icing holdover runs out?",
    keywords: ["de-ic", "deic", "ice", "holdover", "icing"],
    text: "The aircraft goes back to the de-icing pad for a fresh treatment before it can take off {1}. Tell Lena Hart in crew scheduling, so the next rotation can be moved if the delay runs long {2}.",
    sources: ["deicedoc", "roster"],
    focus: ["deice", "pad", "lena", "kstb"],
  },
];

const listNames = (names) =>
  names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

// An answer about a single entity, written from its links, for clicks and typed names the script doesn't cover.
export function entityAnswer(id) {
  const node = NODE_BY_ID[id];
  const linked = neighboursOf(id).map((other) => NODE_BY_ID[other]);
  // A source cites itself; anything else cites up to two of the sources it's linked to.
  const sources = node.type === "source" ? [id] : linked.filter((other) => other.type === "source").slice(0, 2).map((other) => other.id);
  const others = linked.filter((other) => other.type !== "source").map((other) => other.label);
  const cites = sources.map((_, index) => ` {${index + 1}}`).join("");
  return {
    id: `entity-${id}`,
    prompt: `Tell me about ${node.label}`,
    text: `${node.label} is ${node.blurb}, linked in Kestrel Aero's graph to ${listNames(others.slice(0, 4))}${cites}.`,
    sources,
    focus: [id, ...neighboursOf(id)],
  };
}

export const FALLBACK = {
  id: "fallback",
  text: "I couldn't find that in Kestrel Aero's knowledge bases. This playground only knows a sample of them, so try a suggested question or click a node in the graph.",
  sources: [],
  focus: [],
};

// Matches typed text to a scripted answer, then to an entity by name, then falls back.
export function answerFor(input) {
  const query = input.trim().toLowerCase();
  if (!query) return null;
  const scripted = QUESTIONS.find((question) => question.keywords.some((keyword) => query.includes(keyword)));
  if (scripted) return { ...scripted, prompt: input.trim() };
  const entity = NODES.find((node) => {
    const name = node.label.toLowerCase().replace(/\.[a-z0-9]+$/, "");
    return query.includes(name) || name.split(" ").some((part) => part.length > 3 && query.includes(part));
  });
  if (entity) return { ...entityAnswer(entity.id), prompt: input.trim() };
  return { ...FALLBACK, prompt: input.trim() };
}

// Splits answer text into words and citation tokens so it can stream in a word at a time.
export function tokenize(text) {
  return text.split(/(\{\d+\})/).flatMap((part) => {
    const cite = /^\{(\d+)\}$/.exec(part);
    if (cite) return [{ cite: Number(cite[1]) }];
    return part.split(/(?<=\s)/).filter(Boolean).map((word) => ({ word }));
  });
}
