import {
  AtomType,
  AtomArraysType,
  NucleotideLetterType,
  VectorType,
  ADENINE,
  CYTOSINE,
  GUANINE,
  THYMINE,
} from "./types";

const BASE_PAIR_HEIGHT = 0.2;
const BASE_PAIR_RADIUS = 3;
const BASE_PAIR_ROTATION_RAD = 0.2;
const ANTISENSE_OFFSET_RAD = (Math.PI * 3) / 4;

export function polynucleotideStrand(sequence: string): AtomArraysType {
  const outAtomArrays: AtomArraysType = {
    carbon: [],
    oxygen: [],
    nitrogen: [],
    phosphorous: [],
  };
  let helixT: number = 0;
  for (let i = 0; i < sequence.length; i++) {
    const letter = sequence[i];
    if (!isNucleotideLetter(letter)) {
      throw new Error("Invalid letter in polynucleotide sequence");
    }
    const anchors = getAnchorsForBasePair(helixT, i);
    helixT += BASE_PAIR_ROTATION_RAD;
    basePairWithBackbone(
      letter,
      anchors.senseAnchor,
      anchors.antisenseAnchor,
      outAtomArrays
    );
  }
  return outAtomArrays;
}

function getAnchorsForBasePair(
  helixT: number,
  i: number
): { senseAnchor: VectorType; antisenseAnchor: VectorType } {
  const senseAnchor = getAnchorForBasePair(helixT, i, true);
  const antisenseAnchor = getAnchorForBasePair(helixT, i, false);
  return { senseAnchor, antisenseAnchor };
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
  senseAnchor: VectorType,
  antisenseAnchor: VectorType,
  out: AtomArraysType
) {
  // Placeholder carbon
  out.carbon.push(atom(senseAnchor), atom(antisenseAnchor));
}

function cytosine(anchor: AtomType, out: AtomArraysType) {}

function guanine(anchor: AtomType, out: AtomArraysType) {}

function adenine(anchor: AtomType, out: AtomArraysType) {}

function thymine(anchor: AtomType, out: AtomArraysType) {}

function deoxyribose(anchor: AtomType, out: AtomArraysType) {}

function phosphate(anchor: AtomType, out: AtomArraysType) {}

function atom(originalPos: VectorType): AtomType {
  return { originalPos, pos: originalPos, speed: [0, 0, 0] };
}
