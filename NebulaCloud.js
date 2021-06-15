const
	NEBULA = {
		size: 50,
		height: 450,
		bufferZone: 50
	},
	BALLS = {
		ballColor: {
			r: 255,
			g: 255,
			b: 255,
		},
		ballRadius: 1.5,
		minVelocity: -1,
		maxVelocity: 1
	},
	LINKS = {
		linkColor: {
			r: 255,
			g: 255,
			b: 255,
		},
		linkWidth: 0.5,
		linkMaxDistance: 250
	};

let canvas,
	canvas_w,
	canvas_h,
	canvasContext,
	nebula = [],
	mouseBall = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		r: 0,
		type: "mouse",
	};

/**
 * @function getRandomNumberBetween
 * Generate a random number between two other numbers
 * @param {integer} min the lower bound of the number range
 * @param {integer} max the uppse bound of the number range
 * @returns {integer} a random integer between the two params
 */
function getRandomNumberBetween(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * @function getPointDistance
 * get the distance between two given 2d points
 * @param {nebulaBall} point_1 first 2d point
 * @param {nebulaBall} point_2 second 2d point
 * @returns {float} distance between two points - yay pythagoras
 */
function getPointDistance(point_1, point_2) {
	let Dx = Math.abs(point_1.x - point_2.x),
		Dy = Math.abs(point_1.y - point_2.y);

	return Math.sqrt((Dx * Dx) + (Dy * Dy));
}

/**
 * @function getRandomVelocity
 * get a (restricted) random velocity for a newly generated ball
 * restricted in that the velocty must make sense for the ball's initial position
 * @example a ball at the top of the canvas must have a velocity towards the bottom of the screen
 * @example a ball at the left of the canvas must have a velocity twoards the right of the screen
 * @param {string} initialPosition the ball's initial position on geneation
 * @returns {array[float]} an aray of two floats for the ball's velocity, X and Y
 */
function getRandomVelocity(initialPosition) {
	switch (initialPosition) {
		case "top":
			return [getRandomNumberBetween(BALLS.minVelocity, BALLS.maxVelocity), getRandomNumberBetween(0.1, BALLS.maxVelocity)];
		case "right":
			return [getRandomNumberBetween(BALLS.minVelocity, -0.1), getRandomNumberBetween(BALLS.minVelocity, BALLS.maxVelocity)];
		case "bottom":
			return [getRandomNumberBetween(BALLS.minVelocity, BALLS.maxVelocity), getRandomNumberBetween(BALLS.minVelocity, -0.1)];
		case "left":
		default:
			return [getRandomNumberBetween(0.1, BALLS.maxVelocity), getRandomNumberBetween(BALLS.minVelocity, BALLS.maxVelocity)];
	}
}

/**
 * @function generateBall
 * creates a ball at a random point on the edge of the canvas with random velocity
 * @returns {nebulaBall} a new nebulaBall
 */
function generateBall() {
	// Side numbers are clockwise from top, 0 through to 3
	//   1
	// 3   2
	//   4
	let side = Math.floor(getRandomNumberBetween(0, 4)),
		ball = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			r: BALLS.ballRadius,
			alpha: 1
		};

	switch (side) {
		case 0:
			Object.assign(ball, {
				x: getRandomNumberBetween(0, canvas_w),
				y: -BALLS.ballRadius,
				vx: getRandomVelocity("top")[0],
				vy: getRandomVelocity("top")[1]
			});
			break;

		case 1:
			Object.assign(ball, {
				x: canvas_w + BALLS.ballRadius,
				y: getRandomNumberBetween(0, canvas_h),
				vx: getRandomVelocity("right")[0],
				vy: getRandomVelocity("right")[1]
			});
			break;

		case 2:
			Object.assign(ball, {
				x: getRandomNumberBetween(0, canvas_w),
				y: canvas_h + BALLS.ballRadius,
				vx: getRandomVelocity("bottom")[0],
				vy: getRandomVelocity("bottom")[1]
			});
			break;

		case 3:
		default:
			Object.assign(ball, {
				x: -BALLS.ballRadius,
				y: getRandomNumberBetween(0, canvas_h),
				vx: getRandomVelocity("left")[0],
				vy: getRandomVelocity("left")[1]
			});
			break;
	};

	return ball;
}

/**
 * @function renderNebula
 * renders each ball in the nebula to the canvas
 */
function renderNebula() {
	Array.prototype.forEach.call(nebula, function(ball) {
		if (!ball.hasOwnProperty("type")) {
			canvasContext.fillStyle =`rgba(${BALLS.ballColor.r}, ${BALLS.ballColor.g}, ${BALLS.ballColor.b}, ${ball.alpha})`;

			canvasContext.beginPath();
			canvasContext.arc(ball.x, ball.y, BALLS.ballRadius, 0, Math.PI * 2, true);
			canvasContext.closePath();
			canvasContext.fill();
		}
	});
}

/**
 * @function updateNebula
 * update the nebula, move each ball and clean / add as needed
 */
function updateNebula() {
	let _nebula = [];

	Array.prototype.forEach.call(nebula, function(ball) {
		ball.x += ball.vx;
		ball.y += ball.vy;

		if (
			ball.x > -NEBULA.bufferZone
			&& ball.x < canvas_w + NEBULA.bufferZone
			&& ball.y > -NEBULA.bufferZone
			&& ball.y < canvas_h + NEBULA.bufferZone
		) {
			_nebula.push(ball);
		}
	});

	nebula = _nebula.slice(0);
}

/**
 * @function renderLinks
 * render the links between each ball in the nebula
 */
function renderLinks() {
	let distance,
		alpha;

	// easier than a for of in this case
	for (let i = 0; i < nebula.length; i++) {
		for (let j = i + 1; j < nebula.length; j++) {
			distance = getPointDistance(nebula[i], nebula[j]);

			// If the balls are close enough together, draw line with alpha proportional to proximity
			if (distance <= LINKS.linkMaxDistance) {
				alpha = (1 - (distance / LINKS.linkMaxDistance)).toString();

				canvasContext.strokeStyle = `rgba(${LINKS.linkColor.r},${LINKS.linkColor.g},${LINKS.linkColor.b},${alpha})`;
				canvasContext.lineWidth = LINKS.linkWidth;

				canvasContext.beginPath();
				canvasContext.moveTo(nebula[i].x, nebula[i].y);
				canvasContext.lineTo(nebula[j].x, nebula[j].y);
				canvasContext.stroke();
				canvasContext.closePath();
			}
		}
	}
}

/**
 * @function populateNebula
 * populate the nebula array with balls
 */
function populateNebula() {
	if (nebula.length < NEBULA.size) {
		nebula.push(generateBall());
	}
}

/**
 * @function mainLoop
 * main acitivty loop, for updating, rendering and other such useful things
 * @param {integer} numBalls the number of balls to create
 */
function mainLoop() {
	canvasContext.clearRect(0, 0, canvas_w, canvas_h);

	renderNebula();
	renderLinks();
	updateNebula();
	populateNebula();

	window.requestAnimationFrame(mainLoop);
}

/**
 * @function initListeners
 * setup the listeners for page resize and mouse interactivity
 */
function initListeners(canvas) {

	window.addEventListener("resize", function(e) {
		initCanvas();
	});

	canvas.addEventListener("mouseenter", function() {
		nebula.push(mouseBall);
	});

	canvas.addEventListener("mouseleave", function() {
		let _nebula = [];

		Array.prototype.forEach.call(nebula, function(b) {
			if (!b.hasOwnProperty("type")) {
				_nebula.push(b);
			}
		});

		nebula = _nebula.slice(0);
	});

	canvas.addEventListener("mousemove", function(e) {
		let elRect = e.target.getBoundingClientRect();

		mouseBall.x = e.clientX - elRect.left;
		mouseBall.y = e.clientY - elRect.top;
	});
}

/**
 * @function initCanvas
 * set the canvas size based on available space
 * TODO: this needs to be smarte, particularly generating dimensions
 */
function initCanvas() {
	canvas.setAttribute("width", canvas.parentElement.clientWidth);
	canvas.setAttribute("height", NEBULA.HEIGHT);

	canvas_w = parseInt(canvas.getAttribute("width"));
	canvas_h = parseInt(canvas.getAttribute("height"));
}

/**
 * @function init
 * Initialise code
 */
export default function init() {
	canvas = document.getElementById("canvasNebula");
	canvasContext = canvas.getContext("2d");

	initCanvas();
	populateNebula();
	initListeners(canvas);
	window.requestAnimationFrame(mainLoop);
}
