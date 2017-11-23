///<reference path="_module.ts" />
/*
 * VelocityJS.org (C) 2014-2017 Julian Shapiro.
 *
 * Licensed under the MIT license. See LICENSE file in the project root for details.
 */

QUnit.test("Speed", function(assert) {
	var done = assert.async(5),
		duration = 400,
		defaultSpeed = Velocity.defaults.speed;

	assert.expect(5);
	Velocity.defaults.speed = 3;
	Velocity(getTarget(), defaultProperties, {
		speed: 5,
		begin: function(elements) {
			assert.equal(elements.velocity.animations[0].options.speed, 5, "Speed on options overrides default.")
			done();
		}
	});
	Velocity(getTarget(), defaultProperties, {
		duration: duration,
		begin: function(elements) {
			elements.__start = getNow();
		},
		complete: function(elements) {
			let actual = getNow() - elements.__start,
				expected = duration / 3;

			assert.close(actual, expected, 32, "Velocity.defaults.speed change is respected. (\xD73, " + Math.floor(actual - expected) + "ms \xB132ms)");
			Velocity.defaults.speed = defaultSpeed;
			done();
		}
	});
	Velocity(getTarget(), defaultProperties, {
		duration: duration,
		speed: 2,
		begin: function(elements) {
			elements.__start = getNow();
		},
		complete: function(elements) {
			let actual = getNow() - elements.__start,
				expected = duration / 2;

			assert.close(actual, expected, 32, "Double speed animation lasts half as long. (\xD72, " + Math.floor(actual - expected) + "ms \xB132ms)");
			done();
		}
	});
	Velocity(getTarget(), defaultProperties, {
		duration: duration,
		speed: 0.5,
		begin: function(elements) {
			elements.__start = getNow();
		},
		complete: function(elements) {
			let actual = getNow() - elements.__start,
				expected = duration * 2;

			// TODO: Really not happy with the allowed range - it sits around 40ms, but should be closer to 16ms
			assert.close(actual, expected, 64, "Half speed animation lasts twice as long. (\xD7\xBD, " + Math.floor(actual - expected) + "ms \xB164ms)");
			done();
		}
	});
	Velocity(getTarget(), defaultProperties, {
		duration: duration,
		speed: 0,
		progress: function(elements, percentComplete) {
			if (!elements.__count) {
				elements.__start = percentComplete;
				elements.__count = 1;
			} else {
				assert.equal(elements.__start, percentComplete, "Frozen (speed:0) animation doesn't progress.");
				elements
					.velocity("option", "speed", 1) // Just in case "stop" is broken
					.velocity("stop");
				done();
			}
		}
	});
});
