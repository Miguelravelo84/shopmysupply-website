# MY Supply Co Website

Official website for MY Supply Co.

## Product-driven categories and subcategories
The site now includes a complete category/subcategory taxonomy in `assets/script.js`.

Subcategories are **not shown to shoppers unless they contain at least one active product**. When you buy inventory, add the product to the `PRODUCTS` array in `assets/script.js` with its matching `category` and `subcategory`. The correct subcategory button will then appear automatically.

Example:
```js
{id:'coffee-001',name:'Example Coffee',category:'grocery',subcategory:'Coffee & Tea',price:14.99,image:'assets/products/coffee-001.jpg',active:true}
```

Set `active:false` to remove a product from the storefront without deleting its record.


## Customer-facing empty states
Empty categories now use customer-facing “Products coming soon” messaging. Product-driven subcategory visibility is unchanged.
