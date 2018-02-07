(function () {
  let charData;

  function saveName() {
    charData.name = $('#name').val();
  }

  function saveAttr(container) {
    const rows = $(container).find('.row');

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

  function saveMagicalAptitude() {
		charData.magicalAptitude = $('#magical-aptitude-lvl').val();
  }

  function createCharJSON() {
    charData = {
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

    saveName();

    saveAttr('#attr-rows-container');
    saveAttr('#attr2-rows-container');

    saveMagicalAptitude();

    saveTrait();
    saveSkill();
    saveSpell();

    saveEquipment();
    saveNotes();
    saveTotalPoints();

    console.log('charData', JSON.stringify(charData));

    return charData;
  }

  function saveData() {
    localStorage.clear();

    createCharJSON();

    localStorage.setItem('charData', JSON.stringify(charData));

    swal('Saved!', 'Your data has been saved.', 'success');
  }

  window.LocalStorageSave = {
    saveData,
    createCharJSON,
  };
}());
