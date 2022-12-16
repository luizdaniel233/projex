class Search {
  searchListUser(data, list) {
    const new_list = [];
    list.forEach((element) => {
      if (
        element.user_name.toUpperCase().includes(data.search.toUpperCase()) ||
        element.user_enrollment
          .toUpperCase()
          .includes(data.search.toUpperCase())
      )
        new_list.push(element);
    });

    return new_list;
  }
}

module.exports = new Search();
