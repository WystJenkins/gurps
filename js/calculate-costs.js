(function () {
  function insertCosts() {
    const costs = autoCountCosts($('.cost'));
    const negativeCosts = autoCountCosts($('#disadv-rows-container, #quirk-rows-container').find('.cost'));

    checkCostLimit(costs);

    $('#costs-total-footer').text(costs);
    $('#costs-negative-footer').text(negativeCosts);
  }

  function autoCountCosts(costFields) {
    let costs = 0;

    for (let i = 0; i < costFields.length; i++) {
      const value = $(costFields[i]).val();
      const cost = parseInt(value) || 0;

      costs += cost;
    }

    return costs;
  }

  function checkCostLimit(costs) {
    const limit = parseInt($('.total-gained-points').val());
    const warning = $('.costs-warning');

    if (costs > limit) {
      warning.removeClass('hidden');
    } else {
      warning.addClass('hidden');
    }
  }

  const bridge = {};
  bridge.insertCosts = insertCosts;

  window.CalculateCosts = bridge;
}());
