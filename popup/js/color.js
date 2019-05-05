// Interpolate color using given factor, source: https://codepen.io/njmcode/pen/axoyD
function interpolateColor(color1, color2, factor) {
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}
// Convert #ffffff string to [r, g, b] array, source: https://codepen.io/njmcode/pen/axoyD
function h2r(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
  ] : null;
}

// Convert [r, g, b] array to #ffffff string, source: https://codepen.io/njmcode/pen/axoyD
function r2h(rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

// Color palet and steps
// const colors = ['C93434', 'B94848', 'AC6464', 'AC7B7B', '828282', '779183', '5FA881', '25D87F', '39E84D'];
const colors = ['C93434', 'B94848', 'AC6464', 'AC7B7B', '1a253a', '779183', '5FA881', '25D87F', '39E84D'];
const steps = [0, 10, 20, 30, 40, 50, 60, 80, 100];

// Get color for a given value
window.getColor = (value) => {
  // Lower step = Step from steps array that is lower than the current value
  // Upper step = Step from steps array that is higher than the current value
  let lowerStep, upperStep;

  // Find lower and upper step
  for(let step in steps) {
      step = Number(step);
      value = Number(value);

      if (steps[step] <= value) {
          lowerStep = step;
          upperStep = step + 1;
      } else {
          break;
      }
  }

  // Calculate factor using given steps
  let factor = (value - steps[lowerStep]) / (steps[upperStep] - steps[lowerStep]);
  if (isNaN(factor) || factor === Infinity) factor = 1;

  // Get lower and upper color and convert to color array
  let lowerColor = h2r(colors[lowerStep]);
  let upperColor = h2r(colors[upperStep]);

  // Use lower color as upper color is undefined. 
  // This happens when the value if greate or equal to the highest step
  if (!upperColor) upperColor = lowerColor

  // Calculate and convert final color
  let color = r2h(interpolateColor(lowerColor, upperColor, factor));
  return color;
}