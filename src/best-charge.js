const promotions = require('./promotions');
const items = require('./items')

const allPromotions = promotions.loadPromotions();
const allItems = items.loadAllItems();

function readItemIds(itemIds){
  return itemIds.reduce((prev, item) => {
    if(item.split('x')[0].trim() in prev){
      prev[item.split('x')[0].trim()]++;
    }else{
      prev[item.split('x')[0].trim()] = parseInt(item.split('x')[1]);
    }
    return prev;
  }, {});
}


function findRelatedItems(readResult){
  let relatedItems = [];
  allItems.forEach(item => {
    if(readResult[item.id]){
      let temp = item;
      temp.count = readResult[item.id];
      relatedItems.push(temp);
    }
  });
  console.log(relatedItems)
  return relatedItems;
}

function takeHalfDiscount(relatedItems, itemsOnDiscount){

}

function takeMinusDiscount(relatedItems) {

}

function checkPromotions(relatedItems) {

}

function bestCharge(itemIds) {

  return /*TODO*/;
}

module.exports = {bestCharge};
