///<reference path="actions.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 *
 * Get or set a property from one or more elements.
 */

namespace VelocityStatic {

	/**
	 * Expose a style shortcut - can't be used with chaining, but might be of
	 * use to people.
	 */
	export function tween(elements: HTMLorSVGElement[], percentComplete: number, properties: VelocityProperties, easing?: VelocityEasingType);
	export function tween(elements: HTMLorSVGElement[], percentComplete: number, propertyName: string, property: VelocityProperty, easing?: VelocityEasingType);
	export function tween(elements: HTMLorSVGElement[], percentComplete: number, properties: VelocityProperties | string, property?: VelocityProperty | VelocityEasingType, easing?: VelocityEasingType) {
		return tweenAction(arguments as any, elements);
	}

	/**
	 * 
	 */
	function tweenAction(args?: any[], elements?: HTMLorSVGElement[], promiseHandler?: VelocityPromise, action?: string): any {
		if (!elements) {
			if (!args.length) {
				console.info("Velocity(<element>, \"tween\", percentComplete, property, end | [end, <easing>, <start>], <easing>) => value\n"
					+ "Velocity(<element>, \"tween\", percentComplete, {property: end | [end, <easing>, <start>], ...}, <easing>) => {property: value, ...}");
				return null;
			}
			elements = [document.body];
		} else if (elements.length !== 1) {
			console.warn("VelocityJS: Cannot tween more than one element!");
			return null;
		}
		let percentComplete: number = args[0],
			properties: VelocityProperties = args[1],
			singleResult: boolean,
			easing: VelocityEasingType = args[2],
			fakeAnimation = {
				elements: elements,
				element: elements[0],
				queue: false,
				options: {
					duration: 1000
				},
				tweens: null as {[property: string]: VelocityTween}
			},
			result: {[property: string]: string} = {},
			count = 0;

		if (isString(args[1])) {
			singleResult = true;
			properties = {
				[args[1]]: args[2]
			};
		}
		if (!isNumber(percentComplete) || percentComplete < 0 || percentComplete > 1) {
			console.warn("VelocityJS: Must tween a percentage from 0 to 1!");
			return null;
		}
		if (!isPlainObject(properties)) {
			console.warn("VelocityJS: Cannot tween an invalid property!");
			return null;
		}
		let activeEasing = validateEasing(getValue(easing, defaults.easing), 1000);

		expandProperties(fakeAnimation as AnimationCall, properties);
		for (let property in fakeAnimation.tweens) {
			// For every element, iterate through each property.
			let tween = fakeAnimation.tweens[property],
				easing = tween[Tween.EASING] || activeEasing,
				pattern = tween[Tween.PATTERN],
				rounding = tween[Tween.ROUNDING],
				currentValue = "",
				i = 0;

			count++;
			if (pattern) {
				for (; i < pattern.length; i++) {
					let startValue = tween[Tween.START][i];

					if (startValue == null) {
						currentValue += pattern[i];
					} else {
						let result = easing(percentComplete, startValue as number, tween[Tween.END][i] as number, property)

						currentValue += rounding && rounding[i] ? Math.round(result) : result;
					}
				}
			}
			result[property] = currentValue;
		}
		if (singleResult && count === 1) {
			for (let property in result) {
				if (result.hasOwnProperty(property)) {
					return result[property];
				}
			}
		}
		return result;
	}

	registerAction(["tween", tweenAction], true);
}
