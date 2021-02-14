export type VectorType = [number, number, number];

export const ADENINE = "A";
export const CYTOSINE = "C";
export const GUANINE = "G";
export const THYMINE = "T";

export type NucleotideLetterType =
  | typeof ADENINE
  | typeof CYTOSINE
  | typeof GUANINE
  | typeof THYMINE;

export enum BondTypeType {
  Hydrogen,
  Covalent,
  CovalentDouble,
}

export type AtomType = {
  originalPos: VectorType;
  pos: VectorType;
  speed: VectorType;
};

export type AtomArraysType = {
  carbon: Array<AtomType>;
  oxygen: Array<AtomType>;
  nitrogen: Array<AtomType>;
  phosphorous: Array<AtomType>;
};
