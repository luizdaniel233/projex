class Pagination {
  format(data, page, quantity) {
    return {
      qtdPages: Math.ceil(
        data.length / this.numberElementsPage(quantity)
      ),
      results: this.pagination(page, quantity, data),
    };
  }

  pagination(pg, qty, object) {
    const array = [],
      page = this.numberPages(pg),
      quantity = this.numberElementsPage(qty);
    for (
      let index = quantity * page - quantity;
      index < quantity * page && index < object.length;
      index++
    ) {
      array.push(object[index]);
    }
    return array;
  }

  numberPages(page) {
    if (page === 0 || !page) {
      return 1;
    } else {
      return page;
    }
  }

  numberElementsPage(quantity) {
    if (quantity === 0 || !quantity) {
      return 8;
    } else {
      return quantity;
    }
  }
}

module.exports = new Pagination();
