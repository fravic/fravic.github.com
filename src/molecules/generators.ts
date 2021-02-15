import {
  ADENINE,
  AnchorPairType,
  AtomArraysType,
  AtomType,
  CYTOSINE,
  GUANINE,
  NucleotideLetterType,
  THYMINE,
  VectorType,
} from "./types";

const BASE_PAIR_HEIGHT = 0.4;
const BASE_PAIR_RADIUS = 3;
const BASE_PAIR_ROTATION_RAD = 0.2;
const ANTISENSE_OFFSET_RAD = (Math.PI * 3) / 4;

export function polynucleotideStrand(sequence: string): AtomArraysType {
  const outAtomArrays: AtomArraysType = {
    carbon: [],
    oxygen: [],
    nitrogen: [],
    phosphorus: [],
  };
  let helixT: number = 0;
  let prevAnchors: AnchorPairType | null = null;
  for (let i = 0; i < sequence.length; i++) {
    const letter = sequence[i];
    if (!isNucleotideLetter(letter)) {
      throw new Error("Invalid letter in polynucleotide sequence");
    }
    const anchors = getAnchorsForBasePair(helixT, i);
    helixT += BASE_PAIR_ROTATION_RAD;
    if (prevAnchors) {
      basePairWithBackbone(letter, anchors, prevAnchors, outAtomArrays);
    }
    prevAnchors = anchors;
  }
  return outAtomArrays;
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
): VectorType {
  const t = sense ? helixT : helixT + ANTISENSE_OFFSET_RAD;
  const x = Math.cos(t) * BASE_PAIR_RADIUS;
  const y = BASE_PAIR_HEIGHT * i;
  const z = Math.sin(t) * BASE_PAIR_RADIUS;
  return [x, y, z];
}

function isNucleotideLetter(letter: string): letter is NucleotideLetterType {
  return (
    letter === ADENINE ||
    letter === CYTOSINE ||
    letter === GUANINE ||
    letter === THYMINE
  );
}

function basePairWithBackbone(
  letter: NucleotideLetterType,
  anchors: AnchorPairType,
  prevAnchors: AnchorPairType,
  out: AtomArraysType
) {
  out.carbon.push(atom(anchors.sense), atom(anchors.antisense));

  const senseMid = interpolate(anchors.sense, prevAnchors.sense, 0.5);
  const antisenseMid = interpolate(
    anchors.antisense,
    prevAnchors.antisense,
    0.5
  );
  out.oxygen.push(atom(senseMid), atom(antisenseMid));

  const basePairMid = interpolate(senseMid, antisenseMid, 0.5);
  out.nitrogen.push(atom(basePairMid));
}

function cytosine(
  backboneAnchor: VectorType,
  midpointAnchor: VectorType,
  out: AtomArraysType
) {}

function guanine(
  backboneAnchor: VectorType,
  midpointAnchor: VectorType,
  out: AtomArraysType
) {}

function adenine(
  backboneAnchor: VectorType,
  midpointAnchor: VectorType,
  out: AtomArraysType
) {}

function thymine(
  backboneAnchor: VectorType,
  midpointAnchor: VectorType,
  out: AtomArraysType
) {}

function deoxyribose(anchor: AtomType, out: AtomArraysType) {}

function phosphate(anchor: AtomType, out: AtomArraysType) {}

function atom(originalPos: VectorType): AtomType {
  return { originalPos, pos: originalPos, speed: [0, 0, 0] };
}

function interpolate(a: VectorType, b: VectorType, t: number): VectorType {
  const x = (b[0] - a[0]) * t + a[0];
  const y = (b[1] - a[1]) * t + a[1];
  const z = (b[2] - a[2]) * t + a[2];
  return [x, y, z];
}
