// CONFIGURATION ⚙️

const config = {
  colors: {
    primary: "#7000ff",
    background: "#fff",
  },
  initialLoanAmount: 100000,
  initialTerm: 6,
  feeRatio: {
    6: 0.06,
    12: 0.085,
  },
  discount: {
    marketing: 0.235294118,
    inventory: 1,
    other: 1,
  },
};

// LOGIC 🧮

function numberWithCommas(x) {
  return x.toString().replace("/B(?<!.d*)(?=(d{3})+(?!d))/g", ".");
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
let tempSliderPosition = 0.5
let loanAmount = config.loanAmount;
let term = config.initialTerm;
let oneTimeFee = config.feeRatio[term] * 100;
let totalRepayable = loanAmount + loanAmount * oneTimeFee;
const marketingDiscount = 0.8235294118;
const inventoryDiscount = 1;
const otherDiscount = 1;
let lastSliderValue = 0.5;

var isMarketingBtnActive = false;
var isInventoryBtnActive = false;
var isOtherBtnActive = true;

let updateSlider = function (ratio) {
  tempSliderPosition = ratio
  loanAmount = round(config.initialLoanAmount * round(ratio, 2), 0);
  oneTimeFee = round(config.feeRatio[term] * 100, 2);
  totalRepayable = round(loanAmount + loanAmount * config.feeRatio[term], 0);
  if (isMarketingBtnActive) {
    addDiscount(config.discount.marketing);
  }
  const loanAmountElement = document.querySelector("#loanAmount");
  const totalRepayableElement = document.querySelector("#totalRepayable");
  const oneTimeFeeElement = document.querySelector("#oneTimeFee");

  loanAmountElement.innerText = numberWithCommas(loanAmount) + " \u20AC";
  totalRepayableElement.textContent =
    numberWithCommas(totalRepayable) + " \u20AC";
  oneTimeFeeElement.textContent = oneTimeFee + " %";
};

function addDiscount(discount) {
  var tempLoanAmount = config.initialLoanAmount * lastSliderValue;
  var tempFeeRatio = config.feeRatio[term] * discount;
  var tempOneTimeFee = round(tempFeeRatio * 100, 1);
  oneTimeFee = tempOneTimeFee;
  totalRepayable = round(tempLoanAmount + tempFeeRatio * tempLoanAmount, 0);

  //var loanAmoumtElement = document.querySelector('#loanAmount');
  var totalRepayableElement = document.querySelector("#totalRepayable");
  var oneTimeFeeElement = document.querySelector("#oneTimeFee");

  totalRepayableElement.textContent =
    numberWithCommas(totalRepayable) + " \u20AC";
  oneTimeFeeElement.textContent = oneTimeFee + " %";
}

let sliderChange = function (n) {
  var e = n.target.value;
  var divider = e / 100;
  lastSliderValue = divider;
  updateSlider(divider);
  console.log(e);
};

var triggerButtonStyle = function (button, on) {
  button.style.backgroundColor = on
    ? config.colors.primary
    : config.colors.background;
  button.style.color = on ? config.colors.background : config.colors.primary;
};

document.addEventListener("DOMContentLoaded", function () {
  // just to be sure
  updateSlider(tempSliderPosition);

  // DOM ELEMENTS 🎨
  const sliderInput = document.querySelector("#sliderInput");
  const marketingBtn = document.querySelector("#marketingBtn");
  const inventoryBtn = document.querySelector("#inventoryBtn");
  const otherBtn = document.querySelector("#otherBtn");

  // THE SLIDER  🎨
  sliderInput.addEventListener("input", sliderChange);

  for (let e of document.querySelectorAll(
    'input[type="range"].slider-progress'
  )) {
    e.style.setProperty("--value", e.value);
    e.style.setProperty("--min", e.min == "" ? "0" : e.min);
    e.style.setProperty("--max", e.max == "" ? "100" : e.max);
    e.addEventListener("input", () => e.style.setProperty("--value", e.value));
  }
  // add an event listener for the change event
  const radioButtons = document.querySelectorAll('input[name="termDuration"]');
  for (const radioButton of radioButtons) {
    radioButton.addEventListener("change", changeTerm);
  }

  function changeTerm(e) {
    console.log(e.target.value);
    if (e.target.value) {
      term = e.target.value
      updateSlider(tempSliderPosition);
    }
  }

  marketingBtn.addEventListener("click", function (event) {
    if (!isMarketingBtnActive) {
      triggerButtonStyle(marketingBtn, true);
      triggerButtonStyle(inventoryBtn, false);
      triggerButtonStyle(otherBtn, false);
      addDiscount(marketingDiscount);
      isInventoryBtnActive = isOtherBtnActive = false;
      isMarketingBtnActive = true;
    }
    return false;
  });

  inventoryBtn.addEventListener("click", function (event) {
    if (!isInventoryBtnActive) {
      triggerButtonStyle(marketingBtn, false);
      triggerButtonStyle(inventoryBtn, true);
      triggerButtonStyle(otherBtn, false);
      addDiscount(inventoryDiscount);
      isMarketingBtnActive = isOtherBtnActive = false;
      isInventoryBtnActive = true;
    }
    return false;
  });
  otherBtn.addEventListener("click", function (event) {
    if (!isOtherBtnActive) {
      triggerButtonStyle(marketingBtn, false);
      triggerButtonStyle(inventoryBtn, false);
      triggerButtonStyle(otherBtn, true);

      addDiscount(otherDiscount);
      isMarketingBtnActive = isInventoryBtnActive = false;
      isOtherBtnActive = true;
    }
    return false;
  });
});
