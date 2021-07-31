(function($, undefined) {
	var boardStatus = [];
	var newStatus = [];

	var BOARD_SIZE = 10;
	var CELL_SIZE = 20;

	var running = 0;
	var refresh = 1000;
	var generation = 0;

	var cell = "<div class='cell dead'></div>";

	/**
	 * Cambia lo stato della cellula
	 * @param {object} cell
	 * @param {int} newStatus
	 * @access public
	 * @return void
	 **/
	function toggleCell(cell, newStatus) {
		if (newStatus == 1) {
			cell.attr("class", "cell alive");
		}
		else {
			cell.attr("class", "cell dead");
		}

		return newStatus;
	}

	/**
	 * Aggiorna lo stato di una cellula in base a quello delle cellule immediatamente adiacenti.
	 * @param {object} cell
	 * @access public
	 * @return void
	 **/
	function updateCell(cell) {
		var x = cell.attr("id").split("_");
		var y = x[1] * 1;
		x = x[0] * 1;

		var neighbor = 0;

		for (var i = x - 1; i <= x + 1; i++) {
			if (i < 0 || i >= BOARD_SIZE) {
				continue;
			}

			for (var j = y - 1; j <= y + 1; j++) {
				if (j < 0 || j >= BOARD_SIZE || (i == x && j == y)) {
					continue;
				}

				neighbor += boardStatus[i][j];
			}
		}

		switch (neighbor) {
			case 0:
			case 1:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
				newStatus[x][y] = toggleCell(cell, 0);
				break;

			case 2:
				newStatus[x][y] = toggleCell(cell, boardStatus[x][y]);
				break;

			case 3:
				newStatus[x][y] = toggleCell(cell, 1);
				break;
		}
	}

	/**
	 * Aggiorna lo status del gioco della vita.
	 * @access public
	 * @return void
	 **/
	function updateBoard() {
		if (running) {
			newStatus = [];
			for (var i = 0; i < BOARD_SIZE; i++) {
				newStatus[i] = [];
				for (var j = 0; j < BOARD_SIZE; j++) {
					newStatus[i][j] = 0;
					updateCell($("#" + i + "_" + j));
				}
			}

			$("#generation").text(++generation);
			boardStatus = newStatus.slice(0);
		}
	}

	/**
	 * Inizializza il gioco
	 * @access public
	 * @return void
	 **/
	function initBoard() {
		var board = $("#board").html("").css({
			"width" : (BOARD_SIZE * (CELL_SIZE + 2))+"px",
			"height" : (BOARD_SIZE * (CELL_SIZE + 2))+"px"
		});

		boardStatus = [];
		for (var x = 0; x < BOARD_SIZE; x++) {
			boardStatus[x] = [];
			for (var y = 0; y < BOARD_SIZE; y++) {
				boardStatus[x][y] = 0;
				board.append($(cell).attr("id", x + "_" + y));
			}
		}

		$(".cell").css({
			"width" : CELL_SIZE + "px",
			"height" : CELL_SIZE + "px"
		});

		$("#generation").text(generation = 0);
	}

	/**
	 * Ressetta il gioco
	 * @access public
	 * @return void
	 **/
	function resetBoard() {
		if (running) {
			$("#startStop").click();
		}

		boardStatus = [];
		for (var i = 0; i < BOARD_SIZE; i++) {
			boardStatus[i] = [];
			for (var j = 0; j < BOARD_SIZE; j++) {
				boardStatus[i][j] = toggleCell($("#" + i + "_" + j), 0);
			}
		}

		$("#generation").text(generation = 0);
	}

	$(function() {
		$("#speed").change(function() {
			refresh = $(this).val() * 1;
		}).val(refresh);

		var options = "";
		for (var i = 5; i <= 100; i += 5) {
			options += "<option value='" + i + "'>" + i + " x " + i + "</option>";
		}

		$("#size").html("").change(function() {
			BOARD_SIZE = $(this).val() * 1;

			switch (BOARD_SIZE) {
				case 5:
				case 10:
				case 15:
				case 20:
				case 25:
					CELL_SIZE = 20;
					break;

				case 30:
				case 35:
				case 40:
				case 45:
				case 50:
					CELL_SIZE = 15;
					break;

				default:
					CELL_SIZE = 10;
					break;
			}

			initBoard();
		}).append(options).val(BOARD_SIZE);

		var startStop = $("#startStop");

		function start() {
			$("#speed, #size").attr("disabled", "disabled");
			running = setInterval(updateBoard, refresh);
			$(this).text("STOP !").click(stop);
		}

		function stop() {
			$("#speed, #size").removeAttr("disabled");
			clearInterval(running);
			running = 0;
			$(this).text("START !").click(start);
		}

		startStop.click(start);
		$("#reset").click(resetBoard);

		$(document).on("click", ".cell", function() {
			if (!running) {
				var t = $(this);
				var x = t.attr("id").split("_");
				var y = x[1] * 1;
				x = x[0] * 1;

				boardStatus[x][y] = toggleCell(t, Math.abs(boardStatus[x][y]-1));
			}

			return false;
		});

		initBoard();
	});
})(jQuery);