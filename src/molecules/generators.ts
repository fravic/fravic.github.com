import { Euler, Vector3 } from "three";
import {
  ADENINE,
  AnchorPairType,
  CYTOSINE,
  GUANINE,
  EntitiesType,
  NucleotideLetterType,
  THYMINE,
} from "./types";

const BASE_PAIR_HEIGHT = 0.8;
const BASE_PAIR_RADIUS = 2;
const BASE_PAIR_ROTATION_RAD = 0.2;
const BASE_SCALE_MULTIPLIER = 0.08;
const ANTISENSE_OFFSET_RAD = (Math.PI * 3) / 4;

export function polynucleotideStrand(sequence: string): EntitiesType {
  let helixT: number = 0;
  const out: EntitiesType = {
    backbone: [],
    [ADENINE]: [],
    [CYTOSINE]: [],
    [GUANINE]: [],
    [THYMINE]: [],
  };
  for (let i = 0; i < sequence.length; i++) {
    const letter = sequence[i];
    if (!isNucleotideLetter(letter)) {
      throw new Error("Invalid letter in polynucleotide sequence");
    }
    const anchors = getAnchorsForBasePair(helixT, i);
    helixT += BASE_PAIR_ROTATION_RAD;
    out.backbone.push({
      pos: anchors.sense,
      rot: new Euler(),
      scale: new Vector3(1, 1, 1),
    });
    out.backbone.push({
      pos: anchors.antisense,
      rot: new Euler(),
      scale: new Vector3(1, 1, 1),
    });

    addBasePair(letter, anchors, out);
  }
  return out;
}

function getAnchorsForBasePair(helixT: number, i: number): AnchorPairType {
  const sense = getAnchorForBasePair(helixT, i, true);
  const antisense = getAnchorForBasePair(helixT, i, false);
  return { sense, antisense };
}

function getAnchorForBasePair(
  helixT: number,
  i: number,
  sense: boolean
): Vector3 {
  const t = sense ? helixT : helixT + ANTISENSE_OFFSET_RAD;
  const x = Math.cos(t) * BASE_PAIR_RADIUS;
  const y = BASE_PAIR_HEIGHT * i;
  const z = Math.sin(t) * BASE_PAIR_RADIUS;
  return new Vector3(x, y, z);
}

function isNucleotideLetter(letter: string): letter is NucleotideLetterType {
  return (
    letter === ADENINE ||
    letter === CYTOSINE ||
    letter === GUANINE ||
    letter === THYMINE
  );
}

function oppositeLetter(letter: NucleotideLetterType): NucleotideLetterType {
  if (letter === ADENINE) {
    return THYMINE;
  }
  if (letter === THYMINE) {
    return ADENINE;
  }
  if (letter === GUANINE) {
    return CYTOSINE;
  }
  return GUANINE;
}

function addBasePair(
  letter: NucleotideLetterType,
  anchors: AnchorPairType,
  out: EntitiesType
): void {
  const senseBasePos = new Vector3().lerpVectors(
    anchors.sense,
    anchors.antisense,
    0.25
  );
  const antisenseBasePos = new Vector3().lerpVectors(
    anchors.sense,
    anchors.antisense,
    0.75
  );
  const antisenseLetter = oppositeLetter(letter);
  // Found through random experimentation
  const angle =
    -Math.atan2(anchors.antisense.z, anchors.antisense.x) - Math.PI / 8;
  const scale =
    anchors.sense.clone().setComponent(1, 0).length() * BASE_SCALE_MULTIPLIER;
  out[letter].push({
    pos: senseBasePos,
    rot: new Euler(0, angle, Math.PI / 2),
    scale: new Vector3(1, scale, 1),
  });
  out[antisenseLetter].push({
    pos: antisenseBasePos,
    rot: new Euler(0, angle, Math.PI / 2),
    scale: new Vector3(1, scale, 1),
  });
}
