(function () {
  const TRAITS = ['adv', 'perk', 'disadv', 'quirk', 'skill', 'spell', 'equipment'];

  function initPage() {
    initButtons();
    initInputRows();
    setListeners();
  }

  function initButtons() {
    for (let i = 0; i < TRAITS.length; i++) {
      const trait = TRAITS[i];
      const buttonBox = $($('#button-template').html());
      const container = $(`#${trait}-button-container`);

      buttonBox.find('button.minus').attr('data-trait', trait);
      buttonBox.find('button.plus').attr('data-trait', trait);

      container.append(buttonBox);
    }
  }

  function initInputRows() {
    AddRows.addAttrRows();
    AddRows.addAttr2Rows();
    AddRows.addDamageRows();

    for (let i = 0; i < TRAITS.length; i++) {
      const trait = TRAITS[i];

      AddRows.addTraitHeadline(trait);
      AddRows.addTraitRow(trait);
    }
  }

  function setListeners() {
    setAddRemoveButtons();
    setLocalStorageButtons();
    setSaveLoadAsTextFileButtons();
    setHideCategoryButtons();
    setSortCategoryButtons();
    setCostTotalCount();
  }

  function setAddRemoveButtons() {
    $('.plus').click(addRow);
    $('.minus').click(removeRow);
  }

  function addRow() {
    const trait = $(this).data().trait;
    AddRows.addTraitRow(trait);
  }

  function removeRow() {
    const trait = $(this).data().trait;
    const box = $(`#${trait}-rows-container`);

    if (box.children().length <= 1) {
      return;
    }

    box.children().last().remove();
  }

  function setHideCategoryButtons() {
    $('.hide-category-button')
			.on('click', toggleCategory);
  }

  function toggleCategory() {
    const trait = $(this).data().trait;
    const box = $(`.${trait}-container`);
    const buttonText = box.hasClass('hidden') ? 'hide' : `show ${trait}`;

    box.toggleClass('hidden');
    $(this).text(buttonText);
  }

  function setSortCategoryButtons() {
    $('.sort-category-button')
			.on('click', sortCategory);
  }

  function sortCategory() {
    const trait = $(this).data().trait;
    const container = `#${trait}-rows-container`;

    $(`${container} .row`).sort((a, b) => {
      const nameA = $(a).find('.name').val().toLowerCase();
      const nameB = $(b).find('.name').val().toLowerCase();

      if (!nameA) return 1;
      else if (!nameB) return -1;

      return nameA.localeCompare(nameB);
    }).appendTo(container);
  }

  function setCostTotalCount() {
    $('.total-gained-points')
			.on('input', CalculateCosts.insertCosts);
  }

  function setLocalStorageButtons() {
    $('#save-data-button').click(LocalStorageSave.saveData);
    $('#load-data-button').click(LocalStorageLoad.loadData);
    $('#delete-data-button').click(LocalStorageDelete.deleteData);
  }

  function setSaveLoadAsTextFileButtons() {
    $('#save-file-as-text').click(FileSaver.save);
    $('#load-file-as-text').click(FileLoader.load);
  }

  window.initPage = initPage;
}());

$(document).ready(initPage);
