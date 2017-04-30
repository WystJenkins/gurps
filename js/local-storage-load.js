(function () {
  function toValidJSON(data) {
		// change newlines from \n to \\n; see http://stackoverflow.com/a/29666086/5362524
    return JSON.parse(data.replace(/\n/g, '\\n'));
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

  function insertMagicalAptitudeLvl(magicalAptitudeLvL) {
    $('#magical-aptitude-lvl').val(magicalAptitudeLvL);
  }

  function insertData(data) {
    insertName(data.name);
    insertAttr(data.attr);

    insertTraits(data);

    insertNotes(data.notes);
    insertTotalPoints(data.totalPoints);
    insertMagicalAptitudeLvl(data.magicalAptitude);
  }

  function loadData() {
    const storageData = localStorage.getItem('charData');

    if (!storageData) {
      swal('No Local Storage Data found.');
      return;
    }

    insertData(toValidJSON(storageData));

    console.log('Inserted data:', toValidJSON(storageData));

    CalculateCosts.insertCosts();

    swal('Fetched!', 'Your data has been fetched.', 'success');
  }

  window.LocalStorageLoad = {
    loadData,
    insertData,
  };
}());
