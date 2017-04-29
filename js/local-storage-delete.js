(function () {
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

  window.LocalStorageDelete = {
    deleteData,
  };
}());
