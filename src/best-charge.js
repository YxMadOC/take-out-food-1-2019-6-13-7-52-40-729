const promotions = require('./promotions');
const items = require('./items')

const allPromotions = promotions.loadPromotions();
const allItems = items.loadAllItems();

const readItemIds = (itemIds) => {
  return itemIds.reduce((prev, item) => {
    if(item.split('x')[0].trim() in prev){
      prev[item.split('x')[0].trim()]++;
    }else{
      prev[item.split('x')[0].trim()] = parseInt(item.split('x')[1]);
    }
    return prev;
  }, {});
};


const findRelatedItems = (readResult) => {
  let relatedItems = [];
  allItems.forEach(item => {
    if(readResult[item.id]){
      let temp = item;
      temp.count = readResult[item.id];
      relatedItems.push(temp);
    }
  });
  return relatedItems;
};

const takeHalfDiscount = (relatedItems, itemsOnDiscount) => {
  let total = 0;
  let discountFlag = false;
  relatedItems.forEach(item => {
    if(itemsOnDiscount.includes(item.id)){
      discountFlag = true;
      total += (item.price * item.count) / 2.00;
    }else{
      total += item.price * item.count;
    }
  });
  return {discountTotal: total, discounted: discountFlag, discountType: allPromotions[1].type};
};

const takeMinusDiscount = (relatedItems) => {
  let total = 0;
  let discountFlag = false;
  relatedItems.forEach(item => {
    total += item.price * item.count;
  });
  if(total >= 30){
    discountFlag = true;
    total -= 6;
  }
  return {discountTotal: total, discounted: discountFlag, discountType: allPromotions[0].type};
};

const checkPromotions = (relatedItems) => {
  let total = 0;
  relatedItems.forEach(item => {
    total += item.price * item.count;
  });
  const itemsOnDiscount = allPromotions[1].items;
  let halfDiscount = takeHalfDiscount(relatedItems, itemsOnDiscount);
  let minusDiscount = takeMinusDiscount(relatedItems);
  if(halfDiscount.discountTotal <= minusDiscount.discountTotal){
    halfDiscount.total = total;
    return halfDiscount;
  }else{
    minusDiscount.total = total;
    return minusDiscount;
  }
};

const printReceipt = (relatedItems, discountInfo) => {
  let receiptStr = '============= 订餐明细 =============\n';
  relatedItems.forEach(item => {
    receiptStr += `${item.name} x ${item.count} = ${item.price * item.count}元\n`
  });
  receiptStr += '-----------------------------------\n';
  if(discountInfo.discounted){
    receiptStr += '使用优惠:\n';
    receiptStr += `${discountInfo.discountType}，省${discountInfo.total - discountInfo.discountTotal}元\n`;
    receiptStr += '-----------------------------------\n';
  }
  receiptStr += `总计：${discountInfo.discountTotal}元\n`;
  receiptStr += '==================================='
  return receiptStr;
};

const bestCharge = (itemIds) => {
  let readResult = readItemIds(itemIds);
  let relatedItems = findRelatedItems(readResult);
  let discountInfo = checkPromotions(relatedItems);
  return printReceipt(relatedItems, discountInfo);
};

module.exports = {bestCharge, readItemIds, checkPromotions, findRelatedItems, takeHalfDiscount, takeMinusDiscount};
