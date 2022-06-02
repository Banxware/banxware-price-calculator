// CONFIGURATION ⚙️

const config = {
  sliderPosition: {
    min: 3,
    max: 100,
    initial: 51,
  },
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
  initialDiscount: 1,
  discount: {
    1: 1,
    2: 0.8235294118,
    3: 1,
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
let tempSliderPosition = 0.5;
let loanAmount = config.loanAmount;
let term = config.initialTerm;
let oneTimeFee = config.feeRatio[term] * 100;
let totalRepayable = loanAmount + loanAmount * oneTimeFee;
let lastSliderValue = 0.5;
let chosenDiscount = config.initialDiscount;

let getOneTimeFeeCash = function () {
  return round(config.feeRatio[term] * loanAmount);
}

const updateFields = function () {
  const loanAmountElement = document.querySelector("#loanAmount");
  const totalRepayableElement = document.querySelector("#totalRepayable");
  const oneTimeFeeElement = document.querySelector("#oneTimeFee");
  const oneTimeFeeCashElment = document.querySelector("#oneTimeFeeCash");

  oneTimeFeeCashElment.textContent = numberWithCommas(getOneTimeFeeCash()) + " \u20AC";
  loanAmountElement.innerText = numberWithCommas(loanAmount) + " \u20AC";
  totalRepayableElement.textContent = numberWithCommas(totalRepayable) + " \u20AC";
  oneTimeFeeElement.textContent = oneTimeFee + " %";
}

const updateSlider = function (ratio) {
  tempSliderPosition = ratio;
  loanAmount = round(config.initialLoanAmount * round(ratio, 2), 0);
  oneTimeFee = round(config.feeRatio[term] * 100, 2);
  totalRepayable = round(loanAmount + loanAmount * config.feeRatio[term], 0);
  if (chosenDiscount !== 1) {
    addDiscount(chosenDiscount);
  }
  updateFields()
};

function addDiscount(discount) {
  let tempLoanAmount = config.initialLoanAmount * lastSliderValue;
  let tempFeeRatio = config.feeRatio[term] * discount;
  let tempOneTimeFee = round(tempFeeRatio * 100, 1);
  oneTimeFee = tempOneTimeFee;
  totalRepayable = round(tempLoanAmount + tempFeeRatio * tempLoanAmount, 0);
  chosenDiscount = discount;
  updateFields()
}

let sliderChange = function (n) {
  var e = n.target.value;
  var divider = e / 100;
  lastSliderValue = divider;
  updateSlider(divider);
};

var triggerButtonStyle = function (button, on) {
  button.style.backgroundColor = on
    ? config.colors.primary
    : config.colors.background;
  button.style.color = on ? config.colors.background : config.colors.primary;
};

document.addEventListener("DOMContentLoaded", function () {
  // DOM ELEMENTS 🎨
  const root = document.documentElement;
  const sliderInput = document.querySelector("#sliderInput");

  // create CSS variables
  root.style.setProperty("--widget-primary", config.colors.primary);
  root.style.setProperty("--widget-background", config.colors.background);
  sliderInput.style.setProperty("--min", config.sliderPosition.min);
  sliderInput.style.setProperty("--max", config.sliderPosition.max);

  // needs to be a bit more the half the width  (HACK)
  sliderInput.style.setProperty("--value", config.sliderPosition.initial);

  // enforce slider to initial value
  updateSlider(tempSliderPosition);

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
  const termRadio = document.querySelectorAll('input[name="termDuration"]');
  for (const radioButton of termRadio) {
    radioButton.addEventListener("change", changeTerm);
  }

  function changeTerm(e) {
    if (e.target.value) {
      term = e.target.value;
      updateSlider(tempSliderPosition);
    }
  }

  const discountRadio = document.querySelectorAll('input[name="discount"]');
  for (const radioButton of discountRadio) {
    radioButton.addEventListener("change", changeDiscount);
  }

  function changeDiscount(e) {
    if (e.target.value) {
      webflowCheckHelper(e.target)
      addDiscount(config.discount[e.target.value]);
      // updateSlider(tempSliderPosition);
    }
  }

  // This just helps our current webflow implementation, please delete and ignore if you use it elsewhere
  function webflowCheckHelper(input) {
    let parent = input.parentNode
    let parentsParent = parent.parentNode
    for (let i = 0; i < parentsParent.children.length; i++) {
      parentsParent.children[i].classList.remove('checked');
    }
    parent.classList.add("checked")
  }
});
