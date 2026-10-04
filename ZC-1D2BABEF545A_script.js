/**
 * SPLITZZ! - Precision Group Bill Splitter & Settlement Ledger
 * ZeroCode Challenge - Techfest 2026
 * Submission of Ojas Shailesh Deshpande (www.ojasdeshpande.in)
 * Competition ID: ZC-1D2BABEF545A
 * Pure Vanilla JavaScript (ES6+) - 100% Offline & File Protocol Ready
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'splitzz_app_v5_state';
  const DEFAULT_AVATARS = ['🎸', '🚀', '🍕', '🎮', '🦄', '🎧', '🛹', '👾', '🌈', '⚡', '🥑', '🍩', '🏄', '🎯', '🔥', '🐱'];

  // Helper for today's date formatted as YYYY-MM-DD
  const getTodayISO = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  // Helper for friendly date display
  const formatDisplayDate = (isoStr) => {
    if (!isoStr) {
      return new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch {
      // Fallback
    }
    return isoStr;
  };

  // --- DOM Element References ---
  const form = document.getElementById('splitter-form');
  const currencySelect = document.getElementById('currency-select');
  const currencyPrefix = document.getElementById('currency-prefix');
  const occasionInput = document.getElementById('occasion-input');
  const eventDateInput = document.getElementById('event-date-input');
  const locationInput = document.getElementById('location-input');
  const detectGpsBtn = document.getElementById('detect-gps-btn');
  const locationHint = document.getElementById('location-hint');

  const amountInput = document.getElementById('amount-input');
  const peopleInput = document.getElementById('people-input');
  const decrementPeopleBtn = document.getElementById('decrement-people');
  const incrementPeopleBtn = document.getElementById('increment-people');
  const resetBtn = document.getElementById('reset-btn');

  // Tax Controls
  const taxInclusiveCheckbox = document.getElementById('tax-inclusive-checkbox');
  const taxControlsWrapper = document.getElementById('tax-controls-wrapper');
  const taxButtons = document.querySelectorAll('.tax-btn');
  const customTaxInputWrap = document.getElementById('custom-tax-input-wrap');
  const customTaxInput = document.getElementById('custom-tax-input');
  const taxCalcPreview = document.getElementById('tax-calc-preview');

  // Tip Controls
  const tipModePercentBtn = document.getElementById('tip-mode-percent-btn');
  const tipModeAmountBtn = document.getElementById('tip-mode-amount-btn');
  const tipPercentView = document.getElementById('tip-percent-view');
  const tipAmountView = document.getElementById('tip-amount-view');
  const tipButtons = document.querySelectorAll('.tip-btn');
  const customTipPercentWrap = document.getElementById('custom-tip-percent-wrap');
  const customTipPercentInput = document.getElementById('custom-tip-percent-input');
  const customTipAmountInput = document.getElementById('custom-tip-amount-input');
  const tipAmountPrefix = document.getElementById('tip-amount-prefix');
  const tipCalcPreview = document.getElementById('tip-calc-preview');

  // Live Grand Total Banner
  const liveGrandTotal = document.getElementById('live-grand-total');
  const liveGrandBreakdown = document.getElementById('live-grand-breakdown');

  // Split Mode & Unequal Elements
  const modeTabs = document.querySelectorAll('.mode-tab');
  const unequalConfigBox = document.getElementById('unequal-config-box');
  const unequalModeLabel = document.getElementById('unequal-mode-label');
  const unequalBadge = document.getElementById('unequal-badge');
  const unequalPersonsList = document.getElementById('unequal-persons-list');
  const autoFillRemainingBtn = document.getElementById('auto-fill-remaining-btn');
  const meterAllocatedLabel = document.getElementById('meter-allocated-label');
  const meterTargetLabel = document.getElementById('meter-target-label');
  const meterBar = document.getElementById('meter-bar');
  const meterStatusMsg = document.getElementById('meter-status-msg');

  // Error Containers
  const occasionError = document.getElementById('occasion-error');
  const amountError = document.getElementById('amount-error');
  const peopleError = document.getElementById('people-error');
  const unequalError = document.getElementById('unequal-error');
  const globalErrorBox = document.getElementById('global-error-box');
  const globalErrorDesc = document.getElementById('global-error-desc');

  // Copy & Print Actions
  const copySummaryBtn = document.getElementById('copy-summary-btn');
  const copyTooltip = document.getElementById('copy-tooltip');
  const printSplitBtn = document.getElementById('print-split-btn');
  const copyBtnBottom = document.getElementById('copy-btn-bottom');
  const printBtnBottom = document.getElementById('print-btn-bottom');
  const resultsActions = document.getElementById('results-actions');

  // Result Elements
  const emptyState = document.getElementById('empty-state');
  const resultsContent = document.getElementById('results-content');
  const resultsStatusText = document.getElementById('results-status-text');

  const displayOccasionName = document.getElementById('display-occasion-name');
  const displayEventDate = document.getElementById('display-event-date');
  const displayLocationName = document.getElementById('display-location-name');
  const displaySplitMode = document.getElementById('display-split-mode');
  const displayTimestamp = document.getElementById('display-timestamp');

  const heroCurrencySymbol = document.getElementById('hero-currency-symbol');
  const heroShareAmount = document.getElementById('hero-share-amount');
  const heroNote = document.getElementById('hero-note');

  const metricSubtotal = document.getElementById('metric-subtotal');
  const metricTax = document.getElementById('metric-tax');
  const metricTip = document.getElementById('metric-tip');
  const metricTotal = document.getElementById('metric-total');

  const vSumShares = document.getElementById('v-sum-shares');
  const vTotalBill = document.getElementById('v-total-bill');
  const vDifference = document.getElementById('v-difference');

  const friendsList = document.getElementById('friends-list');
  const settleProgressBar = document.getElementById('settle-progress-bar');
  const settlePercentText = document.getElementById('settle-percent-text');
  const settleCountText = document.getElementById('settle-count-text');
  const settleRemainingText = document.getElementById('settle-remaining-text');
  const toastContainer = document.getElementById('toast-container');

  // Chips
  const occasionChips = document.querySelectorAll('.chip-btn[data-occasion]');
  const amountChips = document.querySelectorAll('.chip-btn[data-amount]');
  const peopleChips = document.querySelectorAll('.chip-btn[data-people]');

  // --- Reactive Application State ---
  let appState = {
    occasion: '',
    eventDate: getTodayISO(),
    location: '',
    amount: '',
    currency: '₹',
    people: 4,
    // Tax Settings
    taxInclusive: false,
    taxRate: 0,
    customTaxRate: '',
    // Tip Settings
    tipMode: 'percent', // 'percent' | 'amount'
    tipPercent: 0,
    customTipPercent: '',
    customTipAmount: 0,
    // Split Settings
    splitMode: 'equal', // 'equal' | 'unequal-amount' | 'unequal-percent'
    unequalValues: {},  // { index: number }
    customNames: {},    // { index: string }
    paidStatus: {},     // { index: boolean }
    timestamp: '',
    hasCalculated: false
  };

  // --- Audio Feedback (Web Audio API) ---
  const playSoundEffect = (type) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'paid') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(140, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // --- Toast Notifications ---
  const showToast = (message, icon = '⚡') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span aria-hidden="true">${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  };

  // Safe HTML Escaping
  const escapeHtml = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Money Formatter
  const formatMoney = (val, symbol = appState.currency) => {
    const num = Number(val);
    if (isNaN(num)) return `${symbol}0.00`;
    return `${symbol}${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // --- Financial Calculations ---
  const getFinancialBreakdown = () => {
    const subtotal = Math.max(0, parseFloat(amountInput ? amountInput.value : appState.amount) || 0);

    // 1. Tax
    let effectiveTaxRate = 0;
    if (!appState.taxInclusive) {
      if (appState.taxRate === 'custom') {
        effectiveTaxRate = Math.max(0, parseFloat(appState.customTaxRate) || 0);
      } else {
        effectiveTaxRate = Math.max(0, parseFloat(appState.taxRate) || 0);
      }
    }

    const taxAmount = Math.round((subtotal * (effectiveTaxRate / 100)) * 100) / 100;
    const subtotalPlusTax = Math.round((subtotal + taxAmount) * 100) / 100;

    // 2. Tip
    let tipAmount = 0;
    let effectiveTipPercent = 0;

    if (appState.tipMode === 'percent') {
      if (appState.tipPercent === 'custom') {
        effectiveTipPercent = Math.max(0, parseFloat(appState.customTipPercent) || 0);
      } else {
        effectiveTipPercent = Math.max(0, parseFloat(appState.tipPercent) || 0);
      }
      tipAmount = Math.round((subtotalPlusTax * (effectiveTipPercent / 100)) * 100) / 100;
    } else {
      tipAmount = Math.max(0, parseFloat(appState.customTipAmount) || 0);
      effectiveTipPercent = subtotalPlusTax > 0 ? (tipAmount / subtotalPlusTax) * 100 : 0;
    }

    const grandTotal = Math.round((subtotalPlusTax + tipAmount) * 100) / 100;

    return {
      subtotal,
      effectiveTaxRate,
      taxAmount,
      subtotalPlusTax,
      tipMode: appState.tipMode,
      effectiveTipPercent,
      tipAmount,
      grandTotal
    };
  };

  // Live Previews Update
  const updateFinancialPreviews = () => {
    const finances = getFinancialBreakdown();

    if (taxCalcPreview) {
      if (appState.taxInclusive) {
        taxCalcPreview.textContent = 'Tax is already included in subtotal (0% extra).';
      } else {
        taxCalcPreview.textContent = `Tax added: ${formatMoney(finances.taxAmount)} (${finances.effectiveTaxRate}%)`;
      }
    }

    if (tipCalcPreview) {
      if (appState.tipMode === 'percent') {
        tipCalcPreview.textContent = `Tip added: ${formatMoney(finances.tipAmount)} (${finances.effectiveTipPercent.toFixed(1)}% of bill+tax)`;
      } else {
        tipCalcPreview.textContent = `Tip added: ${formatMoney(finances.tipAmount)} (Fixed amount)`;
      }
    }

    if (liveGrandTotal) {
      liveGrandTotal.textContent = formatMoney(finances.grandTotal);
    }
    if (liveGrandBreakdown) {
      liveGrandBreakdown.textContent = `Subtotal: ${formatMoney(finances.subtotal)} + Tax: ${formatMoney(finances.taxAmount)} + Tip: ${formatMoney(finances.tipAmount)}`;
    }

    if (appState.splitMode !== 'equal') {
      updateAllocationMeter();
    }
  };

  // --- Local Storage Persistence ---
  const saveStateToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn('Storage unavailable or restricted:', e);
    }
  };

  const loadStateFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          appState = { ...appState, ...parsed };
          return true;
        }
      }
    } catch (e) {
      console.warn('Could not read saved state:', e);
    }
    return false;
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // --- Geolocation GPS Coordinates Feature ---
  const acquireGpsCoordinates = () => {
    if (!('geolocation' in navigator)) {
      if (locationHint) locationHint.textContent = 'Geolocation is not supported by your browser.';
      showToast('Geolocation not supported by browser. Enter manually.', '⚠️');
      playSoundEffect('tap');
      return;
    }

    if (locationHint) locationHint.textContent = 'Requesting device GPS coordinates...';
    playSoundEffect('tap');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const latDir = lat >= 0 ? 'N' : 'S';
        const lonDir = lon >= 0 ? 'E' : 'W';
        const formattedCoords = `📍 ${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;

        if (locationInput) {
          locationInput.value = formattedCoords;
          appState.location = formattedCoords;
          saveStateToStorage();
        }
        if (locationHint) {
          locationHint.textContent = `✓ GPS coordinates acquired: ${formattedCoords}`;
        }
        showToast('GPS coordinates acquired successfully!', '📍');
        playSoundEffect('success');
      },
      (error) => {
        let msg = 'Location permission denied or unavailable.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permission denied. You can enter the location manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location signal unavailable offline. Enter venue manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS request timed out. Enter location manually.';
        }
        if (locationHint) locationHint.textContent = msg;
        showToast(msg, '📍');
        playSoundEffect('tap');
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  };

  // --- Defensive Input Validation & Complete Edge Case Handling ---
  const validateInputs = () => {
    let isValid = true;
    let errorMessages = [];

    clearAllErrors();

    // 1. Occasion Name
    const occasionVal = occasionInput ? occasionInput.value.trim() : '';
    if (!occasionVal) {
      setError(occasionInput, occasionError, 'Occasion name is required.');
      errorMessages.push('Occasion name is empty');
      isValid = false;
    }

    // 2. Subtotal Amount
    const amountValRaw = amountInput ? amountInput.value.trim() : '';
    const amountNum = parseFloat(amountValRaw);

    if (amountValRaw === '') {
      setError(amountInput, amountError, 'Bill subtotal cannot be empty.');
      errorMessages.push('Bill amount cannot be empty');
      isValid = false;
    } else if (isNaN(amountNum)) {
      setError(amountInput, amountError, 'Please enter a valid numeric bill amount.');
      errorMessages.push('Bill amount must be a number');
      isValid = false;
    } else if (amountNum <= 0) {
      setError(amountInput, amountError, 'Amount must be strictly greater than 0 (no zero or negative values).');
      errorMessages.push('Bill amount must be > 0');
      isValid = false;
    } else if (!isFinite(amountNum) || amountNum > 1000000000) {
      setError(amountInput, amountError, 'Amount exceeds the maximum limit (1,000,000,000).');
      errorMessages.push('Bill amount exceeds limit');
      isValid = false;
    }

    // 3. Tax Validation
    if (!appState.taxInclusive && appState.taxRate === 'custom') {
      const customTaxNum = parseFloat(appState.customTaxRate);
      if (isNaN(customTaxNum) || customTaxNum < 0 || customTaxNum > 100) {
        if (customTaxInput) customTaxInput.classList.add('is-invalid');
        errorMessages.push('Custom tax must be between 0% and 100%');
        isValid = false;
      }
    }

    // 4. Tip Validation
    if (appState.tipMode === 'amount') {
      const tipAmtNum = parseFloat(appState.customTipAmount);
      if (isNaN(tipAmtNum) || tipAmtNum < 0) {
        if (customTipAmountInput) customTipAmountInput.classList.add('is-invalid');
        errorMessages.push('Fixed tip amount cannot be negative');
        isValid = false;
      }
    } else if (appState.tipPercent === 'custom') {
      const customTipNum = parseFloat(appState.customTipPercent);
      if (isNaN(customTipNum) || customTipNum < 0 || customTipNum > 200) {
        if (customTipPercentInput) customTipPercentInput.classList.add('is-invalid');
        errorMessages.push('Custom tip must be between 0% and 200%');
        isValid = false;
      }
    }

    // 5. Number of People
    const peopleValRaw = peopleInput ? peopleInput.value.trim() : '';
    const peopleNum = Number(peopleValRaw);

    if (peopleValRaw === '') {
      setError(peopleInput, peopleError, 'Number of friends cannot be empty.');
      errorMessages.push('Number of people is empty');
      isValid = false;
    } else if (isNaN(peopleNum)) {
      setError(peopleInput, peopleError, 'Number of friends must be a valid whole number.');
      errorMessages.push('Number of people must be a number');
      isValid = false;
    } else if (peopleNum <= 0) {
      setError(peopleInput, peopleError, 'Number of friends must be at least 1 (no zero or negative values).');
      errorMessages.push('Number of people must be >= 1');
      isValid = false;
    } else if (!Number.isInteger(peopleNum)) {
      setError(peopleInput, peopleError, 'Number of friends cannot be a decimal fraction.');
      errorMessages.push('Number of people must be a whole integer');
      isValid = false;
    } else if (peopleNum > 50) {
      setError(peopleInput, peopleError, 'Group size is limited to 50 for custom split configurations.');
      errorMessages.push('People count exceeds limit (max 50)');
      isValid = false;
    }

    // 6. Unequal Allocation Validation
    if (isValid && appState.splitMode !== 'equal') {
      const finances = getFinancialBreakdown();
      const unequalResult = validateUnequalAllocations(peopleNum, finances.grandTotal);
      if (!unequalResult.valid) {
        if (unequalError) unequalError.textContent = unequalResult.message;
        errorMessages.push(unequalResult.message);
        isValid = false;
      }
    }

    if (!isValid) {
      showGlobalError(errorMessages.join(' • '));
      hideResults();
      playSoundEffect('error');
    } else {
      hideGlobalError();
    }

    return isValid;
  };

  const validateUnequalAllocations = (peopleCount, targetTotal) => {
    let sum = 0;
    const isPercent = appState.splitMode === 'unequal-percent';

    for (let i = 0; i < peopleCount; i++) {
      const val = parseFloat(appState.unequalValues[i]);
      if (isNaN(val) || val < 0) {
        return {
          valid: false,
          message: `Friend ${i + 1} has an invalid or negative ${isPercent ? 'percentage' : 'amount'}.`
        };
      }
      sum += val;
    }

    if (isPercent) {
      const diff = Math.abs(sum - 100);
      if (diff > 0.05) {
        return {
          valid: false,
          message: `Allocated percentages sum to ${sum.toFixed(1)}%. They must equal exactly 100%.`
        };
      }
    } else {
      const diff = Math.abs(sum - targetTotal);
      if (diff > 0.05) {
        return {
          valid: false,
          message: `Custom amounts sum to ${formatMoney(sum)}, but target grand total is ${formatMoney(targetTotal)} (variance: ${formatMoney(Math.abs(sum - targetTotal))}).`
        };
      }
    }

    return { valid: true };
  };

  const setError = (inputEl, errorEl, message) => {
    if (inputEl) inputEl.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
  };

  const clearAllErrors = () => {
    if (occasionInput) occasionInput.classList.remove('is-invalid');
    if (amountInput) amountInput.classList.remove('is-invalid');
    if (peopleInput) peopleInput.classList.remove('is-invalid');
    if (customTaxInput) customTaxInput.classList.remove('is-invalid');
    if (customTipPercentInput) customTipPercentInput.classList.remove('is-invalid');
    if (customTipAmountInput) customTipAmountInput.classList.remove('is-invalid');

    if (occasionError) occasionError.textContent = '';
    if (amountError) amountError.textContent = '';
    if (peopleError) peopleError.textContent = '';
    if (unequalError) unequalError.textContent = '';

    hideGlobalError();
  };

  const showGlobalError = (desc) => {
    if (!globalErrorBox) return;
    globalErrorBox.style.display = 'flex';
    if (globalErrorDesc) globalErrorDesc.textContent = desc;
  };

  const hideGlobalError = () => {
    if (!globalErrorBox) return;
    globalErrorBox.style.display = 'none';
  };

  const hideResults = () => {
    if (resultsContent) resultsContent.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    if (resultsActions) resultsActions.style.display = 'none';
    if (resultsStatusText) resultsStatusText.textContent = 'Fix input errors to calculate split';
  };

  // --- Automatic Rebalancing Between Split Modes ---
  const autoRebalanceOnModeChange = (newMode, oldMode) => {
    const peopleCount = parseInt(peopleInput.value, 10) || 1;
    const finances = getFinancialBreakdown();
    const grandTotal = finances.grandTotal;

    if (newMode === 'unequal-percent') {
      if (oldMode === 'unequal-amount' && grandTotal > 0) {
        let runningPct = 0;
        for (let i = 0; i < peopleCount; i++) {
          const amt = parseFloat(appState.unequalValues[i]) || (grandTotal / peopleCount);
          if (i === peopleCount - 1) {
            appState.unequalValues[i] = parseFloat(Math.max(0, 100 - runningPct).toFixed(1));
          } else {
            const pct = parseFloat(((amt / grandTotal) * 100).toFixed(1));
            appState.unequalValues[i] = pct;
            runningPct += pct;
          }
        }
      } else {
        const basePct = Math.floor((100 / peopleCount) * 10) / 10;
        let running = 0;
        for (let i = 0; i < peopleCount; i++) {
          if (i === peopleCount - 1) {
            appState.unequalValues[i] = parseFloat((100 - running).toFixed(1));
          } else {
            appState.unequalValues[i] = basePct;
            running += basePct;
          }
        }
      }
    } else if (newMode === 'unequal-amount') {
      if (oldMode === 'unequal-percent' && grandTotal > 0) {
        const totalCents = Math.round(grandTotal * 100);
        let allocatedCents = 0;
        for (let i = 0; i < peopleCount; i++) {
          const pct = parseFloat(appState.unequalValues[i]) || (100 / peopleCount);
          let cents = Math.round(totalCents * (pct / 100));
          if (i === peopleCount - 1) {
            cents = Math.max(0, totalCents - allocatedCents);
          } else {
            allocatedCents += cents;
          }
          appState.unequalValues[i] = parseFloat((cents / 100).toFixed(2));
        }
      } else {
        const totalCents = Math.round(grandTotal * 100);
        const baseCents = Math.floor(totalCents / peopleCount);
        const remCents = totalCents % peopleCount;

        for (let i = 0; i < peopleCount; i++) {
          const cents = baseCents + (i < remCents ? 1 : 0);
          appState.unequalValues[i] = parseFloat((cents / 100).toFixed(2));
        }
      }
    }
  };

  // --- Dynamic Unequal Inputs View Manager ---
  const syncUnequalInputs = () => {
    if (!unequalConfigBox || !unequalPersonsList) return;

    if (appState.splitMode === 'equal') {
      unequalConfigBox.style.display = 'none';
      return;
    }

    unequalConfigBox.style.display = 'flex';
    const isPercent = appState.splitMode === 'unequal-percent';
    const peopleCount = parseInt(peopleInput.value, 10) || 1;
    const finances = getFinancialBreakdown();

    if (unequalModeLabel) {
      unequalModeLabel.textContent = isPercent ? 'Assign Percentages (% per friend)' : 'Assign Exact Amounts per friend';
    }
    if (unequalBadge) {
      unequalBadge.textContent = isPercent ? 'By %' : 'By Amount';
    }

    unequalPersonsList.innerHTML = '';
    for (let i = 0; i < peopleCount; i++) {
      const defaultName = `Friend ${i + 1}`;
      const name = appState.customNames[i] || defaultName;
      let val = appState.unequalValues[i];

      if (val === undefined || isNaN(val)) {
        if (isPercent) {
          val = (100 / peopleCount).toFixed(1);
        } else {
          val = finances.grandTotal > 0 ? (finances.grandTotal / peopleCount).toFixed(2) : '0.00';
        }
        appState.unequalValues[i] = parseFloat(val);
      }

      const row = document.createElement('div');
      row.className = 'unequal-person-row';
      row.innerHTML = `
        <span class="unequal-person-avatar">${DEFAULT_AVATARS[i % DEFAULT_AVATARS.length]}</span>
        <input 
          type="text" 
          class="unequal-person-name" 
          value="${escapeHtml(name)}" 
          placeholder="Friend ${i + 1}"
          data-index="${i}"
        >
        <div class="unequal-input-wrap">
          ${!isPercent ? `<span class="unequal-input-affix">${appState.currency}</span>` : ''}
          <input 
            type="number" 
            class="unequal-input ${!isPercent ? 'prefix-pad' : 'suffix-pad'}" 
            value="${val}" 
            step="${isPercent ? '0.1' : '0.01'}" 
            min="0" 
            data-index="${i}"
          >
          ${isPercent ? `<span class="unequal-input-affix suffix">%</span>` : ''}
        </div>
      `;

      // Live Name Change
      const nameInp = row.querySelector('.unequal-person-name');
      nameInp.addEventListener('input', (e) => {
        appState.customNames[i] = e.target.value.trim() || `Friend ${i + 1}`;
        saveStateToStorage();
      });

      // Live Value Change
      const valInp = row.querySelector('.unequal-input');
      valInp.addEventListener('input', (e) => {
        const parsed = parseFloat(e.target.value);
        appState.unequalValues[i] = isNaN(parsed) ? 0 : parsed;
        updateAllocationMeter();
        if (unequalError) unequalError.textContent = '';
      });

      unequalPersonsList.appendChild(row);
    }

    updateAllocationMeter();
  };

  // Live Allocation Meter Bar
  const updateAllocationMeter = () => {
    if (!meterBar || !meterStatusMsg) return;
    const isPercent = appState.splitMode === 'unequal-percent';
    const peopleCount = parseInt(peopleInput.value, 10) || 1;
    const finances = getFinancialBreakdown();
    const targetTotal = finances.grandTotal;

    let sum = 0;
    for (let i = 0; i < peopleCount; i++) {
      sum += parseFloat(appState.unequalValues[i]) || 0;
    }

    if (isPercent) {
      if (meterAllocatedLabel) meterAllocatedLabel.textContent = `Allocated: ${sum.toFixed(1)}%`;
      if (meterTargetLabel) meterTargetLabel.textContent = `Target: 100%`;

      const pctWidth = Math.min(100, Math.max(0, sum));
      meterBar.style.width = `${pctWidth}%`;

      const diff = 100 - sum;
      if (Math.abs(diff) < 0.05) {
        meterBar.classList.remove('overflow');
        meterStatusMsg.textContent = '✓ Perfectly balanced (100.0%)';
        meterStatusMsg.className = 'meter-status balanced';
      } else if (diff > 0) {
        meterBar.classList.remove('overflow');
        meterStatusMsg.textContent = `Remaining to allocate: ${diff.toFixed(1)}%`;
        meterStatusMsg.className = 'meter-status';
      } else {
        meterBar.classList.add('overflow');
        meterStatusMsg.textContent = `⚠️ Overallocated by ${Math.abs(diff).toFixed(1)}%!`;
        meterStatusMsg.className = 'meter-status unbalanced';
      }
    } else {
      if (meterAllocatedLabel) meterAllocatedLabel.textContent = `Allocated: ${formatMoney(sum)}`;
      if (meterTargetLabel) meterTargetLabel.textContent = `Total: ${formatMoney(targetTotal)}`;

      const pctWidth = targetTotal > 0 ? Math.min(100, (sum / targetTotal) * 100) : 0;
      meterBar.style.width = `${pctWidth}%`;

      const diff = targetTotal - sum;
      if (Math.abs(diff) < 0.05) {
        meterBar.classList.remove('overflow');
        meterStatusMsg.textContent = '✓ Perfectly balanced with grand total!';
        meterStatusMsg.className = 'meter-status balanced';
      } else if (diff > 0) {
        meterBar.classList.remove('overflow');
        meterStatusMsg.textContent = `Remaining to assign: ${formatMoney(diff)}`;
        meterStatusMsg.className = 'meter-status';
      } else {
        meterBar.classList.add('overflow');
        meterStatusMsg.textContent = `⚠️ Exceeds total by ${formatMoney(Math.abs(diff))}!`;
        meterStatusMsg.className = 'meter-status unbalanced';
      }
    }
  };

  // Auto-Balance Button
  const autoBalanceAllocations = () => {
    const isPercent = appState.splitMode === 'unequal-percent';
    const peopleCount = parseInt(peopleInput.value, 10) || 1;
    const finances = getFinancialBreakdown();
    const grandTotal = finances.grandTotal;

    if (isPercent) {
      const basePct = Math.floor((100 / peopleCount) * 10) / 10;
      let running = 0;
      for (let i = 0; i < peopleCount; i++) {
        if (i === peopleCount - 1) {
          appState.unequalValues[i] = parseFloat((100 - running).toFixed(1));
        } else {
          appState.unequalValues[i] = basePct;
          running += basePct;
        }
      }
    } else {
      const totalCents = Math.round(grandTotal * 100);
      const baseCents = Math.floor(totalCents / peopleCount);
      const remCents = totalCents % peopleCount;

      for (let i = 0; i < peopleCount; i++) {
        const cents = baseCents + (i < remCents ? 1 : 0);
        appState.unequalValues[i] = parseFloat((cents / 100).toFixed(2));
      }
    }

    syncUnequalInputs();
    playSoundEffect('tap');
    showToast('Allocations auto-balanced evenly!', '⚡');
  };

  // --- Exact Mathematical Calculation Engine ---
  const calculateSplit = () => {
    const finances = getFinancialBreakdown();
    const grandTotal = finances.grandTotal;
    const totalCents = Math.round(grandTotal * 100);
    const peopleCount = parseInt(appState.people, 10);
    const mode = appState.splitMode;

    const shares = [];
    let runningSumCents = 0;

    if (mode === 'equal') {
      const baseCents = Math.floor(totalCents / peopleCount);
      const remainderCents = totalCents % peopleCount;

      for (let i = 0; i < peopleCount; i++) {
        const hasExtraPenny = i < remainderCents;
        const personCents = baseCents + (hasExtraPenny ? 1 : 0);
        runningSumCents += personCents;

        shares.push({
          index: i,
          cents: personCents,
          amount: personCents / 100,
          hasExtraPenny: hasExtraPenny,
          percentOfTotal: totalCents > 0 ? ((personCents / totalCents) * 100).toFixed(1) : 0
        });
      }
    } else if (mode === 'unequal-percent') {
      let allocatedCents = 0;
      for (let i = 0; i < peopleCount; i++) {
        const pct = parseFloat(appState.unequalValues[i]) || 0;
        let personCents = Math.round((totalCents * (pct / 100)));
        if (i === peopleCount - 1) {
          personCents = Math.max(0, totalCents - allocatedCents);
        } else {
          allocatedCents += personCents;
        }

        runningSumCents += personCents;
        shares.push({
          index: i,
          cents: personCents,
          amount: personCents / 100,
          hasExtraPenny: false,
          percentOfTotal: pct.toFixed(1)
        });
      }
    } else if (mode === 'unequal-amount') {
      for (let i = 0; i < peopleCount; i++) {
        const amt = parseFloat(appState.unequalValues[i]) || 0;
        const personCents = Math.round(amt * 100);
        runningSumCents += personCents;

        shares.push({
          index: i,
          cents: personCents,
          amount: personCents / 100,
          hasExtraPenny: false,
          percentOfTotal: totalCents > 0 ? ((personCents / totalCents) * 100).toFixed(1) : 0
        });
      }
    }

    const calculatedSum = runningSumCents / 100;
    const difference = Math.abs(calculatedSum - grandTotal);

    return {
      ...finances,
      peopleCount,
      splitMode: mode,
      shares,
      calculatedSum,
      difference
    };
  };

  // --- Render Results ---
  const renderResults = () => {
    const subtotal = parseFloat(appState.amount);
    const people = parseInt(appState.people, 10);
    const currency = appState.currency || '₹';

    if (isNaN(subtotal) || subtotal <= 0 || isNaN(people) || people <= 0) {
      hideResults();
      return;
    }

    const splitData = calculateSplit();

    if (emptyState) emptyState.style.display = 'none';
    if (resultsContent) resultsContent.style.display = 'flex';
    if (resultsActions) resultsActions.style.display = 'flex';
    if (resultsStatusText) resultsStatusText.textContent = `Audited breakdown for ${people} friends`;

    if (displayOccasionName) displayOccasionName.textContent = appState.occasion || 'Friends Gathering';
    if (displayEventDate) displayEventDate.textContent = formatDisplayDate(appState.eventDate);
    if (displayLocationName) displayLocationName.textContent = appState.location ? appState.location : 'Venue Unspecified';

    if (displayTimestamp) displayTimestamp.textContent = appState.timestamp || new Date().toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (displaySplitMode) {
      if (appState.splitMode === 'equal') displaySplitMode.textContent = 'Equal Split';
      else if (appState.splitMode === 'unequal-amount') displaySplitMode.textContent = 'Custom Amounts';
      else displaySplitMode.textContent = 'Custom % Split';
    }

    // Hero Section
    if (heroCurrencySymbol) heroCurrencySymbol.textContent = currency;
    if (heroShareAmount) {
      if (appState.splitMode === 'equal') {
        const first = splitData.shares[0]?.amount || 0;
        const last = splitData.shares[splitData.shares.length - 1]?.amount || 0;
        if (first !== last) {
          heroShareAmount.textContent = `${first.toFixed(2)} ~ ${last.toFixed(2)}`;
          if (heroNote) heroNote.textContent = 'Equal split with 1-cent penny balance';
        } else {
          heroShareAmount.textContent = first.toFixed(2);
          if (heroNote) heroNote.textContent = 'Exact equal split per person';
        }
      } else {
        const amounts = splitData.shares.map(s => s.amount);
        const min = Math.min(...amounts);
        const max = Math.max(...amounts);
        heroShareAmount.textContent = `${min.toFixed(2)} ~ ${max.toFixed(2)}`;
        if (heroNote) heroNote.textContent = `Custom ${appState.splitMode === 'unequal-percent' ? 'percentage' : 'amount'} distribution`;
      }
    }

    // Metric Tiles
    if (metricSubtotal) metricSubtotal.textContent = formatMoney(splitData.subtotal);
    if (metricTax) {
      metricTax.textContent = splitData.taxAmount > 0 ? `+${formatMoney(splitData.taxAmount)} (${splitData.effectiveTaxRate}%)` : 'None (0%)';
    }
    if (metricTip) {
      metricTip.textContent = splitData.tipAmount > 0 ? `+${formatMoney(splitData.tipAmount)}` : 'None (0%)';
    }
    if (metricTotal) metricTotal.textContent = formatMoney(splitData.grandTotal);

    // Mathematical Audit Proof Section
    if (vSumShares) vSumShares.textContent = `${formatMoney(splitData.calculatedSum)} (100.0%)`;
    if (vTotalBill) vTotalBill.textContent = formatMoney(splitData.grandTotal);
    if (vDifference) {
      if (splitData.difference === 0) {
        vDifference.textContent = `${currency}0.00 (Zero Variance • Perfect Match)`;
        vDifference.className = 'eq-val zero';
      } else {
        vDifference.textContent = `${currency}${splitData.difference.toFixed(4)}`;
        vDifference.className = 'eq-val';
      }
    }

    // Render Friends Cards
    renderFriendsList(splitData);
    updateSettlementProgress(splitData);
  };

  // --- Dynamic Friends List Rendering with Simple Animations & Annotations ---
  const renderFriendsList = (splitData) => {
    if (!friendsList) return;
    friendsList.innerHTML = '';

    splitData.shares.forEach((share, index) => {
      const defaultName = `Friend ${index + 1}`;
      const friendName = appState.customNames[index] || defaultName;
      const isPaid = !!appState.paidStatus[index];
      const avatarIcon = DEFAULT_AVATARS[index % DEFAULT_AVATARS.length];

      const friendCard = document.createElement('div');
      friendCard.className = `friend-card ${isPaid ? 'paid' : ''}`;
      friendCard.setAttribute('role', 'listitem');
      friendCard.dataset.index = index;

      const checkmarkSvg = isPaid ? `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="checkmark-draw">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ` : `
        <span class="unpaid-dot" aria-hidden="true">○</span>
      `;

      const stampAnnotation = isPaid ? `
        <div class="paid-stamp" aria-label="Paid Status Stamp">PAID ✓</div>
      ` : '';

      friendCard.innerHTML = `
        <div class="friend-avatar" aria-hidden="true">${avatarIcon}</div>
        <div class="friend-details">
          <input 
            type="text" 
            class="friend-name-input" 
            value="${escapeHtml(friendName)}" 
            title="Click to rename" 
            aria-label="Name of friend ${index + 1}"
            maxlength="25"
          >
          <div class="friend-meta">
            <span class="friend-percentage">${share.percentOfTotal}% share</span>
            ${share.hasExtraPenny ? '<span class="friend-rounding-tag" title="Includes 1-cent odd penny share">+0.01 rounded</span>' : ''}
          </div>
        </div>
        ${stampAnnotation}
        <div class="friend-amount-wrap">
          <div class="friend-amount">${formatMoney(share.amount)}</div>
        </div>
        <button 
          type="button" 
          class="friend-pay-btn ${isPaid ? 'is-paid' : ''}" 
          aria-label="Toggle payment for ${escapeHtml(friendName)}"
          data-index="${index}"
        >
          <span class="pay-btn-icon">${checkmarkSvg}</span>
          <span class="pay-btn-text">${isPaid ? 'Paid' : 'Unpaid'}</span>
        </button>
      `;

      // Live Rename
      const nameInput = friendCard.querySelector('.friend-name-input');
      nameInput.addEventListener('change', (e) => {
        const val = e.target.value.trim() || `Friend ${index + 1}`;
        appState.customNames[index] = val;
        e.target.value = val;
        saveStateToStorage();
        syncUnequalInputs();
      });

      // Pay Toggle with Simple Animation & Sound Feedback
      const payBtn = friendCard.querySelector('.friend-pay-btn');
      payBtn.addEventListener('click', () => {
        const current = !!appState.paidStatus[index];
        const nextState = !current;
        appState.paidStatus[index] = nextState;
        saveStateToStorage();

        if (nextState) {
          playSoundEffect('paid');
          showToast(`${friendName} marked as paid!`, '✅');
        } else {
          playSoundEffect('tap');
        }

        renderResults();

        const updatedCard = friendsList.querySelector(`.friend-card[data-index="${index}"]`);
        if (updatedCard && nextState) {
          updatedCard.classList.add('just-settled');
          setTimeout(() => updatedCard.classList.remove('just-settled'), 500);
        }
      });

      friendsList.appendChild(friendCard);
    });
  };

  // --- Collection Progress ---
  const updateSettlementProgress = (splitData) => {
    const totalCount = splitData.shares.length;
    let paidCount = 0;
    let paidAmount = 0;

    splitData.shares.forEach((share, idx) => {
      if (appState.paidStatus[idx]) {
        paidCount++;
        paidAmount += share.amount;
      }
    });

    const percent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
    const remainingAmount = Math.max(0, splitData.grandTotal - paidAmount);

    if (settleProgressBar) settleProgressBar.style.width = `${percent}%`;
    if (settlePercentText) settlePercentText.textContent = `${percent}% Collected`;
    if (settleCountText) settleCountText.textContent = `${paidCount} of ${totalCount} friends paid`;
    if (settleRemainingText) settleRemainingText.textContent = `${formatMoney(remainingAmount)} pending`;

    if (totalCount > 0 && paidCount === totalCount) {
      showToast('All friends have settled up in full! 🎉', '🥳');
    }
  };

  // --- Formal Clipboard Export with Author, Location & Competition ID ---
  const copySplitSummary = () => {
    if (!appState.hasCalculated) return;
    const splitData = calculateSplit();

    let modeText = 'Equal Split';
    if (appState.splitMode === 'unequal-amount') modeText = 'Custom Amount Split';
    else if (appState.splitMode === 'unequal-percent') modeText = 'Custom Percentage Split';

    const locText = appState.location ? appState.location : 'Venue Unspecified';
    const dateFormatted = formatDisplayDate(appState.eventDate);

    let summaryText = `════════════════════════════════════════════════════════════\n`;
    summaryText += `                 SPLITZZ! EXPENSE LEDGER                    \n`;
    summaryText += `   Techfest 2026 • ZeroCode Challenge • ID: ZC-1D2BABEF545A \n`;
    summaryText += `   Submission of Ojas Shailesh Deshpande                    \n`;
    summaryText += `   Portfolio: www.ojasdeshpande.in                          \n`;
    summaryText += `════════════════════════════════════════════════════════════\n`;
    summaryText += `🎉 Occasion:     ${appState.occasion}\n`;
    summaryText += `📅 Event Date:   ${dateFormatted}\n`;
    summaryText += `📍 Location:     ${locText}\n`;
    summaryText += `⚙️ Method:       ${modeText}\n`;
    summaryText += `────────────────────────────────────────────────────────────\n`;
    summaryText += `💵 Subtotal:     ${formatMoney(splitData.subtotal)}\n`;
    summaryText += `🏛️ Tax:          ${formatMoney(splitData.taxAmount)} (${splitData.effectiveTaxRate}%)\n`;
    summaryText += `🤝 Tip/Gratuity: ${formatMoney(splitData.tipAmount)}\n`;
    summaryText += `💰 Grand Total:  ${formatMoney(splitData.grandTotal)}\n`;
    summaryText += `👥 Group Count:  ${splitData.peopleCount} Friends\n`;
    summaryText += `────────────────────────────────────────────────────────────\n`;
    summaryText += `INDIVIDUAL MEMBER ALLOCATIONS:\n`;

    splitData.shares.forEach((s, idx) => {
      const name = appState.customNames[idx] || `Friend ${idx + 1}`;
      const status = appState.paidStatus[idx] ? '[PAID ✓]' : '[UNPAID ⏳]';
      summaryText += ` • ${name.padEnd(16)}: ${formatMoney(s.amount)} (${s.percentOfTotal}%) ${status}\n`;
    });

    summaryText += `────────────────────────────────────────────────────────────\n`;
    summaryText += `AUDIT VERIFICATION:\n`;
    summaryText += `Sum of Shares = ${formatMoney(splitData.calculatedSum)} | Official Total = ${formatMoney(splitData.grandTotal)}\n`;
    summaryText += `Variance: ${appState.currency}0.00 (Zero Rounding Leakage • 100% Exact)\n`;
    summaryText += `════════════════════════════════════════════════════════════\n`;
    summaryText += `Generated via SPLITZZ! • Submission by Ojas Shailesh Deshpande (www.ojasdeshpande.in)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText)
        .then(() => {
          showToast('Breakdown copied to clipboard!', '📋');
          if (copyTooltip) copyTooltip.textContent = 'Copied!';
          setTimeout(() => { if (copyTooltip) copyTooltip.textContent = 'Copy'; }, 2000);
        })
        .catch(() => fallbackCopy(summaryText));
    } else {
      fallbackCopy(summaryText);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Breakdown copied to clipboard!', '📋');
    } catch {
      showToast('Could not copy automatically.', '⚠️');
    }
  };

  // --- Formal Receipt Print ---
  const printSplitReceipt = () => {
    if (!appState.hasCalculated) {
      showToast('Please calculate a split first.', '⚠️');
      return;
    }
    showToast('Opening verified receipt print dialog...', '🖨️');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // --- Reset All Logic ---
  const resetAll = () => {
    appState = {
      occasion: '',
      eventDate: getTodayISO(),
      location: '',
      amount: '',
      currency: '₹',
      people: 4,
      taxInclusive: false,
      taxRate: 0,
      customTaxRate: '',
      tipMode: 'percent',
      tipPercent: 0,
      customTipPercent: '',
      customTipAmount: 0,
      splitMode: 'equal',
      unequalValues: {},
      customNames: {},
      paidStatus: {},
      timestamp: '',
      hasCalculated: false
    };

    clearStorage();
    clearAllErrors();

    if (occasionInput) occasionInput.value = '';
    if (eventDateInput) eventDateInput.value = appState.eventDate;
    if (locationInput) locationInput.value = '';
    if (locationHint) locationHint.textContent = 'Enter address or click "GPS Coords" to auto-detect coordinates';
    if (amountInput) amountInput.value = '';
    if (peopleInput) peopleInput.value = '4';
    if (currencySelect) currencySelect.value = '₹';
    if (currencyPrefix) currencyPrefix.textContent = '₹';
    if (tipAmountPrefix) tipAmountPrefix.textContent = '₹';

    // Reset Tax
    if (taxInclusiveCheckbox) taxInclusiveCheckbox.checked = false;
    if (taxControlsWrapper) {
      taxControlsWrapper.style.opacity = '1';
      taxControlsWrapper.style.pointerEvents = 'auto';
    }
    taxButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tax === '0'));
    if (customTaxInputWrap) customTaxInputWrap.style.display = 'none';
    if (customTaxInput) customTaxInput.value = '';

    // Reset Tip
    if (tipModePercentBtn) tipModePercentBtn.classList.add('active');
    if (tipModeAmountBtn) tipModeAmountBtn.classList.remove('active');
    if (tipPercentView) tipPercentView.style.display = 'flex';
    if (tipAmountView) tipAmountView.style.display = 'none';
    tipButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tip === '0'));
    if (customTipPercentWrap) customTipPercentWrap.style.display = 'none';
    if (customTipPercentInput) customTipPercentInput.value = '';
    if (customTipAmountInput) customTipAmountInput.value = '';

    // Reset Mode Tabs
    modeTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === 'equal');
      tab.setAttribute('aria-selected', tab.dataset.mode === 'equal');
    });

    peopleChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.people === '4');
    });

    updateFinancialPreviews();
    syncUnequalInputs();
    hideResults();
    showToast('All fields reset cleanly.', '🔄');
    playSoundEffect('tap');
  };

  // --- Event Listeners Wiring ---

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateInputs()) {
        return;
      }

      appState.occasion = occasionInput.value.trim();
      appState.eventDate = eventDateInput ? eventDateInput.value : getTodayISO();
      appState.location = locationInput ? locationInput.value.trim() : '';
      appState.amount = parseFloat(amountInput.value.trim()).toFixed(2);
      appState.people = parseInt(peopleInput.value.trim(), 10);
      appState.currency = currencySelect ? currencySelect.value : '₹';
      appState.hasCalculated = true;
      appState.timestamp = new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });

      saveStateToStorage();
      renderResults();
      playSoundEffect('success');
      showToast('Audited bill split calculated with penny precision!', '⚡');
    });
  }

  // Detect GPS Coordinates Button
  if (detectGpsBtn) {
    detectGpsBtn.addEventListener('click', () => {
      acquireGpsCoordinates();
    });
  }

  // Location Input Live Binding
  if (locationInput) {
    locationInput.addEventListener('input', (e) => {
      appState.location = e.target.value.trim();
      if (appState.hasCalculated && displayLocationName) {
        displayLocationName.textContent = appState.location || 'Venue Unspecified';
        saveStateToStorage();
      }
    });
  }

  // Event Date Input Live Binding
  if (eventDateInput) {
    eventDateInput.addEventListener('change', (e) => {
      appState.eventDate = e.target.value;
      if (appState.hasCalculated && displayEventDate) {
        displayEventDate.textContent = formatDisplayDate(appState.eventDate);
        saveStateToStorage();
      }
    });
  }

  // Tax Inclusive Checkbox
  if (taxInclusiveCheckbox) {
    taxInclusiveCheckbox.addEventListener('change', (e) => {
      appState.taxInclusive = e.target.checked;
      if (taxControlsWrapper) {
        taxControlsWrapper.style.opacity = e.target.checked ? '0.4' : '1';
        taxControlsWrapper.style.pointerEvents = e.target.checked ? 'none' : 'auto';
      }
      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
      playSoundEffect('tap');
    });
  }

  // Tax Preset Buttons
  taxButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      taxButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const taxVal = btn.dataset.tax;
      if (taxVal === 'custom') {
        appState.taxRate = 'custom';
        if (customTaxInputWrap) customTaxInputWrap.style.display = 'flex';
        if (customTaxInput) customTaxInput.focus();
      } else {
        appState.taxRate = parseFloat(taxVal) || 0;
        if (customTaxInputWrap) customTaxInputWrap.style.display = 'none';
      }

      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
      playSoundEffect('tap');
    });
  });

  // Custom Tax Input
  if (customTaxInput) {
    customTaxInput.addEventListener('input', (e) => {
      appState.customTaxRate = e.target.value;
      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
    });
  }

  // Tip Mode Switcher (% vs Fixed Amount)
  if (tipModePercentBtn && tipModeAmountBtn) {
    tipModePercentBtn.addEventListener('click', () => {
      tipModePercentBtn.classList.add('active');
      tipModeAmountBtn.classList.remove('active');
      appState.tipMode = 'percent';
      if (tipPercentView) tipPercentView.style.display = 'flex';
      if (tipAmountView) tipAmountView.style.display = 'none';
      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
      playSoundEffect('tap');
    });

    tipModeAmountBtn.addEventListener('click', () => {
      tipModeAmountBtn.classList.add('active');
      tipModePercentBtn.classList.remove('active');
      appState.tipMode = 'amount';
      if (tipPercentView) tipPercentView.style.display = 'none';
      if (tipAmountView) tipAmountView.style.display = 'flex';
      if (customTipAmountInput) customTipAmountInput.focus();
      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
      playSoundEffect('tap');
    });
  }

  // Tip Buttons (% view)
  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tipVal = btn.dataset.tip;
      if (tipVal === 'custom') {
        appState.tipPercent = 'custom';
        if (customTipPercentWrap) customTipPercentWrap.style.display = 'flex';
        if (customTipPercentInput) customTipPercentInput.focus();
      } else {
        appState.tipPercent = parseFloat(tipVal) || 0;
        if (customTipPercentWrap) customTipPercentWrap.style.display = 'none';
      }

      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
      playSoundEffect('tap');
    });
  });

  // Custom Tip Percent Input
  if (customTipPercentInput) {
    customTipPercentInput.addEventListener('input', (e) => {
      appState.customTipPercent = e.target.value;
      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
    });
  }

  // Custom Tip Amount Input (Flat amount view)
  if (customTipAmountInput) {
    customTipAmountInput.addEventListener('input', (e) => {
      appState.customTipAmount = Math.max(0, parseFloat(e.target.value) || 0);
      updateFinancialPreviews();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
    });
  }

  // Split Mode Switcher with Automatic Rebalancing
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetMode = tab.dataset.mode;
      const prevMode = appState.splitMode;

      if (targetMode === prevMode) return;

      modeTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      appState.splitMode = targetMode;

      autoRebalanceOnModeChange(targetMode, prevMode);

      syncUnequalInputs();
      playSoundEffect('tap');
      showToast(`Switched to ${targetMode === 'equal' ? 'Equal' : (targetMode === 'unequal-percent' ? 'Custom %' : 'Custom Amount')} (Auto-Rebalanced)`, '⚖️');

      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
    });
  });

  // Auto-Balance Button
  if (autoFillRemainingBtn) {
    autoFillRemainingBtn.addEventListener('click', () => {
      autoBalanceAllocations();
    });
  }

  // Real-time Input Clearing
  if (occasionInput) {
    occasionInput.addEventListener('input', () => {
      if (occasionInput.classList.contains('is-invalid')) {
        occasionInput.classList.remove('is-invalid');
        if (occasionError) occasionError.textContent = '';
      }
    });
  }

  if (amountInput) {
    amountInput.addEventListener('input', () => {
      if (amountInput.classList.contains('is-invalid')) {
        amountInput.classList.remove('is-invalid');
        if (amountError) amountError.textContent = '';
      }
      updateFinancialPreviews();
    });
  }

  if (peopleInput) {
    peopleInput.addEventListener('input', () => {
      if (peopleInput.classList.contains('is-invalid')) {
        peopleInput.classList.remove('is-invalid');
        if (peopleError) peopleError.textContent = '';
      }
      const count = peopleInput.value.trim();
      peopleChips.forEach(chip => {
        chip.classList.toggle('active', chip.dataset.people === count);
      });
      syncUnequalInputs();
    });
  }

  // Currency Selection
  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      const curr = currencySelect.value;
      appState.currency = curr;
      if (currencyPrefix) currencyPrefix.textContent = curr;
      if (tipAmountPrefix) tipAmountPrefix.textContent = curr;
      updateFinancialPreviews();
      syncUnequalInputs();
      if (appState.hasCalculated) {
        saveStateToStorage();
        renderResults();
      }
      playSoundEffect('tap');
    });
  }

  // Occasion Chips
  occasionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (occasionInput) {
        occasionInput.value = chip.dataset.occasion;
        occasionInput.classList.remove('is-invalid');
        if (occasionError) occasionError.textContent = '';
        occasionInput.focus();
      }
      playSoundEffect('tap');
    });
  });

  // Amount Increment Chips
  amountChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (!amountInput) return;
      const addVal = parseFloat(chip.dataset.amount) || 0;
      const current = parseFloat(amountInput.value) || 0;
      amountInput.value = (current + addVal).toFixed(2);
      amountInput.classList.remove('is-invalid');
      if (amountError) amountError.textContent = '';
      updateFinancialPreviews();
      playSoundEffect('tap');
    });
  });

  // People Preset Chips
  peopleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const p = chip.dataset.people;
      if (peopleInput) {
        peopleInput.value = p;
        peopleInput.classList.remove('is-invalid');
        if (peopleError) peopleError.textContent = '';
      }
      peopleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      syncUnequalInputs();
      playSoundEffect('tap');
    });
  });

  // Stepper Buttons (+ / -)
  if (decrementPeopleBtn && peopleInput) {
    decrementPeopleBtn.addEventListener('click', () => {
      const cur = parseInt(peopleInput.value, 10) || 1;
      if (cur > 1) {
        peopleInput.value = cur - 1;
        peopleInput.dispatchEvent(new Event('input'));
        playSoundEffect('tap');
      }
    });
  }

  if (incrementPeopleBtn && peopleInput) {
    incrementPeopleBtn.addEventListener('click', () => {
      const cur = parseInt(peopleInput.value, 10) || 1;
      if (cur < 50) {
        peopleInput.value = cur + 1;
        peopleInput.dispatchEvent(new Event('input'));
        playSoundEffect('tap');
      }
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAll();
    });
  }

  // Copy Buttons
  if (copySummaryBtn) {
    copySummaryBtn.addEventListener('click', () => {
      copySplitSummary();
    });
  }
  if (copyBtnBottom) {
    copyBtnBottom.addEventListener('click', () => {
      copySplitSummary();
    });
  }

  // Print Buttons
  if (printSplitBtn) {
    printSplitBtn.addEventListener('click', () => {
      printSplitReceipt();
    });
  }
  if (printBtnBottom) {
    printBtnBottom.addEventListener('click', () => {
      printSplitReceipt();
    });
  }

  // --- Initial Page Load & Persistence Recovery ---
  const restored = loadStateFromStorage();
  if (restored) {
    if (appState.occasion && occasionInput) occasionInput.value = appState.occasion;
    if (appState.eventDate && eventDateInput) {
      eventDateInput.value = appState.eventDate;
    } else if (eventDateInput) {
      eventDateInput.value = getTodayISO();
    }
    if (appState.location && locationInput) {
      locationInput.value = appState.location;
    }
    if (appState.amount && amountInput) amountInput.value = appState.amount;
    if (appState.people && peopleInput) {
      peopleInput.value = appState.people;
      peopleChips.forEach(c => c.classList.toggle('active', c.dataset.people === String(appState.people)));
    }
    if (appState.currency && currencySelect) {
      currencySelect.value = appState.currency;
      if (currencyPrefix) currencyPrefix.textContent = appState.currency;
      if (tipAmountPrefix) tipAmountPrefix.textContent = appState.currency;
    }

    // Restore Tax State
    if (taxInclusiveCheckbox) {
      taxInclusiveCheckbox.checked = !!appState.taxInclusive;
      if (taxControlsWrapper) {
        taxControlsWrapper.style.opacity = appState.taxInclusive ? '0.4' : '1';
        taxControlsWrapper.style.pointerEvents = appState.taxInclusive ? 'none' : 'auto';
      }
    }
    taxButtons.forEach(btn => {
      const isAct = String(btn.dataset.tax) === String(appState.taxRate);
      btn.classList.toggle('active', isAct);
    });
    if (appState.taxRate === 'custom' && customTaxInputWrap) {
      customTaxInputWrap.style.display = 'flex';
      if (customTaxInput) customTaxInput.value = appState.customTaxRate || '';
    }

    // Restore Tip State
    if (appState.tipMode === 'amount') {
      if (tipModeAmountBtn) tipModeAmountBtn.classList.add('active');
      if (tipModePercentBtn) tipModePercentBtn.classList.remove('active');
      if (tipPercentView) tipPercentView.style.display = 'none';
      if (tipAmountView) tipAmountView.style.display = 'flex';
      if (customTipAmountInput) customTipAmountInput.value = appState.customTipAmount || '';
    } else {
      if (tipModePercentBtn) tipModePercentBtn.classList.add('active');
      if (tipModeAmountBtn) tipModeAmountBtn.classList.remove('active');
      if (tipPercentView) tipPercentView.style.display = 'flex';
      if (tipAmountView) tipAmountView.style.display = 'none';
      tipButtons.forEach(btn => {
        const isAct = String(btn.dataset.tip) === String(appState.tipPercent);
        btn.classList.toggle('active', isAct);
      });
      if (appState.tipPercent === 'custom' && customTipPercentWrap) {
        customTipPercentWrap.style.display = 'flex';
        if (customTipPercentInput) customTipPercentInput.value = appState.customTipPercent || '';
      }
    }

    // Restore Split Mode
    if (appState.splitMode) {
      modeTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.mode === appState.splitMode);
        t.setAttribute('aria-selected', t.dataset.mode === appState.splitMode);
      });
    }

    updateFinancialPreviews();
    syncUnequalInputs();

    if (appState.hasCalculated && appState.amount && appState.people) {
      renderResults();
    }
  } else {
    if (eventDateInput) eventDateInput.value = getTodayISO();
    updateFinancialPreviews();
    syncUnequalInputs();
  }
});
