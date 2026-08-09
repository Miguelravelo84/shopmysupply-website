const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'));});
  document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

const form=document.querySelector('#contact-form');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const d=new FormData(form);
    const subject=encodeURIComponent('Website inquiry from '+(d.get('name')||'visitor'));
    const body=encodeURIComponent('Name: '+(d.get('name')||'')+'\nEmail: '+(d.get('email')||'')+'\nCompany: '+(d.get('company')||'')+'\n\n'+(d.get('message')||''));
    window.location.href='mailto:sales@shopmysupply.com?subject='+subject+'&body='+body;
  });
}

document.querySelector('#year').textContent=new Date().getFullYear();

// Full taxonomy. A subcategory is shown to shoppers ONLY when it contains at least one active product.
const CATEGORY_TAXONOMY={
  'automotive':{name:'Automotive',subcategories:['Car Care & Detailing','Fluids & Additives','Interior Accessories','Exterior Accessories','Maintenance Parts','Tools & Equipment']},
  'tools-hardware':{name:'Tools & Hardware',subcategories:['Hand Tools','Power Tool Accessories','Hardware & Fasteners','Shop Equipment','Safety & PPE','Storage & Organization']},
  'home-living':{name:'Home & Living',subcategories:['Cleaning Supplies','Kitchen & Dining','Storage & Organization','Laundry','Bathroom','Home Essentials']},
  'grocery':{name:'Grocery',subcategories:['Coffee & Tea','Snacks','Beverages','Pantry Staples','Candy & Chocolate','Breakfast Foods','Condiments & Sauces','Baking','Canned & Packaged Foods']},
  'toys-games':{name:'Toys & Games',subcategories:['Action Figures & Collectibles','Building Toys','Dolls & Playsets','Games & Puzzles','Arts & Crafts','Outdoor & Sports Toys','Preschool Toys','Vehicles & Remote Control']},
  'hair-beauty':{name:'Hair & Beauty',subcategories:['Hair Care','Skin Care','Personal Care','Styling','Grooming','Beauty Tools & Accessories']},
  'health-fitness':{name:'Health & Fitness',subcategories:['Fitness Accessories','Wellness','Recovery & Mobility','Sports Nutrition','Vitamins & Supplements','Exercise Equipment']},
  'pet-supplies':{name:'Pet Supplies',subcategories:['Dog Food & Treats','Dog Toys','Dog Grooming','Dog Collars, Leashes & Harnesses','Dog Beds & Accessories','Cat Food & Treats','Cat Litter & Litter Supplies','Cat Toys','Cat Grooming','Cat Beds & Accessories','Small Animal Supplies','Bird Supplies','Fish & Aquarium Supplies','Pet Health & Wellness','Cleaning & Odor Control']}
};

// PRODUCT DATA
// Add each item here when inventory is purchased. Required fields:
// id, name, category, subcategory, price, image, active
// Example (leave commented until the product is actually in inventory):
// {id:'coffee-001',name:'Example Coffee',category:'grocery',subcategory:'Coffee & Tea',price:14.99,image:'assets/products/coffee-001.jpg',active:true}
const PRODUCTS=[];

const catalogTitle=document.querySelector('#catalog-title');
const catalogIntro=document.querySelector('#catalog-intro');
const subcategoryNav=document.querySelector('#subcategory-nav');
const productGrid=document.querySelector('#product-grid');
const catalogEmpty=document.querySelector('#catalog-empty');
let selectedCategory=null;
let selectedSubcategory=null;

function activeProductsForCategory(category){
  return PRODUCTS.filter(p=>p.active!==false&&p.category===category);
}

function availableSubcategories(category){
  const active=activeProductsForCategory(category);
  const configured=(CATEGORY_TAXONOMY[category]||{}).subcategories||[];
  return configured.filter(sub=>active.some(p=>p.subcategory===sub));
}

function renderProducts(category,subcategory=null){
  if(!productGrid||!catalogEmpty)return;
  const items=activeProductsForCategory(category).filter(p=>!subcategory||p.subcategory===subcategory);
  productGrid.innerHTML='';
  if(!items.length){catalogEmpty.hidden=false;return;}
  catalogEmpty.hidden=true;
  items.forEach(p=>{
    const card=document.createElement('article');
    card.className='product-card';
    const image=p.image?`<img src="${p.image}" alt="${p.name}">`:'<div class="product-image-placeholder">MY</div>';
    card.innerHTML=`${image}<div class="product-card-body"><span class="product-subcategory">${p.subcategory}</span><h3>${p.name}</h3>${typeof p.price==='number'?`<strong class="product-price">$${p.price.toFixed(2)}</strong>`:''}<a href="#contact" class="text-link">Ask about this product →</a></div>`;
    productGrid.appendChild(card);
  });
}

function renderCatalog(category){
  if(!CATEGORY_TAXONOMY[category]||!subcategoryNav)return;
  selectedCategory=category;
  selectedSubcategory=null;
  const meta=CATEGORY_TAXONOMY[category];
  const subs=availableSubcategories(category);
  catalogTitle.textContent=meta.name;
  catalogIntro.textContent=subs.length?'Browse available products by subcategory.':'New products are coming soon.';
  subcategoryNav.innerHTML='';
  if(subs.length){
    const all=document.createElement('button');
    all.type='button'; all.className='subcategory-pill active'; all.textContent='All';
    all.addEventListener('click',()=>selectSubcategory(null));
    subcategoryNav.appendChild(all);
    subs.forEach(sub=>{
      const btn=document.createElement('button');
      btn.type='button'; btn.className='subcategory-pill'; btn.textContent=sub;
      btn.addEventListener('click',()=>selectSubcategory(sub));
      subcategoryNav.appendChild(btn);
    });
  }
  renderProducts(category);
}

function selectSubcategory(subcategory){
  selectedSubcategory=subcategory;
  document.querySelectorAll('.subcategory-pill').forEach(btn=>btn.classList.toggle('active',subcategory===null?btn.textContent==='All':btn.textContent===subcategory));
  renderProducts(selectedCategory,subcategory);
}

document.querySelectorAll('.category-card[data-category]').forEach(card=>{
  if(card.dataset.active==='false'){
    card.setAttribute('aria-hidden','true');
    card.setAttribute('tabindex','-1');
  }
  card.addEventListener('click',()=>renderCatalog(card.dataset.category));
});
