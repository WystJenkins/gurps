(function() {
	"use strict";

	function insertCosts() {
		let costs = autoCountCosts();
		checkCostLimit(costs);
		$("#costs-total-footer").text(costs);
	}

	function autoCountCosts() {
		let costFields = $(".cost");
		let costs = 0;

		for (let i = 0; i < costFields.length; i++) {
			let value = costFields[i].value;
			let cost = parseInt(value) || 0;

			costs += cost;
		}

		return costs;
	}

	function checkCostLimit(costs) {
		let limit = parseInt($(".total-gained-points").val());
		let warning = $(".costs-warning");

		if (costs > limit) {
			warning.removeClass("hidden");
		} else {
			warning.addClass("hidden");
		}
	}

	var bridge = {};
	bridge.insertCosts = insertCosts;

	window.CalculateCosts = bridge;
})();
