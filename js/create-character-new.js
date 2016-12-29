(function() {
	"use strict";

	const TRAITS = ["adv", "perk", "disadv", "quirk", "skill", "spell", "equipment"];

	var body = $("body");

	function initPage() {
		initButtons();
		initInputRows();
		setListeners();
	}

	function initButtons() {
		for (let i = 0; i < TRAITS.length; i++) {
			let trait = TRAITS[i];
			let buttonBox = $($("#button-template").html());
			let container = body.find(`#${trait}-button-container`);

			buttonBox.find("button.minus").attr({
				"data-trait": trait
			});

			buttonBox.find("button.plus").attr("data-trait", trait);

			container.append(buttonBox);
		}
	}

	function initInputRows() {
		addAttrRows();
		addAttr2Rows();
		addDamageRows();

		for (let i = 0; i < TRAITS.length; i++) {
			let trait = TRAITS[i];

			addTraitHeadline(trait);
			addTraitRow(trait);
		}
	}

	function addAttrRows() {
		const ATTR_NAMES = ["Strength", "Dexterity", "IQ", "Health"];
		const ATTR_ABBR = ["st", "dx", "iq", "ht"];

		let box = body.find("#attr-rows-container");

		for (let i = 0; i < ATTR_NAMES.length; i++) {
			let name = ATTR_NAMES[i];
			let template = $($("#attr-template").html());

			template.attr("id", `attr-type-${ATTR_ABBR[i]}`);
			template.data("position", i);
			template.find(".name").text(name);

			setRowListeners(template);

			box.append(template);
		}

		setAttrListener();
	}

	function addAttr2Rows() {
		const ATTR2_NAMES = ["Hit Points", "Will", "Perception", "Fatigue Points", "Basic Speed", "Basic Move", "Dodge", "Basic Lift"];
		const ATTR2_FORMULAS = ["HP = ST", "Will = IQ", "Per = IQ", "FP = HT", "(HT+DX)/4", "Move = Speed", "Speed+3", "(ST*ST)/5"];
		const ATTR2_ABBR = ["hp", "will", "per", "fp", "bs", "bm", "dg", "bl"];

		let box = body.find("#attr2-rows-container");

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

		let box = body.find("#damage-rows-container");

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
		let box = body.find(`#${trait}-headline-container`);
		let template = $($("#trait-headline-template").html());

		box.append(template);
	}

	function addTraitRow(trait) {
		let box = body.find(`#${trait}-rows-container`);
		let template = $($(`#${trait}-template`).html());
		let counter = box.children().length;

		template.attr("id", `${trait}-row${counter}`);

		setRowListeners(template);

		box.append(template);
	}


	function setListeners() {
		setAddRemoveButtons();
		setLocalStorageButtons();
		setSaveLoadFileButtons();
	}

	function setCostAutoCount() {
		body.find(".cost").on("input", insertCosts);
	}

	function autoCountCosts() {
		let costFields = body.find(".cost");
		let costs = 0;

		for (let i = 0; i < costFields.length; i++) {
			let value = costFields[i].value;
			let cost = parseInt(value) || 0;

			costs += cost;
		}

		return costs;
	}

	function insertCosts() {
		let costs = autoCountCosts();
		body.find("#costs-total-footer").text(costs);
	}

	function setAddRemoveButtons() {
		body.find(".plus").click(addRow);
		body.find(".minus").click(removeRow);
	}

	function addRow() {
		let trait = $(this).data().trait;
		addTraitRow(trait);
	}

	function removeRow() {
		let trait = $(this).data().trait;
		let box = body.find(`#${trait}-rows-container`);

		if (box.children().length <= 1) {
			return;
		}

		box.children().last().remove();
	}

	function setRowListeners(row) {
		row.find(".level")
			.on("input", AutoFiller.fillInCosts)
			.on("input", AutoFiller.fillInSecondaryStats)
			.on("input", insertCosts);

		row.find(".cost")
			.on("input", insertCosts);

		row.find(".skill-type, .skill-difficulty, .spell-skill")
			.on("change", AutoFiller.fillInCosts);

		row.find(".toggle-note-button")
			.on("click", toggleNote);
	}

	function toggleNote() {
		let row = $(this.parentElement);
		let note = row.find(".note");

		note.toggleClass("hidden");
	}

	function setAttrListener() {
		body.find(".attr-level")
			.on("input", recalculateAll);
	}

	function recalculateAll() {
		let rows = body.find(".skill-row, .spell-row");

		for (let i = 0; i < rows.length; i++) {
			AutoFiller.recalculateCosts($(rows[i]));
		}

		insertCosts();
	}

	function setLocalStorageButtons() {
		/*
		$("#save-button").click(() => {
			saveAll();
			swal("Data saved!", "Your character's data was saved to the browser's local storage. To load your data, just click the 'Load Character Data' button. Caution: This will only work in the same browser, where you saved the data!", "success");
		});

		// get-my-data-button for localStorage
		$("#get-data-button").click(getAndInsertAll);

		// delete all localStorage Data
		$("#delete-data-button").click(deleteAll);
		*/
	}

	function setSaveLoadFileButtons() {
		/*
		//save and load data as text file
		$("#save-file-as-text").click(() => {
			saveTextAsFile();
		});
		$("#load-file-as-text").click(() => {
			loadFileAsText();
		});
		*/
	}

	window.initPage = initPage;
})();

$(document).ready(initPage);

/*
// Define Variables
var levels = {};
levels.st = undefined;
levels.dx = undefined;
levels.iq = undefined;
levels.ht = undefined;
levels.hp = undefined;
levels.will = undefined;
levels.per = undefined;
levels.fp = undefined;
levels.bs = undefined;
levels.bm = undefined;
levels.dg = undefined;
levels.bl = undefined;

var fieldnr = {};
fieldnr.attr = 4;
fieldnr.attr2 = 10;
fieldnr.adv = 1;
fieldnr.perk = 1;
fieldnr.disadv = 1;
fieldnr.quirk = 1;
fieldnr.skill = 1;
fieldnr.spell = 1;
fieldnr.equip = 1;

var localStorageInput = "";

const SKILL_COSTS = [1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112];

////////////////////////////////////////////////////////////////////////////////////////////////////////

// fieldnr updaten
function getFieldnr(category) {
	fieldnr.category = document.getElementById(category + "-dynamic").children.length + 1;
	return fieldnr.category;
}

function setNewFieldnr() {
	fieldnr.adv = getFieldnr("adv");
	fieldnr.perk = getFieldnr("perk");
	fieldnr.disadv = getFieldnr("disadv");
	fieldnr.quirk = getFieldnr("quirk");
	fieldnr.skill = getFieldnr("skill");
	fieldnr.spell = getFieldnr("spell");
	fieldnr.equip = getFieldnr("equip");
}


////////////////////////////////////////////////////////////////////////////////////////////////////////

// add comment FIELD

function toggleComments() {
	if (event.target.parentNode.getElementsByTagName("textarea").length != 1) {
		addComment(event);
		return;
	}
	if (event.target.parentNode.getElementsByTagName("textarea").length > 0) removeComment(event);
}

function addComment(event) {
	var br = document.createElement("br");
	var textarea = document.createElement("textarea");
	br.className = "comment";
	textarea.className = "comment";
	event.target.parentNode.appendChild(br);
	event.target.parentNode.appendChild(textarea);
}

function removeComment(event) {
	while (event.target.parentNode.getElementsByClassName("comment").length > 0) {
		event.target.parentNode.removeChild(event.target.parentNode.lastChild);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

// ADD AND REMOVE INPUT FIELDS

function removeFields(category) {
	var count = document.getElementById(category + "-dynamic").children.length - 1;
	var list = document.getElementById(category + "-dynamic");
	list.removeChild(list.childNodes[count]); //lastChild?
	setNewFieldnr();
}

function addFields(category, min, max) {
	var count = document.getElementById(category + "-dynamic").children.length + 1;

	var divRow = document.createElement("div");
	divRow.className = "row";

	var divName = document.createElement("div");
	divName.className = "col-xs-4";

	var inputName = document.createElement("input");
	inputName.type = "text";
	inputName.className = "name";
	inputName.id = category + "-name" + count;
	inputName.placeholder = "Name/Description";

	var divCost = document.createElement("div");
	divCost.className = "col-xs-1";

	var inputCost = document.createElement("input");
	inputCost.type = "number";
	inputCost.min = min;
	inputCost.max = max;
	inputCost.step = "1";
	inputCost.className = "cost";
	inputCost.id = category + "-cost" + count;


	divRow.appendChild(divName);
	divName.appendChild(inputName);

	divRow.appendChild(divCost);
	divCost.appendChild(inputCost);

	document.getElementById(category + "-dynamic").appendChild(divRow);

	setNewFieldnr();
}


function addFieldsSkill() {
	var count = $("#skill-dynamic").children.length + 1;

	var divRow = document.createElement("div");
	divRow.className = "row";


	var divName = document.createElement("div");
	divName.className = "col-xs-4";

	var inputName = document.createElement("input");
	inputName.type = "text";
	inputName.className = "name";
	inputName.id = "skill-name" + count;
	inputName.placeholder = "Name/Description";


	var divType = document.createElement("div");
	divType.className = "col-xs-2";

	var selectType = document.createElement("select");
	selectType.className = "skill-type";
	selectType.id = "skill-type" + count;

	var optionBlankT = document.createElement("option");
	optionBlankT.value = "";
	var textBlankT = document.createTextNode("");

	var optionDX = document.createElement("option");
	optionDX.value = "dx";
	var textDX = document.createTextNode("DX");

	var optionIQ = document.createElement("option");
	optionIQ.value = "iq";
	var textIQ = document.createTextNode("IQ");

	var optionWill = document.createElement("option");
	optionWill.value = "will";
	var textWill = document.createTextNode("Will");

	var optionPer = document.createElement("option");
	optionPer.value = "per";
	var textPer = document.createTextNode("Per");

	var optionHT = document.createElement("option");
	optionHT.value = "ht";
	var textHT = document.createTextNode("HT");


	var divDifficulty = document.createElement("div");
	divDifficulty.className = "col-xs-2";

	var selectDifficulty = document.createElement("select");
	selectDifficulty.className = "skill-difficulty";
	selectDifficulty.id = "skill-difficulty" + count;

	var optionBlankD = document.createElement("option");
	optionBlankD.value = "";
	var textBlankD = document.createTextNode("");

	var optionEasy = document.createElement("option");
	optionEasy.value = "easy";
	var textEasy = document.createTextNode("Easy");

	var optionAverage = document.createElement("option");
	optionAverage.value = "average";
	var textAverage = document.createTextNode("Average");

	var optionHard = document.createElement("option");
	optionHard.value = "hard";
	var textHard = document.createTextNode("Hard");

	var optionVeryHard = document.createElement("option");
	optionVeryHard.value = "veryhard";
	var textVeryHard = document.createTextNode("Very Hard");


	var divLevel = document.createElement("div");
	divLevel.className = "col-xs-1";

	var inputLevel = document.createElement("input");
	inputLevel.type = "number";
	inputLevel.min = "0";
	inputLevel.max = "200";
	inputLevel.step = "1";
	inputLevel.className = "level";
	inputLevel.id = "skill-level" + count;


	var divCost = document.createElement("div");
	divCost.className = "col-xs-1";

	var inputCost = document.createElement("input");
	inputCost.type = "number";
	inputCost.className = "cost";
	inputCost.id = "skill-cost" + count;
	inputCost.disabled = true;

	divRow.appendChild(divName);
	divName.appendChild(inputName);

	divRow.appendChild(divType);
	divType.appendChild(selectType);
	selectType.appendChild(optionBlankT);
	optionBlankT.appendChild(textBlankT);
	selectType.appendChild(optionDX);
	optionDX.appendChild(textDX);
	selectType.appendChild(optionIQ);
	optionIQ.appendChild(textIQ);
	selectType.appendChild(optionWill);
	optionWill.appendChild(textWill);
	selectType.appendChild(optionPer);
	optionPer.appendChild(textPer);
	selectType.appendChild(optionHT);
	optionHT.appendChild(textHT);

	divRow.appendChild(divDifficulty);
	divDifficulty.appendChild(selectDifficulty);
	selectDifficulty.appendChild(optionBlankD);
	optionBlankD.appendChild(textBlankD);
	selectDifficulty.appendChild(optionEasy);
	optionEasy.appendChild(textEasy);
	selectDifficulty.appendChild(optionAverage);
	optionAverage.appendChild(textAverage);
	selectDifficulty.appendChild(optionHard);
	optionHard.appendChild(textHard);
	selectDifficulty.appendChild(optionVeryHard);
	optionVeryHard.appendChild(textVeryHard);

	divRow.appendChild(divLevel);
	divLevel.appendChild(inputLevel);

	divRow.appendChild(divCost);
	divCost.appendChild(inputCost);

	$("#skill-dynamic").appendChild(divRow);

	setNewFieldnr();
}


function addFieldsSpell() {
	var count = $("#spell-dynamic").children.length + 1;

	var divRow = document.createElement("div");
	divRow.className = "row";


	var divName = document.createElement("div");
	divName.className = "col-xs-4";

	var inputName = document.createElement("input");
	inputName.type = "text";
	inputName.className = "name";
	inputName.id = "spell-name" + count;
	inputName.placeholder = "Name/Description";


	var divType = document.createElement("div");
	divType.className = "col-xs-2";

	var selectType = document.createElement("select");
	selectType.className = "spell-type";
	selectType.id = "spell-type" + count;

	var optionBlank = document.createElement("option");
	optionBlank.value = "";
	var textBlank = document.createTextNode("");

	var optionRegular = document.createElement("option");
	optionRegular.value = "regular";
	var textRegular = document.createTextNode("Regular");

	var optionArea = document.createElement("option");
	optionArea.value = "area";
	var textArea = document.createTextNode("Area");

	var optionMelee = document.createElement("option");
	optionMelee.value = "melee";
	var textMelee = document.createTextNode("Melee");

	var optionMissile = document.createElement("option");
	optionMissile.value = "missile";
	var textMissile = document.createTextNode("Missile");

	var optionInformation = document.createElement("option");
	optionInformation.value = "information";
	var textInformation = document.createTextNode("Information");

	var optionResisted = document.createElement("option");
	optionResisted.value = "resisted";
	var textResisted = document.createTextNode("Resisted");

	var optionSpecial = document.createElement("option");
	optionSpecial.value = "special";
	var textSpecial = document.createTextNode("Special");


	var divSpellSkill = document.createElement("div");
	divSpellSkill.className = "col-xs-1";

	var selectSpellSkill = document.createElement("select");
	selectSpellSkill.className = "spell-skill";
	selectSpellSkill.id = "spell-skill" + count;

	var optionHard = document.createElement("option");
	optionHard.value = "hard";
	var textHard = document.createTextNode("H");

	var optionVeryHard = document.createElement("option");
	optionVeryHard.value = "veryhard";
	var textVeryHard = document.createTextNode("VH");


	var divTimeDuration = document.createElement("div");
	divTimeDuration.className = "col-xs-3";

	var inputTimeDuration = document.createElement("input");
	inputTimeDuration.type = "text";
	inputTimeDuration.className = "time-duration";
	inputTimeDuration.id = "time-duration" + count;


	var divLevel = document.createElement("div");
	divLevel.className = "col-xs-1";

	var inputLevel = document.createElement("input");
	inputLevel.type = "number";
	inputLevel.min = "0";
	inputLevel.max = "200";
	inputLevel.step = "1";
	inputLevel.className = "level";
	inputLevel.id = "spell-level" + count;


	var divCost = document.createElement("div");
	divCost.className = "col-xs-1";

	var inputCost = document.createElement("input");
	inputCost.type = "number";
	inputCost.min = "0";
	inputCost.max = "200";
	inputCost.step = "1";
	inputCost.className = "cost";
	inputCost.id = "spell-cost" + count;

	divRow.appendChild(divName);
	divName.appendChild(inputName);

	divRow.appendChild(divSpellSkill);
	divSpellSkill.appendChild(selectSpellSkill);
	selectSpellSkill.appendChild(optionHard);
	optionHard.appendChild(textHard);
	selectSpellSkill.appendChild(optionVeryHard);
	optionVeryHard.appendChild(textVeryHard);

	divRow.appendChild(divType);
	divType.appendChild(selectType);
	selectType.appendChild(optionBlank);
	optionBlank.appendChild(textBlank);
	selectType.appendChild(optionRegular);
	optionRegular.appendChild(textRegular);
	selectType.appendChild(optionArea);
	optionArea.appendChild(textArea);
	selectType.appendChild(optionMelee);
	optionMelee.appendChild(textMelee);
	selectType.appendChild(optionMissile);
	optionMissile.appendChild(textMissile);
	selectType.appendChild(optionInformation);
	optionInformation.appendChild(textInformation);
	selectType.appendChild(optionResisted);
	optionResisted.appendChild(textResisted);
	selectType.appendChild(optionSpecial);
	optionSpecial.appendChild(textSpecial);

	divRow.appendChild(divTimeDuration);
	divTimeDuration.appendChild(inputTimeDuration);

	divRow.appendChild(divLevel);
	divLevel.appendChild(inputLevel);

	divRow.appendChild(divCost);
	divCost.appendChild(inputCost);

	$("#spell-dynamic").appendChild(divRow);
	setNewFieldnr();
}


function addFieldsEquip() {
	var count = $("#equip-dynamic").children.length + 1;

	var divRow = document.createElement("div");
	divRow.className = "row";

	var divName = document.createElement("div");
	divName.className = "col-xs-12";

	var inputName = document.createElement("input");
	inputName.type = "text";
	inputName.className = "equip-name";
	inputName.id = "equip-name" + count;
	inputName.placeholder = "Name/Description";

	divRow.appendChild(divName);
	divName.appendChild(inputName);

	$("#equip-dynamic").appendChild(divRow);

	setNewFieldnr();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////


// BUTTONS

// hide/show button for Spells
function hideSpells() {
	var spellwrap = $("#spellwrap");
	spellwrap.classList.toggle("hidden-stuff");
	$("#spellbutton").innerHTML = spellwrap.classList.contains("hidden-stuff") ? "For I shall wield magic!" : "Avast! Out of my sight!";
}

// delete button with confirm
function deleteAll() {
	swal({
			title: "Are you sure?",
			text: "You will not be able to recover your character data!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel please!",
			closeOnConfirm: false,
			closeOnCancel: false
		},
		function(isConfirm) {
			if (isConfirm) {
				localStorage.clear();
				swal("Deleted!", "Your character data has been deleted.", "success");
			} else {
				swal("Cancelled", "Your character data is safe :)", "error");
			}
		});
}

// Custom Value Buttons: Define CSS change
function toggleValue() {
	var elem = document.getElementById(this);
	elem.classList.toggle("green");
}

function addToggle() {
	for (var i = 0; i < 9; i++) {
		$("#attr2-checkbox" + i).click( toggleValue.bind("custom-value" + i));
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////


// LOCAL STORAGE SET


// localStorage abfragen
function checkLocalStorage() {
	var output = "LOCALSTORAGE DATA:\n------------------------------------\n";
	if (window.localStorage) {
		if (localStorage.length) {
			for (var i = 0; i < localStorage.length; i++) {
				output += localStorage.key(i) + ': ' + localStorage.getItem(localStorage.key(i)) + '\n';
			}
			swal("Good job!", "Your data was loaded successfully.", "success")
		} else {
			swal("There is no data stored for this domain.", "Please save your character data first.")
		}
	} else {
		swal("Oops...", "Your browser does not support local storage.", "error");
	}
	console.log(output);
}


// set Items to localStorage
function storageSetItem(category, type) {
	for (var i = 0; i < fieldnr[category]; i++) {
		var key = category + "-" + type + i;
		var value = document.getElementById(key).value;
		// exception for checkbox
		if (type == "checkbox") value = document.getElementById(key).checked;
		localStorage.setItem(key, value);
	}
}


function saveFieldnr(category) {
	localStorage.setItem(category + "Length", fieldnr[category]);
}

function saveNotes() {
	var notes = $("#notes");
	localStorage.setItem("notes-value", notes.value);
	localStorage.setItem("notes-width", notes.style.width);
	localStorage.setItem("notes-height", notes.style.height);
}


// saveAll
function saveAll() {
	localStorage.setItem("points-total-head", $("#points-total-head").innerHTML);
	localStorage.setItem("positive-total-head", $("#positive-total-head").innerHTML);
	localStorage.setItem("negative-total-head", $("#negative-total-head").innerHTML);

	localStorage.setItem("name", $("#name").value);

	storageSetItem("attr", "level");
	storageSetItem("attr", "cost");

	storageSetItem("attr2", "level");
	storageSetItem("attr2", "cost");
	storageSetItem("attr2", "checkbox");

	storageSetItem("adv", "name");
	storageSetItem("adv", "cost");

	storageSetItem("perk", "name");
	storageSetItem("perk", "cost");

	storageSetItem("disadv", "name");
	storageSetItem("disadv", "cost");

	storageSetItem("quirk", "name");
	storageSetItem("quirk", "cost");

	storageSetItem("skill", "name");
	storageSetItem("skill", "type");
	storageSetItem("skill", "difficulty");
	storageSetItem("skill", "level");
	storageSetItem("skill", "cost");

	storageSetItem("spell", "name");
	storageSetItem("spell", "skill");
	storageSetItem("spell", "type");
	storageSetItem("spell", "time-duration");
	storageSetItem("spell", "level");
	storageSetItem("spell", "cost");

	storageSetItem("equip", "name");

	localStorage.setItem("attrLength", "4");
	localStorage.setItem("attr2Length", "10");

	saveFieldnr("adv");
	saveFieldnr("perk");
	saveFieldnr("disadv");
	saveFieldnr("quirk");
	saveFieldnr("skill");
	saveFieldnr("spell");
	saveFieldnr("equip");

	saveNotes();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////


// LOCAL STORAGE GET


// get Items from localStorage
function storageGetItem(category, type) {
	var length = localStorage.getItem(category + "Length");
	for (var i = 0; i < length; i++) {
		document.getElementById(category + "-" + type + i).value = localStorage.getItem(category + "-" + type + i);
	}
}

// get Fieldnumber from localStorage and add dynamical the right number of input fields
function adaptFieldnrForLocalStorage(category, min, max) {
	//hole Anzahl an Feldern aus dem localStorage (zB advLength)
	var expected = localStorage.getItem(category + "Length");
	//finde heraus, wie viele Felder jetzt gerade auf der Seite sind
	var observed = getFieldnr(category);
	//berechne die Differenz zwischen den aktuellen Feldern und den gewünschten Feldern
	var diff = expected - observed;
	////bei zu wenig: füge Felder hinzu
	if (diff > 0) {
		if (category == "skill") {
			for (var i = 0; i < diff; i++) {
				addFieldsSkill();
			}
		} else if (category == "spell") {
			for (var i = 0; i < diff; i++) {
				addFieldsSpell();
			}
		} else if (category == "equip") {
			for (var i = 0; i < diff; i++) {
				addFieldsEquip();
			}
		} else {
			for (var i = 0; i < diff; i++) {
				addFields(category, min, max);
			}
		}
		////bei zu viel: lösche Felder weg
	} else if (diff < 0) {
		for (var i = 0; i > diff; i--) {
			removeFields(category);
		}
	}
}


// get Items from localStorage for dynamical added input fields
function storageGetItemForDynamics(category, type) {
	var expected = localStorage.getItem(category + "Length");
	//füge localStorage Daten in die Eingabefelder ein
	for (var i = 0; i < expected; i++) {
		var item = category + "-" + type + i;
		document.getElementById(item).value = localStorage.getItem(item);
	}
}

function storageGetCheckbox() {
	for (var i = 0; i < 8; i++) {
		var string = localStorage.getItem("attr2-checkbox" + i);
		var label = $("#custom-value" + i);
		if (string === "true") {
			$("#attr2-checkbox" + i).checked = true;
			label.classList.toggle("green", true);
		} else if (string === "false") {
			$("#attr2-checkbox" + i).checked = false;
			label.classList.toggle("green", false);
		}
	}
}

function storageGetNotes() {
	var notes = $("#notes");
	notes.value = localStorage.getItem("notes-value");
	notes.style.width = localStorage.getItem("notes-width");
	notes.style.height = localStorage.getItem("notes-height");
}


function getAndInsertAll() {
	checkLocalStorage();

	$("#points-total-head").innerHTML = localStorage.getItem("points-total-head");
	$("#positive-total-head").innerHTML = localStorage.getItem("positive-total-head");
	$("#negative-total-head").innerHTML = localStorage.getItem("negative-total-head");

	$("#costs-total-footer").innerHTML = localStorage.getItem("points-total-head");
	$("#costs-positive-footer").innerHTML = localStorage.getItem("positive-total-head");
	$("#costs-negative-footer").innerHTML = localStorage.getItem("negative-total-head");

	$("#name").value = localStorage.getItem("name");

	storageGetItem("attr", "level");
	storageGetItem("attr", "cost");

	storageGetItem("attr2", "level");
	storageGetItem("attr2", "cost");
	storageGetCheckbox();

	adaptFieldnrForLocalStorage("adv", "0", "200");
	storageGetItemForDynamics("adv", "name");
	storageGetItemForDynamics("adv", "cost");

	adaptFieldnrForLocalStorage("perk", "0", "1");
	storageGetItemForDynamics("perk", "name");
	storageGetItemForDynamics("perk", "cost");

	adaptFieldnrForLocalStorage("disadv", "-200", "0");
	storageGetItemForDynamics("disadv", "name");
	storageGetItemForDynamics("disadv", "cost");

	adaptFieldnrForLocalStorage("quirk", "-1", "0");
	storageGetItemForDynamics("quirk", "name");
	storageGetItemForDynamics("quirk", "cost");

	adaptFieldnrForLocalStorage("skill");
	storageGetItemForDynamics("skill", "name");
	storageGetItemForDynamics("skill", "type");
	storageGetItemForDynamics("skill", "difficulty");
	storageGetItemForDynamics("skill", "level");
	storageGetItemForDynamics("skill", "cost");

	adaptFieldnrForLocalStorage("spell");
	storageGetItemForDynamics("spell", "name");
	storageGetItemForDynamics("spell", "skill");
	storageGetItemForDynamics("spell", "type");
	storageGetItemForDynamics("spell", "time-duration");
	storageGetItemForDynamics("spell", "level");
	storageGetItemForDynamics("spell", "cost");

	adaptFieldnrForLocalStorage("equip");
	storageGetItemForDynamics("equip", "name");

	storageGetNotes();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////


// SECONDARY ATTRIBUTES

// berechne die Level der Sekundärattribute mithilfe der Primärattribute
// füge die Werte nur dann automatisch ein, wenn "use custom value" auf false steht
function berechneSekundaerattribute() {
	// HP = ST
	if ($("#attr2-checkbox0").checked == false) levels.hp.value = levels.st.value;
	// Will = IQ
	if ($("#attr2-checkbox1").checked == false) levels.will.value = levels.iq.value;
	// Per = IQ
	if ($("#attr2-checkbox2").checked == false) levels.per.value = levels.iq.value;
	// FP = HT
	if ($("#attr2-checkbox3").checked == false) levels.fp.value = levels.ht.value;
	// Basic Speed = (HT+DX)/4
	if ($("#attr2-checkbox4").checked == false) levels.bs.value = (parseInt(levels.ht.value) + parseInt(levels.dx.value)) / 4;
	// Basic Move = Basic Speed (ohne Nachkommastellen)
	if ($("#attr2-checkbox5").checked == false) levels.bm.value = parseInt(levels.bs.value);
	// Dodge = Basic Speed (ohne Nachkommastellen) + 3
	if ($("#attr2-checkbox6").checked == false) levels.dg.value = parseInt(levels.bs.value) + 3;
	// Basic Lift = (ST*ST)/5
	if ($("#attr2-checkbox7").checked == false) levels.bl.value = (parseInt(levels.st.value) * parseInt(levels.st.value)) / 5;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////


// AUTOMATISCHES BERECHNEN VON KOSTEN


// Errechne Kosten für Primärattribute, die entweder 10 oder 20 Punkte/Level kosten
function attributeCosts() {
	var cost = 0;
	for (var i = 0; i < 4; i++) {
		if (i == 0 || i == 3) {
			cost = ($("#attr-level" + i).value - 10) * 10;
		} else if (i == 1 || i == 2) {
			cost = ($("#attr-level" + i).value - 10) * 20;
		}
		$("#attr-cost" + i).value = cost;
	}
}


// Errechne Skill-Kosten
function skillCosts() {
	var difference = 0;
	var cost = 0;
	var count = $("#skill-dynamic").children.length + 1;
	for (var i = 0; i < count; i++) {
		var skillType = $("#skill-type" + i).value;
		var skillDifficulty = $("#skill-difficulty" + i).value;
		var skillLevel = $("#skill-level" + i).value;
		if (skillType && skillDifficulty && skillLevel) {
			// errechne die Differenz zwischen Skill-Level und zugehörigem Attribut-Level
			difference = skillLevel - levels[skillType].value;

			// überprüfe, ob die Differenz einen validen Wert hat und gib die Kosten aus
			if (skillDifficulty == "easy" && difference > -1) {
				cost = SKILL_COSTS[difference];
			} else if (skillDifficulty == "average" && difference > -2) {
				cost = SKILL_COSTS[difference + 1];
			} else if (skillDifficulty == "hard" && difference > -3) {
				cost = SKILL_COSTS[difference + 2];
			} else if (skillDifficulty == "veryhard" && difference > -4) {
				cost = SKILL_COSTS[difference + 3];
			} else {
				cost = 0;
			}
			$("#skill-cost" + i).value = cost;
		}
	}
}

// Errechne Spell-Kosten
function spellCosts() {
	let spellRows = $("#spell-dynamic").children().length + 1;

	for (let i = 0; i < spellRows; i++) {
		let level = $(`#spell-level${i}`).val();
		let skillType = $(`#spell-skill${i}`).val();
		let iq = $(levels.iq).val();

		if (!skillType || !level) {
			continue;
		}

		let cost = getSkillCost(skillType, iq, level);

		$(`#spell-cost${i}`).val(cost);
	}
}

function damage() {
	var st = $("#attr-level0").value;
	var thrust = ["0", "1d-6", "1d-6", "1d-5", "1d-5", "1d-4", "1d-4", "1d-3", "1d-3", "1d-2", "1d-2", "1d-1", "1d-1", "1d", "1d", "1d+1", "1d+1", "1d+2", "1d+2", "2d-1", "2d-1", "2d", "2d", "2d+1", "2d+1", "2d+2", "2d+2", "3d-1", "3d-1", "3d", "3d", "3d+1", "3d+1", "3d+2", "3d+2", "4d-1", "4d-1", "4d", "4d", "4d+1", "4d+1", "5d", "5d+2", "6d", "7d-1", "7d+1", "8d", "8d+2", "9d", "9d+2", "10d", "10d+2", "11d"];
	var swing = ["0", "1d-5", "1d-5", "1d-4", "1d-4", "1d-3", "1d-3", "1d-2", "1d-2", "1d-1", "1d", "1d+1", "1d+2", "2d-1", "2d", "2d+1", "2d+2", "3d-1", "3d", "3d+1", "3d+2", "4d-1", "4d", "4d+1", "4d+2", "5d-1", "5d", "5d+1", "5d+1", "5d+2", "5d+2", "6d-1", "6d-1", "6d", "6d", "6d+1", "6d+1", "6d+2", "6d+2", "7d-1", "7d-1", "7d+1", "8d-1", "8d+1", "9d", "9d+2", "10d", "10d+2", "11d", "11d+2", "12d", "12d+2", "13d"];
	$("#attr2-level8").value = thrust[st];
	$("#attr2-level9").value = swing[st];
}

function getSkillCost(type, level, expectedLevel) {
	const SKILL_TYPE_ADDEND = {
		easy: 0,
		average: 1,
		hard: 2,
		veryhard: 3,
	};

	let diff = parseInt(expectedLevel) - parseInt(level);
	let index = diff + SKILL_TYPE_ADDEND[type];

	return SKILL_COSTS[index] || 0;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////


// KOSTEN BERECHNUNG

// erstelle ein Array aus den Cost-Werten der einzelnen Gruppen
function createCostArray(trait, numberOfItems) {
	var traitList = [];
	var singleCost = 0;
	for (var i = 0; i < numberOfItems; i++) {
		singleCost = document.getElementById(trait + i).value;
		if (singleCost === "") {
			singleCost = 0;
		}
		singleCost = parseInt(singleCost);
		traitList.push(singleCost);
	}
	return traitList;
}

// mache ""-Werte eines Array zu 0 und verhindere undefined und NaN
function macheLeerZuNull(array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == "") array[i] = 0;
	}
	for (var i = 0; i < array.length; i++) {
		array[i] = parseInt(array[i]);
	}
	return array;
}

// berechne die Summe eines Arrays von Zahlen
function sum(costArray) {
	var result = 0;
	for (var i = 0; i < costArray.length; i++) {
		result += costArray[i];
	}
	return result;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////


// GESAMTBERECHNUNG

// berechne alles und gib es aus
function update() {
	berechneSekundaerattribute();
	attributeCosts();
	damage();
	skillCosts();
	spellCosts();

	var attrArray = createCostArray("attr-cost", fieldnr.attr);
	var attr2Array = createCostArray("attr2-cost", fieldnr.attr2);
	var advArray = createCostArray("adv-cost", fieldnr.adv);
	var perkArray = createCostArray("perk-cost", fieldnr.perk);
	var disadvArray = createCostArray("disadv-cost", fieldnr.disadv);
	var quirkArray = createCostArray("quirk-cost", fieldnr.quirk);
	var skillArray = createCostArray("skill-cost", fieldnr.skill);
	var spellArray = createCostArray("spell-cost", fieldnr.spell);

	attrArray = macheLeerZuNull(attrArray);
	attr2Array = macheLeerZuNull(attr2Array);
	advArray = macheLeerZuNull(advArray);
	perkArray = macheLeerZuNull(perkArray);
	disadvArray = macheLeerZuNull(disadvArray);
	quirkArray = macheLeerZuNull(quirkArray);
	skillArray = macheLeerZuNull(skillArray);
	spellArray = macheLeerZuNull(spellArray);

	var attrTotalCost = sum(attrArray);
	var attr2TotalCost = sum(attr2Array);
	var advTotalCost = sum(advArray);
	var perkTotalCost = sum(perkArray);
	var disadvTotalCost = sum(disadvArray);
	var quirkTotalCost = sum(quirkArray);
	var skillTotalCost = sum(skillArray);
	var spellTotalCost = sum(spellArray);

	var positivePoints = attrTotalCost + attr2TotalCost + advTotalCost + perkTotalCost + skillTotalCost + spellTotalCost;
	var negativePoints = disadvTotalCost + quirkTotalCost;
	var totalPoints = positivePoints + negativePoints;

	$("#points-total-head").innerHTML = totalPoints;
	$("#positive-total-head").innerHTML = positivePoints;
	$("#negative-total-head").innerHTML = negativePoints;
	$("#costs-total-footer").innerHTML = totalPoints;
	$("#costs-positive-footer").innerHTML = positivePoints;
	$("#costs-negative-footer").innerHTML = negativePoints;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

// UNICORN MOUSE FOLLOW

function followMouse(event) {
	var x = event.clientX;
	var y = event.clientY;
	x = x + 1; // move follower 10px right and 10px down to not overlay the mouse
	y = y + 1;
	$("#unicorn").style.left = x + "px";
	$("#unicorn").style.top = y + "px";
}

function showUnicorn() {
	var unicorn = $("#unicorn");
	if (unicorn.classList.contains("hidden-stuff")) {
		window.addEventListener("mousemove", followMouse);
		unicorn.classList.remove("hidden-stuff");
		swal("Unicorn activated!", "This little pony wants to follow you around. It can be hidden by clicking the button one more time.");
	} else if (!unicorn.classList.contains("hidden-stuff")) {
		unicorn.classList.add("hidden-stuff");
	}
	$("#unicorn-button").innerHTML = $("#unicorn").classList.contains("hidden-stuff") ? "activate unicorn" : "hide unicorn";
}


////////////////////////////////////////////////////////////////////////////////////////////////////////

//LOCAL STORAGE SAVE TO FILE AND LOAD FROM FILE
//origin: https://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/

function saveTextAsFile() {
	saveAll();

	var localSt = {};
	for (var i in localStorage) {
		localSt[i] = localStorage[i];
	}

	var textToWrite = JSON.stringify(localSt);
	var textFileAsBlob = new Blob([textToWrite], {
		type: 'text/plain'
	});
	var fileNameToSaveAs = $("#input-file-name").value;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.URL != null) {
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	} else {
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

function destroyClickedElement(event) {
	document.body.removeChild(event.target);
}

function loadFileAsText() {
	var fileToLoad = $("#file-to-load").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		var textFromFileLoaded = fileLoadedEvent.target.result;
		localStorageInput = JSON.parse(textFromFileLoaded);
		insertLoadedDataToLocalStorage(localStorageInput);
		getAndInsertAll();
	};
	fileReader.readAsText(fileToLoad, "UTF-8");

}

function insertLoadedDataToLocalStorage(data) {
	localStorage.clear();
	for (var i in data) {
		localStorage.setItem(i, data[i]);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

// Aktiviere JS Code insgesamt und Buttons mit .on

function setup() {
	// set Variables
	levels.st = $("#attr-level0");
	levels.dx = $("#attr-level1");
	levels.iq = $("#attr-level2");
	levels.ht = $("#attr-level3");

	levels.hp = $("#attr2-level0");
	levels.will = $("#attr2-level1");
	levels.per = $("#attr2-level2");
	levels.fp = $("#attr2-level3");
	levels.bs = $("#attr2-level4");
	levels.bm = $("#attr2-level5");
	levels.dg = $("#attr2-level6");
	levels.bl = $("#attr2-level7");


	// Automatically update the count by clicking or keypress
	document.addEventListener("input", update);

	// Minus and Plus Button for Adv/Perks/Disadv/Quirks
	$("#advminus").click( () => {
		removeFields('adv');
	});
	$("#advplus").click( () => {
		addFields("adv", "0", "200");
	});

	$("#perkminus").click( () => {
		removeFields('perk');
	});
	$("#perkplus").click( () => {
		addFields("perk", "0", "1");
	});

	$("#disadvminus").click( () => {
		removeFields('disadv');
	});
	$("#disadvplus").click( () => {
		addFields("disadv", "-200", "0");
	});

	$("#quirkminus").click( () => {
		removeFields('quirk');
	});
	$("#quirkplus").click( () => {
		addFields("quirk", "-1", "0");
	});


	// Minus and Plus Button for Skills
	$("#skillminus").click( () => {
		removeFields('skill');
	});
	$("#skillplus").click( addFieldsSkill);


	// Minus and Plus Button for Spells
	$("#spellminus").click( () => {
		removeFields('spell');
	});
	$("#spellplus").click( addFieldsSpell);


	// Minus and Plus Button for Equipment
	$("#equipminus").click( () => {
		removeFields('equip');
	});
	$("#equipplus").click( addFieldsEquip);


	// Hide/Show Button for Spells
	$("#spellbutton").click( () => {
		hideSpells();
		window.scrollBy(0, 500);
	});

	// Toggle Buttons for Comments
	$("#comment-button").click( toggleComments);

	// Activate Unicorn Button
	$("#unicorn-button").click( showUnicorn);


	// CSS change for Checkbox Buttons (secondary attributes)
	addToggle();


	//LOCAL STORAGE

	// save-button for localStorage
	$("#save-button").click( () => {
		saveAll();
		swal("Data saved!", "Your character's data was saved to the browser's local storage. To load your data, just click the 'Load Character Data' button. Caution: This will only work in the same browser, where you saved the data!", "success");
	});

	// get-my-data-button for localStorage
	$("#get-data-button").click( getAndInsertAll);

	// delete all localStorage Data
	$("#delete-data-button").click( deleteAll);

	//save and load data as text file
	$("#save-file-as-text").click(() => {
		saveTextAsFile();
	});
	$("#load-file-as-text").click(() => {
		loadFileAsText();
	});
}

window.addEventListener("load", setup);
*/
