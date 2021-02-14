import { polynucleotideStrand } from "./generators";

describe("molecule generators", () => {
  it("generates a polynucleotide chain from a base pair sequence", () => {
    const atomArrays = polynucleotideStrand(
      "GGCGAGGCCAGTTTCATTTGAGCATTAAATGTCAAGTTCTGCACGCTATCATCATCA"
    );
    expect(atomArrays).toMatchSnapshot();
  });
});
