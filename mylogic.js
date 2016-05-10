$(function() {
	var maxRows = 4;
	var initLeft = 0;

	//animates the 1s going down the sides
	var sideAni = function(i, j, left) {
		var origi = i;
		var origj = j;
		for (i; i <= maxRows; i++) {
			if (i < maxRows) {
				TweenMax.to('.hex' + i + '-' + (left ? j : j++), 1, {
					top: 98 * (origi - 1) - 8 * (origi - 2),
					left: initLeft + (left ? -1 : 1) * 52 * (origi - 1),
					ease: Linear.easeInOut
				});
			}
			else { //put the oncomplete function on the last one in the group
				TweenMax.to('.hex' + i + '-' + j, 1, {
					top: 98 * (origi - 1) - 8 * (origi - 2),
					left: initLeft + (left ? -1 : 1) * 52 * (origi - 1),
					ease: Linear.easeInOut,
					onComplete: function() {
						sideAni(++origi, left ? j : ++origj, left);
					}
				});
			}
		}
		//once the col is greater than the max amount of row, animate the middle hexes UNLESS there are less than 3 rows
		if (j > maxRows && maxRows > 2) {
			comboAni(3, 2);
		}
	};

	//creates two green hexes to move from the parents to the new child hex
	var comboAni = function(i, j) {
		var prevRow = i - 1;
		var prevCol = j - 1;
		var top = 98 * (i - 1) - 8 * (i - 2);
		var left = initLeft - 52 * (i - 1) + 104 * (j - 1);
		var div1 = $('.hex' + prevRow + '-' + prevCol).clone().removeClass('hexblue').addClass('hexgreen').appendTo('.part2');
		var div2 = $('.hex' + prevRow + '-' + j).clone().removeClass('hexblue').addClass('hexgreen').appendTo('.part2');
		TweenMax.to('.hexgreen', 1, {
			top: top,
			left: left,
			ease: Linear.easeInOut,
			delay: .5,
			onComplete: function() { fadeInOut(i, j, top, left); }
		});
	};

	//fades out the green hexes and removes on complete; changes the new child from red to blue; calls next animation if not at the end
	var fadeInOut = function(i, j, x, y) {
		TweenMax.to('.hexgreen', 1, {
			alpha: 0,
			onComplete: function() {
				$('.hexgreen').remove();
				TweenMax.delayedCall(.5, function(i, j) {
					$('.hex' + i + '-' + j).removeClass('hexred').addClass('hexblue');
					if (++j === i) {
						i++;
						j = 2;
					}
					if (i <= maxRows) {
						comboAni(i, j);
					}
				}, [i, j]);
			}
		});
		TweenMax.to('.hex' + i + '-' + j, 0, {
			top: x,
			left: y
		});
	};

	//creates a new hex on the fly dependent on the number of rows
	var createNewHex = function(i, j) {
		if (j === 1 || j === i) {
			if (i === 1 && j === 1){
				$('.part2').append('<div class="hex hex' + i + '-' + j + ' hexblue hextop"><span>1</span></div>');
			}
			else {
				$('.part2').append('<div class="hex hex' + i + '-' + j + ' hexblue"><span>1</span></div>');
			}
		}
		else {
			$('.part2').append('<div class="hex hex' + i + '-' + j + ' hexred"><span>' + getNum(i, j) + '</span></div>');
		}
	};

	//recursive function that generates the value
	var getNum = function(i, j) {
		if (j === 1 || j === i)
			return 1;
		else
			return getNum(i - 1, j - 1) + getNum(i - 1, j);
	};

	var init = function() {
		maxRows = $('#numOfRows').val();
		console.log(maxRows);
		if (maxRows > 0) { //optional max of 10 rows -> && maxRows < 11
			$('.part1, .part2').toggleClass('hidden');
			//creates a new hex starting at 1-1
			for (var i = 1; i <= maxRows; i++) {
				for (var j = 1; j <= i; j++) {
					createNewHex(i, j);
				}
			}

			//grabs the initial left position of the first hex on page load to determine the position of the other elements; if screen resized, will mess up positions
			initLeft = $('.hex1-1').position().left;
			sideAni(2, 1, true);
			sideAni(2, 2, false);
		}
	};

	$('.my-submit-btn').click(init);
});