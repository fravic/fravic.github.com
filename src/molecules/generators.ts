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

export function polynucleotideStrand(sequence: string): AtomArraysType {
  const outAtomArrays: AtomArraysType = {
    carbon: [],
    oxygen: [],
    nitrogen: [],
    phosphorous: [],
  };
  for (const letter of sequence) {
    if (!isNucleotideLetter(letter)) {
      throw new Error("Invalid letter in polynucleotide sequence");
    }
    // TODO: Position and construct a base pair
  }
  return outAtomArrays;
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
) {}

function cytosine(anchor: AtomType, out: AtomArraysType) {}

function guanine(anchor: AtomType, out: AtomArraysType) {}

function adenine(anchor: AtomType, out: AtomArraysType) {}

function thymine(anchor: AtomType, out: AtomArraysType) {}

function deoxyribose(anchor: AtomType, out: AtomArraysType) {}

function phosphate(anchor: AtomType, out: AtomArraysType) {}
