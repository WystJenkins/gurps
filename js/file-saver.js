(() => {
  function save() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const charName = $('#name').val().trim().replace(/([^a-zA-Z0-9-._()])/g, '-');
    const fileName = `${charName}_${year}-${month}-${day}`;

    const data = LocalStorageSave.createCharJSON();

    const blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName);
  }

  window.FileSaver = {
    save,
  };
})();
