const expect = chai.expect;

describe("integerToRoman", function () {

  describe("Valid inputs [1-3999]", function () {

    it('integerToRoman(1) should return "I" (lower boundary)', () => {
      const r = integerToRoman(1);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("I");
    });

    it('integerToRoman(2) should return "II" (BVA)', () => {
      const r = integerToRoman(2);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("II");
    });

    it('integerToRoman(3) should return "III" (BVA)', () => {
      const r = integerToRoman(3);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("III");
    });

    it('integerToRoman(4) should return "IV" (subtractive)', () => {
      const r = integerToRoman(4);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("IV");
    });

    it('integerToRoman(5) should return "V" (representative)', () => {
      const r = integerToRoman(5);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("V");
    });

    it('integerToRoman(9) should return "IX" (subtractive)', () => {
      const r = integerToRoman(9);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("IX");
    });

    it('integerToRoman(14) should return "XIV" (mixed subtractive)', () => {
      const r = integerToRoman(14);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("XIV");
    });

    it('integerToRoman(40) should return "XL" (tens subtractive)', () => {
      const r = integerToRoman(40);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("XL");
    });

    it('integerToRoman(44) should return "XLIV" (composite subtractive)', () => {
      const r = integerToRoman(44);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("XLIV");
    });

    it('integerToRoman(58) should return "LVIII" (representative)', () => {
      const r = integerToRoman(58);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("LVIII");
    });

    it('integerToRoman(90) should return "XC" (tens subtractive)', () => {
      const r = integerToRoman(90);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("XC");
    });

    it('integerToRoman(400) should return "CD" (hundreds subtractive)', () => {
      const r = integerToRoman(400);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("CD");
    });

    it('integerToRoman(944) should return "CMXLIV" (complex)', () => {
      const r = integerToRoman(944);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("CMXLIV");
    });

    it('integerToRoman(1999) should return "MCMXCIX" (representative)', () => {
      const r = integerToRoman(1999);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("MCMXCIX");
    });

    it('integerToRoman(3998) should return "MMMCMXCVIII" (upper boundary -1)', () => {
      const r = integerToRoman(3998);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("MMMCMXCVIII");
    });

    it('integerToRoman(3999) should return "MMMCMXCIX" (upper boundary)', () => {
      const r = integerToRoman(3999);
      expect(r.ok).to.be.true;
      expect(r.value).to.equal("MMMCMXCIX");
    });

  });

  describe("Invalid inputs (outside domain or malformed)", function () {

    describe("Out-of-range values", function () {

      it("integerToRoman(0) should fail because zero is not representable", () => {
        const r = integerToRoman(0);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

      it("integerToRoman(-1) should fail because negative values are invalid", () => {
        const r = integerToRoman(-1);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

      it("integerToRoman(4000) should fail because values above 3999 are not representable", () => {
        const r = integerToRoman(4000);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

      it("integerToRoman(50000) should fail because it is far outside the supported range", () => {
        const r = integerToRoman(50000);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

    });

    describe("Non-integer or non-numeric values", function () {

      it("integerToRoman(3.5) should fail because only whole integers are allowed", () => {
        const r = integerToRoman(3.5);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

      it('integerToRoman("abc") should fail because the input is not numeric', () => {
        const r = integerToRoman("abc");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

      it("integerToRoman(null) should fail because null is not a valid integer", () => {
        const r = integerToRoman(null);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

      it("integerToRoman(undefined) should fail because undefined is not a valid integer", () => {
        const r = integerToRoman(undefined);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INT_RANGE);
      });

    });

  });

});

describe("romanToInteger", function () {

  describe("Valid Roman numerals (canonical form)", function () {

    it('romanToInteger("I") should return 1 (lower boundary)', () => {
      const r = romanToInteger("I");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(1);
    });

    it('romanToInteger("III") should return 3 (repetition within rules)', () => {
      const r = romanToInteger("III");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(3);
    });

    it('romanToInteger("IV") should return 4 (subtractive)', () => {
      const r = romanToInteger("IV");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(4);
    });

    it('romanToInteger("VIII") should return 8 (representative)', () => {
      const r = romanToInteger("VIII");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(8);
    });

    it('romanToInteger("XIX") should return 19 (mixed subtractive)', () => {
      const r = romanToInteger("XIX");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(19);
    });

    it('romanToInteger("XLIX") should return 49 (composite subtractive)', () => {
      const r = romanToInteger("XLIX");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(49);
    });

    it('romanToInteger("XCIX") should return 99 (tens subtractive)', () => {
      const r = romanToInteger("XCIX");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(99);
    });

    it('romanToInteger("CDXLIV") should return 444 (hundreds + tens subtractive)', () => {
      const r = romanToInteger("CDXLIV");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(444);
    });

    it('romanToInteger("DCCCLXXXVIII") should return 888 (large additive numeral)', () => {
      const r = romanToInteger("DCCCLXXXVIII");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(888);
    });

    it('romanToInteger("MDCLXVI") should return 1666 (representative)', () => {
      const r = romanToInteger("MDCLXVI");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(1666);
    });

    it('romanToInteger("MMXXIII") should return 2023 (representative)', () => {
      const r = romanToInteger("MMXXIII");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(2023);
    });

    it('romanToInteger("MMMCMXCIX") should return 3999 (upper boundary)', () => {
      const r = romanToInteger("MMMCMXCIX");
      expect(r.ok).to.be.true;
      expect(r.value).to.equal(3999);
    });

  });

  describe("Invalid Roman numerals (violating structural rules)", function () {

    describe("Invalid repetitions", function () {

      it('validateRomanStrict("IIII") should fail because I cannot repeat more than three times', () => {
        const r = validateRomanStrict("IIII");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_REPETITION("I"));
      });

    });

    describe("Invalid subtractive pairs", function () {

      it('validateRomanStrict("IIV") should fail because it is not in canonical form', () => {
        const r = validateRomanStrict("IIV");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.NON_CANONICAL);
      });

      it('validateRomanStrict("VX") should fail because V cannot be used as a subtractive symbol', () => {
        const r = validateRomanStrict("VX");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_SUBTRACTIVE_PAIR("V", "X"));
      });

      it('validateRomanStrict("LC") should fail because L cannot subtract C', () => {
        const r = validateRomanStrict("LC");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_SUBTRACTIVE_PAIR("L", "C"));
      });

      it('validateRomanStrict("DM") should fail because D cannot subtract M', () => {
        const r = validateRomanStrict("DM");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_SUBTRACTIVE_PAIR("D", "M"));
      });

      it('validateRomanStrict("IC") should fail because I can only subtract V or X', () => {
        const r = validateRomanStrict("IC");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_SUBTRACTIVE_PAIR("I", "C"));
      });

      it('validateRomanStrict("XM") should fail because X can only subtract L or C', () => {
        const r = validateRomanStrict("XM");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_SUBTRACTIVE_PAIR("X", "M"));
      });

    });

    describe("Invalid characters", function () {

      it('validateRomanStrict("A") should fail because "A" is not a valid Roman numeral character', () => {
        const r = validateRomanStrict("A");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_CHAR("A"));
      });

      it('validateRomanStrict("MMZ") should fail because "Z" is not a valid Roman numeral character', () => {
        const r = validateRomanStrict("MMZ");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.INVALID_CHAR("Z"));
      });

    });

    describe("Empty or null input", function () {

      it('validateRomanStrict("") should fail because an empty string is not a valid numeral', () => {
        const r = validateRomanStrict("");
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.EMPTY_INPUT);
      });

      it('validateRomanStrict(null) should fail because null cannot be interpreted as a numeral', () => {
        const r = validateRomanStrict(null);
        expect(r.ok).to.be.false;
        expect(r.error).to.equal(ERR.EMPTY_INPUT);
      });

    });

  });

});
