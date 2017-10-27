(() => {
  function load() {
    const fileToLoad = document.getElementById('file-to-load').files[0];

    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
      const loadedContent = fileLoadedEvent.target.result;
      const data = JSON.parse(loadedContent);

      if (!data || !$.isPlainObject(data)) {
        swal('Invalid data.');
        return;
      }

      LocalStorageLoad.insertData(data);
      CalculateCosts.insertCosts();

      swal('Fetched!', 'Your data has been fetched.', 'success');
    };
    fileReader.readAsText(fileToLoad, 'UTF-8');
  }

  window.FileLoader = {
    load,
  };
})();
