import { Vector3, Euler } from "three";

export type AnchorPairType = { sense: Vector3; antisense: Vector3 };

export const ADENINE = "A";
export const CYTOSINE = "C";
export const GUANINE = "G";
export const THYMINE = "T";

export type NucleotideLetterType =
  | typeof ADENINE
  | typeof CYTOSINE
  | typeof GUANINE
  | typeof THYMINE;

export type EntityType = {
  pos: Vector3;
  rot: Euler;
  scale: Vector3;
};

export type EntitiesType = {
  backbone: Array<EntityType>;
  [ADENINE]: Array<EntityType>;
  [CYTOSINE]: Array<EntityType>;
  [GUANINE]: Array<EntityType>;
  [THYMINE]: Array<EntityType>;
};
