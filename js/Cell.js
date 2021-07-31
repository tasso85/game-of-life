(function(root, undefined) {
	/**
	 * Costante che identifica una cella viva.
	 */
	var ALIVE = 1;

	/**
	 * Costante che identifica una cella morta.
	 */
	var DEAD = 0;

	/**
	 * Classe che implementa una cellula.
	 *
	 * @returns {Cell}
	 */
	function Cell() {
		/**
		 * Stato della cellula.
		 * @var {Number}
		 */
		this._status = DEAD;
	}

	/**
	 * Ritorna lo stato della cellula.
	 *
	 * @returns {Number}
	 */
	Cell.prototype.getStatus = function() {
		return this._status;
	};

	/**
	 * Imposta lo stato della cellula.
	 *
	 * @param {Number} status
	 * @returns {Cell}
	 */
	Cell.prototype.setStatus = function(status) {
		if (status !== ALIVE && status !== DEAD) {
			throw new Error("setStatus: Invalid status " + Object.prototype.toString.call(status));
		}

		this._status = status;
		return this;
	};

	/**
	 * Verifica se la cellula è viva.
	 *
	 * @returns {Boolean}
	 */
	Cell.prototype.isAlive = function() {
		return this._status === ALIVE;
	};

	/**
	 * Imposta la cellula come viva.
	 *
	 * @returns {Cell}
	 */
	Cell.prototype.setAlive = function() {
		return this.setStatus(ALIVE);
	};

	/**
	 * Verifica se la cellula è morta.
	 *
	 * @returns {Boolean}
	 */
	Cell.prototype.isDead = function() {
		return !this.isAlive();
	};

	/**
	 * Imposta la cellula come morta.
	 *
	 * @returns {Cell}
	 */
	Cell.prototype.setDead = function() {
		return this.setStatus(DEAD);
	};

	/**
	 * Inverte lo stato della cellula.
	 *
	 * @returns {Cell}
	 */
	Cell.prototype.toggle = function() {
		return this.setStatus(1 - this._status);
	};

	// esporto classe
	Cell.ALIVE = ALIVE;
	Cell.DEAD = DEAD;
	root.Cell = Cell;
})(this);