(function () {
  const charData = {
    attr: [],
    adv: [],
    perk: [],
    disadv: [],
    quirk: [],
    skill: [],
    spell: [],
    equipment: [],
    notes: {},
  };

  function saveName() {
    charData.name = $('#name').val();
  }

  function saveAttr() {
    const rows = $('#attr-rows-container').find('.row');

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);

      charData.attr.push({
        id: row.attr('id'),
        level: row.find('.level').val() || 0,
        cost: row.find('.cost').val() || 0,
      });
    }
  }

  function saveTrait() {
    const rows = $('#adv-rows-container, #perk-rows-container, #disadv-rows-container, #quirk-rows-container').find('.row');

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);
      const trait = row.data().trait;

      charData[trait].push({
        name: row.find('.name').val() || '',
        cost: row.find('.cost').val() || 0,
        note: row.find('.note').val() || '',
      });
    }
  }

  function saveSkill() {
    const rows = $('#skill-rows-container').find('.row');

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);

      charData.skill.push({
        name: row.find('.name').val() || '',
        type: row.find('.type').val() || '',
        difficulty: row.find('.difficulty').val() || '',
        level: row.find('.level').val() || 0,
        cost: row.find('.cost').val() || 0,
        note: row.find('.note').val() || '',
      });
    }
  }

  function saveSpell() {
    const rows = $('#spell-rows-container').find('.row');

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);

      charData.spell.push({
        name: row.find('.name').val() || '',
        skill: row.find('.skill').val() || '',
        type: row.find('.type').val() || '',
        'time-duration': row.find('.time-duration').val() || '',
        level: row.find('.level').val() || 0,
        cost: row.find('.cost').val() || 0,
        note: row.find('.note').val() || '',
      });
    }
  }

  function saveEquipment() {
    const rows = $('#equipment-rows-container').find('.row');

    for (let i = 0; i < rows.length; i++) {
      const row = $(rows[i]);

      charData.equipment.push({
        name: row.find('.name').val() || '',
      });
    }
  }

  function saveNotes() {
    const notesBox = $('#notes');

    charData.notes = {
      content: notesBox.val(),
      width: notesBox.width(),
      height: notesBox.height(),
    };
  }

  function saveTotalPoints() {
    charData.totalPoints = $('.total-gained-points').val();
  }


	// LOAD DATA FROM LOCAL STORAGE

  function loadData() {
    const storageData = localStorage.getItem('charData');

    if (!storageData) {
      swal('No Local Storage Data found.');
      return;
    }

    insertData(toValidJSON(storageData));

    CalculateCosts.insertCosts();

    swal('Fetched!', 'Your data has been fetched.', 'success');
  }

  function toValidJSON(data) {
		// change newlines from \n to \\n; see http://stackoverflow.com/a/29666086/5362524
    return JSON.parse(data.replace(/\n/g, '\\n'));
  }

  function insertData(data) {
    insertName(data.name);
    insertAttr(data.attr);

    insertTraits(data);

    insertNotes(data.notes);
    insertTotalPoints(data.totalPoints);
  }

  function insertName(name) {
    $('#name').val(name);
  }

  function insertAttr(attrData) {
    for (let i = 0; i < attrData.length; i++) {
      const data = attrData[i];
      const row = $(`#${data.id}`);

      row.find('.level').val(data.level);
      row.find('.cost').val(data.cost);
    }
  }

  function insertTraits(data) {
    const TRAITS = ['adv', 'perk', 'disadv', 'quirk', 'skill', 'spell', 'equipment'];

    for (const prop in data) {
      if (TRAITS.includes(prop)) {
        insertTrait(prop, data[prop]);
      }
    }
  }

  function insertTrait(trait, traitData) {
    const box = $(`#${trait}-rows-container`);
    box.empty();

    for (let i = 0; i < traitData.length; i++) {
      AddRows.addTraitRow(trait);

      const row = box.find(`#${trait}-row${i}`);
      const data = traitData[i];

      for (const prop in data) {
        row.find(`.${prop}`).val(data[prop]);

        if (prop === 'note' && data[prop].length) {
          row.find('.note').removeClass('hidden');
          row.find('.toggle-note-button').text('‒');
        }
      }
    }
  }

  function insertNotes(notes) {
    $('#notes')
			.val(notes.content)
			.width(notes.width)
			.height(notes.height);
  }

  function insertTotalPoints(totalPoints) {
    $('.total-gained-points').val(totalPoints);
  }


	// DELETE LOCAL STORAGE DATA

  function deleteData() {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover your character data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel please!',
      closeOnConfirm: false,
      closeOnCancel: true,
    }, (isConfirmed) => {
      if (!isConfirmed) {
        return;
      }

      localStorage.clear();
      swal('Deleted!', 'Your character data has been deleted.', 'success');
    });
  }

	// SAVE DATA TO LOCAL STORAGE

  function saveData() {
    localStorage.clear();

    saveName();
    saveAttr();

    saveTrait();
    saveSkill();
    saveSpell();

    saveEquipment();
    saveNotes();
    saveTotalPoints();

    localStorage.setItem('charData', JSON.stringify(charData));

		console.log('Saved data:', JSON.stringify(charData));

    swal('Saved!', 'Your data has been saved.', 'success');
  }

  window.LocalStorage = {
    saveData,
    loadData,
    deleteData,
  };
}());
