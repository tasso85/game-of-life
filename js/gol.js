(function($, undefined) {
	let boardStatus = [];
	let boardSize = 10;
	let cellSize  = 20;
	let connectedBorders = false;

	let running = 0;
	let refreshInterval = 1000;
	let generation = 0;

	const STATUS_ALIVE = 1;
	const STATUS_DEAD  = 0;

	const STATUS_RUNNING = 1;
	const STATUS_STOPPED = 0;

	const MAX_BOARD_SIZE = 150;

	/**
	 * Seleziona una cella dalle sue coordinate.
	 *
	 * @param {int} x
	 * @param {int} y
	 * @returns {jQuery}
	 */
	function getCell(x, y) {
		return $(`#cell_${x}_${y}`);
	}

	/**
	 * Cambia lo stato della cellula.
	 *
	 * @param {jQuery} cell
	 * @param {int} newStatus
	 * @returns {int}
	 */
	function setCell(cell, newStatus) {
		cell.toggleClass("alive", newStatus === STATUS_ALIVE)
			.toggleClass("dead", newStatus === STATUS_DEAD)
			.data("status", newStatus);
		return newStatus;
	}

	/**
	 * Verifica se la coordinata indicata rientra nella griglia e, se configurato come bordi connessi, la corregge
	 * per rientrare nella griglia.
	 *
	 * @param {int} coord
	 * @returns {int|null}
	 */
	function checkBoundary(coord) {
		if (coord < 0 || coord >= boardSize) {
			if (!connectedBorders) {
				return null;
			}

			return (coord + boardSize) % boardSize;
		}

		return coord;
	}

	/**
	 * Aggiorna lo stato di una cellula in base a quello delle cellule immediatamente adiacenti.
	 *
	 * @param {jQuery} cell
	 * @returns {int}
	 */
	function updateCell(cell) {
		const data = cell.data();

		let aliveNeighborCount = 0;
		for (let x = data.x - 1; x <= data.x + 1; ++x) {
			let boundX = checkBoundary(x);
			if (boundX === null) {
				continue;
			}

			for (let y = data.y - 1; y <= data.y + 1; ++y) {
				if (x === data.x && y === data.y) {
					continue;
				}

				let boundY = checkBoundary(y);
				if (boundY === null) {
					continue;
				}

				aliveNeighborCount += (boardStatus[boundX][boundY] === STATUS_ALIVE);
			}
		}

		switch (aliveNeighborCount) {
			case 2:
				return data.status;

			case 3:
				return setCell(cell, STATUS_ALIVE);

			// tutte le altre possibilità: 0, 1, 4, 5, 6, 7, 8
			default:
				return setCell(cell, STATUS_DEAD);
		}
	}

	/**
	 * Aggiorna lo status del gioco della vita.
	 *
	 * @return void
	 */
	function updateBoard() {
		if (running) {
			let newStatus = [];
			for (let x = 0; x < boardSize; ++x) {
				newStatus[x] = [];
				for (let y = 0; y < boardSize; ++y) {
					newStatus[x][y] = updateCell(getCell(x, y));
				}
			}

			$("#generation").text(++generation);
			boardStatus = newStatus;
		}
	}

	/**
	 * Inizializza il gioco.
	 *
	 * @return void
	 */
	function initBoard() {
		let board = $("#board").empty().css({
			"width"  : (boardSize * (cellSize + 2)) + "px",
			"height" : (boardSize * (cellSize + 2)) + "px"
		});

		boardStatus = [];
		for (let x = 0; x < boardSize; x++) {
			boardStatus[x] = [];
			let row = $(`<div class="row"></div>`);

			for (let y = 0; y < boardSize; y++) {
				row.append(
					$(`<div class="cell dead"></div>`)
						.attr("id", `cell_${x}_${y}`)
						.data({x, y, status: boardStatus[x][y] = STATUS_DEAD})
				);
			}

			board.append(row);
		}

		$("#generation").text(generation = 0);
		$("div.cell").css({
			"width"  : cellSize + "px",
			"height" : cellSize + "px"
		});
	}

	/**
	 * Ressetta il gioco.
	 *
	 * @return void
	 */
	function resetBoard() {
		if (running) {
			toggleGame(STATUS_STOPPED);
		}

		initBoard();
	}

	/**
	 * Aggiorna lo stato del gioco.
	 *
	 * @param {int} newStatus
	 */
	function toggleGame(newStatus) {
		$("#speed, #size, #linked").prop("disabled", newStatus);

		let newText;
		if (newStatus) {
			running = setInterval(updateBoard, refreshInterval);
			newText = "STOP";
		}
		else {
			clearInterval(running);
			running = 0;
			newText = "START";
		}

		$("#toggle").text(newText);
	}

	$(function() {
		$("#speed").on("change", function() {
			refreshInterval = parseInt($(this).val());
		}).val(refreshInterval);

		$("#linked").on("change", function() {
			connectedBorders = $(this).val() === "1";
		});

		let options = [];
		for (let i = 5; i <= MAX_BOARD_SIZE; i += 5) {
			options.push(`<option value="${i}">${i} x ${i}</option>`);
		}

		$("#size").empty().on("change", function() {
			boardSize = parseInt($(this).val());

			if (boardSize <= 25) {
				cellSize = 20;
			}
			else if (boardSize <= 50) {
				cellSize = 15;
			}
			else if (boardSize <= 100) {
				cellSize = 10;
			}
			else {
				cellSize = 5;
			}

			initBoard();
		}).append(options.join("")).val(boardSize);

		$("#reset").on("click", resetBoard);
		$("#toggle").on("click", function () {
			toggleGame(running ? STATUS_STOPPED : STATUS_RUNNING);
		});

		$(document).on("click", "div.cell", function() {
			if (!running) {
				const cell = $(this), data = cell.data();
				boardStatus[data.x][data.y] = setCell(cell, data.status === STATUS_ALIVE ? STATUS_DEAD : STATUS_ALIVE);
			}

			return false;
		});

		initBoard();
	});
})(jQuery);