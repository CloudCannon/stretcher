const stretcherMixin = `// START INJECTED STRETCHER
$stretcher-min: 375px !default;
$stretcher-max: 1440px !default;

@mixin stretcher-double-scale($properties, $min-value, $max-value, $smin, $smax) {
  @each $property in $properties {
    #{$property}: $min-value;
  }

  @media (min-width: $smin) {
    @each $property in $properties {
      #{$property}: calc(#{$min-value} + #{strip-unit($max-value - $min-value)} * (100vw - #{$smin}) / #{strip-unit($smax - $smin)});
    }
  }

  @media (min-width: $smax) {
    @each $property in $properties {
      #{$property}: $max-value;
    }
  }
}

@function strip-unit($number) {
  @if type-of($number) == "number" and not unitless($number) {
    @return $number / ($number * 0 + 1);
  }

  @return $number;
}
// END INJECTED STRETCHER

`;

const quickStretcherRegex = /->/;
const validStretcherRegex = /^(\s*)([a-z-]+):\s*(\d+|\.\d+|\d+\.\d+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|%|vw|vh|vmin|vmax)\s*->\s*(\d+|\.\d+|\d+\.\d+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|%|vw|vh|vmin|vmax)\s*;/;

module.exports = function(fileContents) {
	let webpackWarnings = [];
	let lines = fileContents.split('\n'), matched = false;

	for (let i = 0; i < lines.length; i++) {
		if (!quickStretcherRegex.test(lines[i])) continue;

		const stretcherValues = lines[i].match(validStretcherRegex);
		if (!stretcherValues) {
			webpackWarnings.push(`Line ${i+1} looks like a stretcher line, but doesn't validate`);
			continue;
		}

		let [, indentation, declaration, minVal, minUnit, maxVal, maxUnit] = stretcherValues;
		let warning = '';
		matched = true;

		if (minUnit !== maxUnit) {
			warning += `${indentation}@error "Stretcher mixin units don't match; "${minVal}${minUnit} -> ${maxVal}${maxUnit}": ${minUnit} !== ${maxUnit}";\n`;
		}

		if (/%|vw|vh|vmin|vmax/.test(minUnit)) {
			warning += `${indentation}@warn "Relative units may not work with the scaling mixin (${minUnit})";\n`;
		}

		lines[i] = `${warning}${indentation}@include stretcher-double-scale(${declaration}, ${minVal}${minUnit}, ${maxVal}${maxUnit}, $stretcher-min, $stretcher-max);`;
	}

	if (matched) lines.unshift(stretcherMixin);

	return {
		output: lines.join('\n'),
		warnings: webpackWarnings
	};
}
