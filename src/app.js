const RomanConverterUI = (() => {
  const $ = (id) => document.getElementById(id);

  const elements = {
    form: $("converterForm"),
    mode: $("mode"),
    input: $("inputValue"),
    inputLabel: $("inputLabel"),
    result: $("resultValue"),
    status: $("statusValue"),
    reset: $("resetBtn"),
  };

  const setStatus = (message, kind) => {
    elements.status.textContent = message;
    elements.status.className = "status" + (kind ? ` ${kind}` : "");
  };

  const clearOutputs = () => {
    elements.result.textContent = "—";
    setStatus("Ready", "neutral");
  };

  const setModeLabels = () => {
    const mode = elements.mode.value;
    const isIntToRoman = mode === "intToRoman";

    elements.inputLabel.textContent =
      isIntToRoman ? "Integer (1-3999)" : "Roman numeral (I,V,X,L,C,D,M)";
    elements.input.value = "";
    clearOutputs();

    elements.input.inputMode = isIntToRoman ? "numeric" : "text";
    elements.input.placeholder = isIntToRoman ? "e.g., 1999" : "e.g., MCMXCIX";
  };

  const resetForm = () => {
    elements.input.value = "";
    clearOutputs();
    elements.input.focus();
  };

  const convert = () => {
    clearOutputs();

    const mode = elements.mode.value;
    const raw = elements.input.value;

    if (mode === "intToRoman") {
      const parsed = RomanConverter.parseIntegerStrict(raw);
      if (!parsed.ok) {
        setStatus(parsed.error, "error");
        return;
      }

      const converted = RomanConverter.integerToRoman(parsed.value);
      if (!converted.ok) {
        setStatus(converted.error, "error");
        return;
      }

      elements.result.textContent = converted.value;
      setStatus("Converted successfully.", "ok");
      return;
    }

    const validated = RomanConverter.validateRomanStrict(raw);
    if (!validated.ok) {
      setStatus(validated.error, "error");
      return;
    }

    const converted = RomanConverter.romanToInteger(validated.value);
    if (!converted.ok) {
      setStatus(converted.error, "error");
      return;
    }

    elements.result.textContent = String(converted.value);
    setStatus("Converted successfully.", "ok");
  };

  const bind = () => {
    elements.mode.addEventListener("change", setModeLabels);
    elements.form.addEventListener("submit", (e) => {
      e.preventDefault();
      convert();
    });
    elements.reset.addEventListener("click", resetForm);

    setModeLabels();
    clearOutputs();
  };

  return Object.freeze({ bind });
})();

RomanConverterUI.bind();
