const RomanConverterUI = ((converter) => {
  const $ = (id) => document.getElementById(id);

  // GA4 helper — safe no-op if gtag hasn't loaded yet
  const fireEvent = (name, params) => {
    if (typeof gtag === 'function') {
      gtag('event', name, params);
    }
  };

  const elements = {
    form: $('converterForm'),
    mode: $('mode'),
    input: $('inputValue'),
    inputLabel: $('inputLabel'),
    result: $('resultValue'),
    status: $('statusValue'),
    reset: $('resetBtn'),
  };

  const setStatus = (message, kind) => {
    elements.status.textContent = message;
    elements.status.className = 'status' + (kind ? ` ${kind}` : '');
  };

  const clearOutputs = () => {
    elements.result.textContent = '—';
    setStatus('Ready', 'neutral');
  };

  const setModeLabels = () => {
    const mode = elements.mode.value;
    const isIntToRoman = mode === 'intToRoman';

    elements.inputLabel.textContent =
      isIntToRoman ? 'Integer (1-3999)' : 'Roman numeral (I,V,X,L,C,D,M)';
    elements.input.value = '';
    clearOutputs();

    elements.input.inputMode = isIntToRoman ? 'numeric' : 'text';
    elements.input.placeholder = isIntToRoman ? 'e.g., 1999' : 'e.g., MCMXCIX';

    // Event: mode_change — fired when the user switches conversion direction.
    // Tells us which mode is preferred and whether users switch back and forth.
    fireEvent('mode_change', { conversion_mode: mode });
  };

  const resetForm = () => {
    elements.input.value = '';
    clearOutputs();
    elements.input.focus();
  };

  const runStep = (fn, value, mode) => {
    const result = fn(value);
    if (!result.ok) {
      setStatus(result.error, 'error');
      // Event: conversion_error — fired when validation rejects the input.
      // Captures which mode failed and the specific error, so we can see
      // what kinds of mistakes users make most often.
      fireEvent('conversion_error', {
        conversion_mode: mode,
        error_message: result.error,
      });
      return null;
    }
    return result.value;
  };

  const convert = () => {
    clearOutputs();

    const mode = elements.mode.value;
    const raw = elements.input.value;

    // Event: convert_click — fired on every Convert attempt.
    // Tells us how actively the tool is used and which direction users prefer.
    fireEvent('convert_click', { conversion_mode: mode });

    if (mode === 'intToRoman') {
      const n = runStep(converter.parseIntegerStrict, raw, mode);
      if (n == null) return;

      const roman = runStep(converter.integerToRoman, n, mode);
      if (roman == null) return;

      elements.result.textContent = roman;
      setStatus('Converted successfully.', 'ok');
      // Event: conversion_success — fired when the conversion completes without errors.
      // Combined with convert_click and conversion_error gives the real success rate.
      fireEvent('conversion_success', { conversion_mode: mode, result: roman });
      return;
    }

    const validRoman = runStep(converter.validateRomanStrict, raw, mode);
    if (validRoman == null) return;

    const intValue = runStep(converter.romanToInteger, validRoman, mode);
    if (intValue == null) return;

    elements.result.textContent = String(intValue);
    setStatus('Converted successfully.', 'ok');
    // Event: conversion_success — same as above, for the romanToInt direction.
    fireEvent('conversion_success', { conversion_mode: mode, result: String(intValue) });
  };

  const bind = () => {
    elements.mode.addEventListener('change', setModeLabels);
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      convert();
    });
    elements.reset.addEventListener('click', resetForm);

    setModeLabels();
    clearOutputs();
  };

  return Object.freeze({ bind });
})(RomanConverter);

RomanConverterUI.bind();
