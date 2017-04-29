(function () {
  function fillInCosts(e) {
    const box = $($(e.target).parents().filter('.row'));
    const trait = box.data().trait;
    let cost;

    switch (trait) {
      case 'attr':
        cost = getAttrCost(box);
        break;
      case 'skill':
        cost = getSkillCost(box);
        break;
      case 'spell':
        cost = getSpellCost(box);
        break;
      default:
        return;
    }

    box.find('.cost').val(cost);
  }

  function recalculateCosts(box) {
    const trait = box.data().trait;
    let cost;

    if (trait === 'skill') cost = getSkillCost(box);
    else if (trait === 'spell') cost = getSpellCost(box);

    box.find('.cost').val(cost);
  }

  function getAttrCost(box) {
    const ATTR_COSTS = [10, 20, 20, 10];

    const levelBox = box.find('.level');
    const level = parseInt(levelBox.val()) || 0;
    const position = box.data().position;

    return (level - 10) * ATTR_COSTS[position];
  }

  function getSkillCost(box) {
    const level = box.find('.level').val();
    const skillType = box.find('.type').val();
    const difficulty = box.find('.difficulty').val();

    if (!level || !skillType || !difficulty) {
      return 0;
    }

    const skillLevel = $(`#attr-type-${skillType}`).find('.level').val() || 0;

    return calculateSkillCost(difficulty, skillLevel, level);
  }

  function getSpellCost(box) {
    const level = box.find('.level').val();
    const skillType = box.find('.skill').val();
    const iq = $('#attr-type-iq').find('.level').val() || 0;
    const magicalApt = $('#magical-aptitude-lvl').val() || 0;

    if (!skillType || !level) {
      return 0;
    }

    return calculateSkillCost(skillType, parseInt(iq) + parseInt(magicalApt), level);
  }

  function calculateSkillCost(type, level, expectedLevel) {
    const SKILL_COSTS = [1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112];
    const SKILL_TYPE_ADDEND = {
      easy: 0,
      average: 1,
      hard: 2,
      veryhard: 3,
    };

    const diff = parseInt(expectedLevel) - parseInt(level);
    const index = diff + SKILL_TYPE_ADDEND[type];

    return SKILL_COSTS[index] || 0;
  }

  function fillInSecondaryStats() {
    const attrLevels = $('.attr-level');
    const levels = {
      st: parseInt($(attrLevels[0]).val()),
      dx: parseInt($(attrLevels[1]).val()),
      iq: parseInt($(attrLevels[2]).val()),
      ht: parseInt($(attrLevels[3]).val()),
    };

    fillInAttr2Values(levels);
    fillInDamageValues(levels);
  }

  function fillInAttr2Values(levels) {
    const attr2Rows = $('.attr2-row');

		// HP = ST
    levels.hp = levels.st;
		// Will = IQ
    levels.will = levels.iq;
		// Per = IQ
    levels.per = levels.iq;
		// FP = HT
    levels.fp = levels.ht;
		// Basic Speed = (HT+DX)/4
    levels.bs = (levels.ht + levels.dx) / 4;
		// Basic Move = Basic Speed (rounded down)
    levels.bm = parseInt(levels.bs);
		// Dodge = Basic Speed (rounded down) + 3
    levels.dg = parseInt(levels.bs) + 3;
		// Basic Lift = (ST*ST)/5
    levels.bl = (levels.st * levels.st) / 5;

    for (let i = 0; i < attr2Rows.length; i++) {
      const row = $(attr2Rows[i]);
      const level = levels[row.data().abbr];

      row.find('.level').val(level);
    }
  }

  function fillInDamageValues(levels) {
    const THRUST = ['0', '1d-6', '1d-6', '1d-5', '1d-5', '1d-4', '1d-4', '1d-3', '1d-3', '1d-2', '1d-2', '1d-1', '1d-1', '1d', '1d', '1d+1', '1d+1', '1d+2', '1d+2', '2d-1', '2d-1', '2d', '2d', '2d+1', '2d+1', '2d+2', '2d+2', '3d-1', '3d-1', '3d', '3d', '3d+1', '3d+1', '3d+2', '3d+2', '4d-1', '4d-1', '4d', '4d', '4d+1', '4d+1', '5d', '5d+2', '6d', '7d-1', '7d+1', '8d', '8d+2', '9d', '9d+2', '10d', '10d+2', '11d'];
    const SWING = ['0', '1d-5', '1d-5', '1d-4', '1d-4', '1d-3', '1d-3', '1d-2', '1d-2', '1d-1', '1d', '1d+1', '1d+2', '2d-1', '2d', '2d+1', '2d+2', '3d-1', '3d', '3d+1', '3d+2', '4d-1', '4d', '4d+1', '4d+2', '5d-1', '5d', '5d+1', '5d+1', '5d+2', '5d+2', '6d-1', '6d-1', '6d', '6d', '6d+1', '6d+1', '6d+2', '6d+2', '7d-1', '7d-1', '7d+1', '8d-1', '8d+1', '9d', '9d+2', '10d', '10d+2', '11d', '11d+2', '12d', '12d+2', '13d'];

    $('#damage-value0').val(THRUST[levels.st]);
    $('#damage-value1').val(SWING[levels.st]);
  }


  const bridge = {};
  bridge.fillInCosts = fillInCosts;
  bridge.fillInSecondaryStats = fillInSecondaryStats;
  bridge.recalculateCosts = recalculateCosts;

  window.AutoFiller = bridge;
}());
