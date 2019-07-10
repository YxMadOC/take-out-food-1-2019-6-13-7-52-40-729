const bestCharge = require('../src/best-charge')

describe('Take out food', function () {

  it('should return readResult when the items are given', function () {
    // given
    const inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    // when
    const result = bestCharge.readItemIds(inputs);
    // then
    expect(result).toEqual({'ITEM0001': 1, 'ITEM0013': 2, 'ITEM0022': 1});
  });

  it('should return related items when invoke findRelatedItems given readResult', function () {
    // given
    const inputs = {'ITEM0001': 1, 'ITEM0013': 2, 'ITEM0022': 1};
    // when
    const result = bestCharge.findRelatedItems(inputs);
    // then
    expect(result).toEqual([ { id: 'ITEM0001', name: '黄焖鸡', price: 18, count: 1 },
      { id: 'ITEM0013', name: '肉夹馍', price: 6, count: 2 },
      { id: 'ITEM0022', name: '凉皮', price: 8, count: 1 } ]);
  });

  it('should return discountInfo when invoke takeHalfDiscount given relatedItems, itemsOnDiscount', function () {
    // given
    const relatedItems = [ { id: 'ITEM0001', name: '黄焖鸡', price: 18, count: 1 },
      { id: 'ITEM0013', name: '肉夹馍', price: 6, count: 2 },
      { id: 'ITEM0022', name: '凉皮', price: 8, count: 1 } ];
    const itemsOnDiscount = ['ITEM0001', 'ITEM0022'];
    // when
    const result = bestCharge.takeHalfDiscount(relatedItems, itemsOnDiscount);
    // then
    expect(result).toEqual({ discountTotal: 25, discounted: true, discountType: '指定菜品半价(黄焖鸡，凉皮)'});
  });

  it('should return discountInfo when invoke takeMinusDiscount given relatedItems', function () {
    // given
    const relatedItems = [ { id: 'ITEM0001', name: '黄焖鸡', price: 18, count: 1 },
      { id: 'ITEM0013', name: '肉夹馍', price: 6, count: 2 },
      { id: 'ITEM0022', name: '凉皮', price: 8, count: 1 } ];
    // when
    const result = bestCharge.takeMinusDiscount(relatedItems);
    // then
    expect(result).toEqual({ discountTotal: 32, discounted: true, discountType: '满30减6元'});
  });

  it('should return the best discount when invoke checkPromotions given relatedItems', function () {
    // given
    const relatedItems = [ { id: 'ITEM0001', name: '黄焖鸡', price: 18, count: 1 },
      { id: 'ITEM0013', name: '肉夹馍', price: 6, count: 2 },
      { id: 'ITEM0022', name: '凉皮', price: 8, count: 1 } ];
    // when
    const result = bestCharge.checkPromotions(relatedItems);
    // then
    expect(result).toEqual({ total: 38, discountTotal: 25, discounted: true, discountType: '指定菜品半价(黄焖鸡，凉皮)'});
  });

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge.bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge.bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge.bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});
