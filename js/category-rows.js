(function() {
	"use strict";

	function addAttrRows() {
		const ATTR_NAMES = ["Strength", "Dexterity", "IQ", "Health"];
		const ATTR_ABBR = ["st", "dx", "iq", "ht"];

		let box = $("#attr-rows-container");

		for (let i = 0; i < ATTR_NAMES.length; i++) {
			let name = ATTR_NAMES[i];
			let template = $($("#attr-template").html());

			template.attr("id", `attr-type-${ATTR_ABBR[i]}`);
			template.data("position", i);
			template.find(".name").text(name);

			setRowListeners(template);

			box.append(template);
		}

		setRecalculateCostsListener();
	}

	function addAttr2Rows() {
		const ATTR2_NAMES = ["Hit Points", "Will", "Perception", "Fatigue Points", "Basic Speed", "Basic Move", "Dodge", "Basic Lift"];
		const ATTR2_FORMULAS = ["HP = ST", "Will = IQ", "Per = IQ", "FP = HT", "(HT+DX)/4", "Move = Speed", "Speed+3", "(ST*ST)/5"];
		const ATTR2_ABBR = ["hp", "will", "per", "fp", "bs", "bm", "dg", "bl"];

		let box = $("#attr2-rows-container");

		for (let i = 0; i < ATTR2_NAMES.length; i++) {
			let name = ATTR2_NAMES[i];
			let formula = ATTR2_FORMULAS[i];
			let template = $($("#attr2-template").html());

			template.attr("id", `attr-type-${ATTR2_ABBR[i]}`);
			template.data({
				position: i,
				abbr: ATTR2_ABBR[i]
			});
			template.find(".name").text(name);
			template.find(".formula").text(formula);

			setRowListeners(template);

			box.append(template);
		}
	}

	function addDamageRows() {
		const DAMAGE_NAME = ["Thrust", "Swing"];
		const DAMAGE_VALUE = ["1d-2", "1d"];

		let box = $("#damage-rows-container");

		for (let i = 0; i < DAMAGE_NAME.length; i++) {
			let name = DAMAGE_NAME[i];
			let value = DAMAGE_VALUE[i];
			let template = $($("#damage-template").html());

			template.find(".name").text(name);
			template.find(".level")
				.val(value)
				.attr("id", `damage-value${i}`);

			box.append(template);
		}
	}

	function addTraitHeadline(trait) {
		let box = $(`#${trait}-headline-container`);
		let template = $($("#trait-headline-template").html());

		box.append(template);
	}

	function addTraitRow(trait) {
		let box = $(`#${trait}-rows-container`);
		let template = $($(`#${trait}-template`).html());
		let counter = box.children().length;

		template.attr("id", `${trait}-row${counter}`);

		setRowListeners(template);

		box.append(template);
	}

	function setRowListeners(row) {
		row.find(".level")
			.on("input", AutoFiller.fillInCosts)
			.on("input", AutoFiller.fillInSecondaryStats)
			.on("input", CalculateCosts.insertCosts);

		row.find(".cost")
			.on("input", CalculateCosts.insertCosts);

		row.find(".skill-type, .skill-difficulty, .spell-skill")
			.on("change", AutoFiller.fillInCosts);

		row.find(".toggle-note-button")
			.on("click", toggleNote);
	}

	function setRecalculateCostsListener() {
		$(".attr-level, #magical-aptitude-lvl")
			.on("input", recalculateAll);
	}

	function recalculateAll() {
		let rows = $(".skill-row, .spell-row");

		for (let i = 0; i < rows.length; i++) {
			AutoFiller.recalculateCosts($(rows[i]));
		}

		CalculateCosts.insertCosts();
	}

	function toggleNote() {
		let row = $(this.parentElement);
		let note = row.find(".note");
		let buttonText = note.hasClass("hidden") ? "‒" : "+";

		note.toggleClass("hidden");
		$(this).text(buttonText);
	}

	var bridge = {};
	bridge.addAttrRows = addAttrRows;
	bridge.addAttr2Rows = addAttr2Rows;
	bridge.addDamageRows = addDamageRows;
	bridge.addTraitHeadline = addTraitHeadline;
	bridge.addTraitRow = addTraitRow;

	window.AddRows = bridge;
})();
