import {
  ADENINE,
  AnchorPairType,
  AtomArraysType,
  AtomType,
  CYTOSINE,
  GUANINE,
  MolViewPositionType,
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
  //out.carbon.push(atom(anchors.sense), atom(anchors.antisense));

  const senseMid = interpolate(anchors.sense, prevAnchors.sense, 0.5);
  const antisenseMid = interpolate(
    anchors.antisense,
    prevAnchors.antisense,
    0.5
  );
  out.phosphorus.push(atom(senseMid), atom(antisenseMid));

  const basePairMid = interpolate(senseMid, antisenseMid, 0.5);
  out.phosphorus.push(atom(basePairMid));

  if (letter === "T") {
    basePairMolecule(THYMINE_MOL_VIEW, senseMid, basePairMid, out);
  }
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

// https://molview.org/?cid=1135
const THYMINE_MOL_VIEW: MolViewPositionType = {
  positions: {
    oxygen: [
      [-1.5193, 1.8067, -0.0009],
      [2.8394, 0.2913, -0.0007],
    ],
    nitrogen: [
      [0.6643, 1.0623, 0.0011],
      [1.1148, -1.2316, -0.0002],
    ],
    carbon: [
      [-1.1612, -0.5432, 0.0002],
      [-0.7129, 0.8802, 0.0004],
      [-0.226, -1.5013, -0.0001],
      [-2.63, -0.8189, -0.0001],
      [1.631, 0.0545, 0.0003],
    ],
    phosphorus: [],
  },
  origin: [0.6643, 1.0623, 0.0011],
  endpoint: [-1.5193, 1.8067, -0.0009],
};

function basePairMolecule(
  molView: MolViewPositionType,
  backboneAnchor: VectorType,
  midpointAnchor: VectorType,
  out: AtomArraysType
) {
  function transform(pos: VectorType) {
    return apply(
      pos,

      // Normalize positions between the origin and endpoint
      translate(negative(molView.origin)),
      scale(invert(translate(molView.endpoint)(negative(molView.origin)))),

      // Scale between the backbone and the midpoint
      scale(translate(midpointAnchor)(negative(backboneAnchor))),

      // Move to the backbone
      translate(backboneAnchor)
    );
  }
  console.log(transform(molView.endpoint));
  molView.positions.oxygen.forEach((pos) =>
    out.oxygen.push(atom(transform(pos)))
  );
  molView.positions.nitrogen.forEach((pos) =>
    out.nitrogen.push(atom(transform(pos)))
  );
  molView.positions.carbon.forEach((pos) =>
    out.carbon.push(atom(transform(pos)))
  );
  molView.positions.phosphorus.forEach((pos) =>
    out.phosphorus.push(atom(transform(pos)))
  );
}

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

const translate = (to: VectorType) => (p: VectorType): VectorType => {
  return [p[0] + to[0], p[1] + to[1], p[2] + to[2]];
};

const negative = (p: VectorType): VectorType => {
  return [-p[0], -p[1], -p[2]];
};

const invert = (p: VectorType): VectorType => {
  return [1 / p[0], 1 / p[1], 1 / p[2]];
};

const scale = (s: VectorType) => (p: VectorType) => {
  return [p[0] * s[0], p[1] * s[1], p[2] * s[2]];
};

const rotate = (pitch: number, roll: number, yaw: number) => (
  p: VectorType
) => {
  var cosa = Math.cos(yaw);
  var sina = Math.sin(yaw);

  var cosb = Math.cos(pitch);
  var sinb = Math.sin(pitch);

  var cosc = Math.cos(roll);
  var sinc = Math.sin(roll);

  var Axx = cosa * cosb;
  var Axy = cosa * sinb * sinc - sina * cosc;
  var Axz = cosa * sinb * cosc + sina * sinc;

  var Ayx = sina * cosb;
  var Ayy = sina * sinb * sinc + cosa * cosc;
  var Ayz = sina * sinb * cosc - cosa * sinc;

  var Azx = -sinb;
  var Azy = cosb * sinc;
  var Azz = cosb * cosc;

  return [
    Axx * p[0] + Axy * p[1] + Axz * p[2],
    Ayx * p[0] + Ayy * p[1] + Ayz * p[2],
    Azx * p[0] + Azy * p[1] + Azz * p[2],
  ];
};

function apply(p: VectorType, ...funcs: Array<Function>) {
  let next = p;
  for (const func of funcs) {
    next = func(next);
  }
  return next;
}
