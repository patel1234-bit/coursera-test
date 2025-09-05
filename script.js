(function (global) {

  var dc = {};

  var homeHtmlUrl = "home-snippet.html";
  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var categoriesTitleHtml = "categories-title-snippet.html";
  var categoryHtml = "category-snippet.html";
  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var menuItemsTitleHtml = "menu-items-title.html";
  var menuItemHtml = "menu-item.html";

  // Convenience function for inserting innerHTML for 'selector'
  function insertHtml(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  }

  // Show loading icon inside element identified by 'selector'
  function showLoading(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='ajax-loader.gif'></div>";
    insertHtml(selector, html);
  }

  // Replace {{propName}} with propValue
  function insertProperty(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue || "");
    return string;
  }

  // On page load
  document.addEventListener("DOMContentLoaded", function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      homeHtmlUrl,
      function (responseText) {
        insertHtml("#main-content", responseText);
      },
      false);
  });

  // Load categories
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
  };

  // Load random category
  dc.loadRandomCategory = function () {
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (categories) {
        var randomIndex = Math.floor(Math.random() * categories.length);
        var randomCategoryShortName = categories[randomIndex].short_name;
        dc.loadMenuItems(randomCategoryShortName);
      });
  };

  // Load items for a category
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML);
  };

  // Build categories page
  function buildAndShowCategoriesHTML(categories) {
    $ajaxUtils.sendGetRequest(categoriesTitleHtml, function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(categoryHtml, function (categoryHtml) {
        var categoriesViewHtml =
          buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
        insertHtml("#main-content", categoriesViewHtml);
      }, false);
    }, false);
  }

  function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";

    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      html = insertProperty(html, "name", categories[i].name);
      html = insertProperty(html, "short_name", categories[i].short_name);
      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  // Build menu items page
  function buildAndShowMenuItemsHTML(categoryMenuItems) {
    $ajaxUtils.sendGetRequest(menuItemsTitleHtml, function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(menuItemHtml, function (menuItemHtml) {
        var menuItemsViewHtml =
          buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
        insertHtml("#main-content", menuItemsViewHtml);
      }, false);
    }, false);
  }

  function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    );
    menuItemsTitleHtml = insertProperty(
      menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions
    );

    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";

    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;

    for (var i = 0; i < menuItems.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);

      // Only in Bootstrap 3 (otherwise remove)
      if (i % 2 !== 0) {
        html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
      }

      finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
  }

  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }
    priceValue = "$" + parseFloat(priceValue).toFixed(2);
    return insertProperty(html, pricePropName, priceValue);
  }

  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }
    portionValue = "(" + portionValue + ")";
    return insertProperty(html, portionPropName, portionValue);
  }

  global.$dc = dc;

})(window);
