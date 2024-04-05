// Récuperation des produits du fichier json
const reponse = await fetch("data.json");
const produits = await reponse.json();
//FIN
const listCartHTML = document.querySelector(".listCart");
const iconCardSpan = document.querySelector(".icon-card span");
const sectionProduitsGridItem = document.querySelector(".section-produits-grid-item"); 

let carts = [];

// ======================Les notifications, Ajout, Suppression, et vidage du panier========================
const ajout_Notification = document.querySelector(".ajout_notification"); 
const supprimer_Notification = document.querySelector(".supprimer_notification"); 
const clear_Notification = document.querySelector(".clear_panier_notification"); 
const clear_Card = document.querySelector(".clear_card"); 
const total = document.querySelector(".total"); 





// ===========================FIN===================================
const sectionProduits = document.querySelector(".section-produits");
// Création de la function pour afficher les produits
function afficherArticle(produits) {
  sectionProduits.innerHTML = "";

  for (let i = 0; i < produits.length; i++) {
    const article = produits[i];

    const productId = i + 1;
    sectionProduits.innerHTML += `<div data-id="${i + 1}" class="section-produits-grid-item">
    <img class="img-article" src=${article.image} alt="Image des produits" />
    <div class="div-starts-box">
    <div class="div-starts">
    <i class="fa fa-star star" data-rating="1" aria-hidden="true"></i>
    <i class="fa fa-star star" data-rating="2" aria-hidden="true"></i>
    <i class="fa fa-star star" data-rating="3" aria-hidden="true"></i>
    <i class="fa fa-star star" data-rating="4" aria-hidden="true"></i>
    <i class="fa fa-star star" data-rating="5" aria-hidden="true"></i>
    </div>
    </div>
    <div class="section-produits-details">
    <div data-img=" class="nom-article">${article.nom}</div>
    <div class="prix-article">${article.prix} FCFA</div>
    <button class="addCart">Add to card</button>
    </div>
    </div>`; 

     // ========== Je récupére les valeurs depuis le localStorage lors du chargement de la page ==================
     const starts = document.querySelectorAll(`.section-produits-grid-item[data-id="${productId}"] .div-starts i`);
     const etoileMapFromStorage = JSON.parse(localStorage.getItem(`etoileMap_${productId}`));
 

    if (etoileMapFromStorage) {
      for (let j = 0; j < starts.length; j++) {
        if (etoileMapFromStorage[j]) {
          starts[j].classList.remove("desactive");
          starts[j].classList.add("active");
        }
      }
    }

  };
  const starts = document.querySelectorAll(".div-starts i");
  
  // ===============================================

  starts.forEach((start, index1) => {
    start.addEventListener("click", (e) => {
      let parentEtoileCard = e.target.parentElement;
      let EtoileParent = parentEtoileCard.querySelectorAll("i");
      let check = false;
  
      let etoileMap = [];
  
      for (let i = 0; i < EtoileParent.length; i++) {
        let etoileElement = EtoileParent[i];
        if (!check) {
          etoileElement.classList.remove("desactive");
          etoileElement.classList.add("active");
  
          if (etoileElement === e.target)  check = true;
        } else {
          etoileElement.classList.remove("active");
          etoileElement.classList.add("desactive");
        }
  
        // Ajouter la valeur au tableau
        etoileMap.push(etoileElement.classList.contains('active'));
      }
  
      // À ce stade, etoileMap contient les valeurs true ou false
      //=============== Je met dans le localStorage
      const productId = parentEtoileCard.closest('.section-produits-grid-item').dataset.id;
      localStorage.setItem(`etoileMap_${productId}`, JSON.stringify(etoileMap));
    });
  });
  
  // ================== Récupérer les valeurs depuis le localStorage lors du chargement de la page =================
  window.addEventListener('load', () => {
    starts.forEach((start, index1) => {
      const parentEtoileCard = start.parentElement.parentElement;
      const productId = parentEtoileCard.dataset.id;
      const etoileMapFromStorage = JSON.parse(localStorage.getItem(`etoileMap_${productId}`));
  
      if (etoileMapFromStorage) {
        for (let i = 0; i < starts.length; i++) {
          if (etoileMapFromStorage[i]) {
            starts[i].classList.remove("desactive");
            starts[i].classList.add("active");
          }
        }
      }
    });
  });
  // ======================================================
};
  sectionProduits.addEventListener("click", (event) => {
let positionClick = event.target;
if (positionClick.classList.contains('addCart')) {
  let product_id = positionClick.closest('.section-produits-grid-item').dataset.id;
    addToCart(product_id, produits);
// =============================== Ajout du poppup "Ajouter au panier ================================"
    function poppupAjouter() {
      ajout_Notification.style.visibility = "visible";
    }

    setTimeout(poppupAjouter, 1000);

    function closepoppupAjouter() {
      ajout_Notification.style.visibility = "hidden";
    }
    setTimeout(closepoppupAjouter, 4000);
   // ============================FIN======================================
};
  });

  // ================
// ========================== Calcule du Total ET fonction d'ajout des produits au panier =============================================

// Fonction pour calculer la somme totale
const calculerTotal = () => {
  let sommeTotal = 0;

  if (carts.length > 0) {
    carts.forEach(cart => {
      let positionProduct = produits.findIndex((value) => value.id == cart.product_id);
      let info = produits[positionProduct];
      sommeTotal += info.prix * cart.quantity;
    });
  }

  return sommeTotal;
};

// Mettre à jour le total lors des modifications du panier
const mettreAJourTotal = () => {
  const sommeTotale = calculerTotal();
  total.innerText = ""
  total.innerText = `Total: ${sommeTotale} FCFA`;
  // Stocker le total dans le localStorage
  localStorage.setItem('total', sommeTotale);
};

// Récupérer le total depuis le localStorage lors du chargement de la page
const totalLocalStorage = localStorage.getItem('total');
if (totalLocalStorage) {
  total.innerText = `Total: ${totalLocalStorage} FCFA`;
}

// Appeler la fonction pour la première fois
mettreAJourTotal();

// Modifier la fonction d'ajout au panier pour mettre à jour le total
const addToCart = (product_id, produits) => {
  let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
  if (carts.length <= 0) {
    carts = [{
      product_id: product_id,
      quantity: 1
    }]
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1
    });
  } else {
    carts[positionThisProductInCart].quantity += 1;
  }
  addCardToHTML(produits);
  addCartMemory();
  console.log(carts);
  mettreAJourTotal(); // Mettre à jour le total après chaque modification du panier
};


// =========================== FIN ============================================================
const addCartMemory = () =>{
 localStorage.setItem('cart', JSON.stringify(carts));
}
afficherArticle(produits);

const addCardToHTML = ()=> {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity = totalQuantity + cart.quantity
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = produits.findIndex((value) => value.id == cart.product_id);
      let info = produits[positionProduct];
      newCart.innerHTML = `
      <div class="image">
          <img src="${info.image}" alt="">
      </div>
      <div class="name">
      ${info.nom}
      </div>
      <div class="totalPrice">
      ${info.prix * cart.quantity}
      </div>
      <div class="quantity">
          <span class="minus"><</span>
          <span>${cart.quantity}</span>
          <span class="plus">></span>
      </div>

      `;
      console.log()
      listCartHTML.appendChild(newCart);
    });
  };
  iconCardSpan.innerText = totalQuantity;
};
if (localStorage.getItem('cart')) {
   carts = JSON.parse(localStorage.getItem('cart'));
   addCardToHTML();
};
listCartHTML.addEventListener('click', (event) => {
let positionClick = event.target;
if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
let product_id = positionClick.parentElement.parentElement.dataset.id;
let type ='minus';
if (positionClick.classList.contains('plus')) {
  type ='plus';
}
changeQuantity(product_id, type);
}
})
const changeQuantity = (product_id, type)=> {
  let PositionItemInCart = carts.findIndex((value) => value.product_id == product_id);
  if (PositionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        carts[PositionItemInCart].quantity = carts[PositionItemInCart].quantity + 1;
        mettreAJourTotal();
        break;
    
      default:
        mettreAJourTotal();
        let valueChange = carts[PositionItemInCart].quantity -1;
        // ============================================================================================================== Décrementer total
        if (valueChange > 0) {
          carts[PositionItemInCart].quantity = valueChange;
          mettreAJourTotal();
        }else{
          carts.splice(PositionItemInCart, 1);
          mettreAJourTotal();
          // =============================== Ajout du poppup "Suppression des élements du panier ================================"
    function poppupSupprimer() {
      supprimer_Notification.style.visibility = "visible";
    }

    setTimeout(poppupSupprimer, 1000);

    function closepoppupSupprimer() {
      supprimer_Notification.style.visibility = "hidden";
    }
    setTimeout(closepoppupSupprimer, 4000);
   // ============================FIN======================================
        }
        break;
    };
  };
  addCartMemory();
  addCardToHTML();
};
afficherArticle(produits);
// FIN
/* //Initiliasztion et stockage des produits dans le localstorage
const produitsLocale = JSON.parse(localStorage.getItem("produits")) || [];
// Ajout des produits à la nouvelle variable produitsLocale
produitsLocale.push(produits);
// Je met à jour du local storage
function miseAJourLocale() {
  localStorage.setItem("produits", JSON.stringify(produitsLocale));
}
miseAJourLocale(); */
//FIN
// Création de poppup au toucher d'une des produits

const flecheBleuGauche = document.querySelector(".fleche-bleu-gauche");
const flecheOrangeDroite = document.querySelector(".fleche-orange-droite");
let imgArticle = document.querySelectorAll(".img-article");
const sliders = document.querySelector(".sliders");
sliders.style.visibility = "hidden";
const slide = document.querySelectorAll(".slide");
const imgArticleSlide = document.querySelector(".img-article-slide");
imgArticle.forEach((image) => {
  image.addEventListener("click", () => {
    sliders.style.visibility = "visible";
    imgArticleSlide.src = image.src;
  });
});
//FIN
//Création de fermeture du slide
const foisFermer = document.querySelector(".fois-fermer");
foisFermer.addEventListener("click", () => {
  sliders.style.visibility = "hidden";
});
//FIN
// Création des buttons slide des images sur clique
//Pour le bouton gauche
let indexImageActuelle = 0; // Current Image Index
flecheBleuGauche.addEventListener("click", () => {
  indexImageActuelle =
    (indexImageActuelle - 1 + imgArticle.length) % imgArticle.length;
  imgArticleSlide.src = imgArticle[indexImageActuelle].src;
});
//Pour le boutton droit
flecheOrangeDroite.addEventListener("click", () => {
  indexImageActuelle = (indexImageActuelle + 1) % imgArticle.length;
  imgArticleSlide.src = imgArticle[indexImageActuelle].src;
});

//Création des étoiles pour les avis
/* const divStarts = document.querySelectorAll('.div-starts');
divStarts.forEach((divStartsElement, articleIndex) => {
  const stars = [...divStartsElement.children].filter(child => child.className === "star");
  stars.forEach((star, starIndex) => {
    star.addEventListener('click', () => {
      stars.forEach((s, index) => {
        starIndex >= index ? s.classList.add('active') : s.classList.remove('active');
      });
      // Enregistrez les étoiles dans le localStorage pour chaque article
      const ratingData = Array.from(stars).map(s => s.classList.contains('active'));
      localStorage.setItem(userRating-${articleIndex}, JSON.stringify(ratingData));
    });
    // Récupérez et initialisez les étoiles depuis le localStorage
    const userRatingData = JSON.parse(localStorage.getItem(userRating-${articleIndex}));
    if (userRatingData && userRatingData.length === stars.length) {
      if (userRatingData[starIndex]) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    }
  });
}); */


/* const starts = document.querySelectorAll(".div-starts i");

starts.forEach((start, index1) => {
  start.addEventListener("click", (e) => {
    let parentEtoileCard = e.target.parentElement;
    let EtoileParent = parentEtoileCard.querySelectorAll("i");
    let check = false;
    
      for (let i = 0; i < EtoileParent.length; i++) {
      let etoileElement = EtoileParent[i];
      if (!check) {
      etoileElement.classList.remove("desactive");
       etoileElement.classList.add("active"); 
      
      if (etoileElement === e.target)  check = true;

      }else{
      etoileElement.classList.remove("active");
     etoileElement.classList.add("desactive"); 
      }
     
      } 
    

  });
});
 */

// Ajout de clique panier pour la listCart
let iconCart = document.querySelector(".icon-card");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
iconCart.addEventListener("click", () => {
  body.classList.toggle('showCart');
});
closeCart.addEventListener("click", () => {
body.classList.toggle('showCart');
});

// Création du burger Menu
const burger = document.querySelector(".burger");
const navUl = document.querySelector("nav ul");
burger.addEventListener("click", () => {
  navUl.style.display="flex";

  });
  // ====================Vidage de tous les produits de la cart au clique du bouton clear_Card ==========================
  clear_Card.addEventListener('click', () => {
    if(confirm('Voulez vous vraiment effacer le panier?')){
      localStorage.clear();
      listCartHTML.innerHTML = "";
      };
      // =============================== Ajout du poppup "Vidage du panier ================================"
    function poppupClear() {
      clear_Notification.style.visibility = "visible";
    }

    setTimeout(poppupClear, 1000);

    function closepoppupClear() {
      clear_Notification.style.visibility = "hidden";
    }
    setTimeout(closepoppupClear, 4000);
   // ============================FIN======================================
  })
  // ==================== FIN ==========================

// Création du filter pour les produits

const btnSearch = document.getElementById("btn-search");
const btnAll = document.querySelector(".btn-all");
const btnHuawei = document.querySelector(".btn-huawei");
const btnSamsung = document.querySelector(".btn-samsung");
const btnIphone = document.querySelector(".btn-iphone");
const btnXioami = document.querySelector(".btn-xioami");

// Pour All
btnAll.addEventListener("click", function () {
  afficherArticle(produits);
});
// Pour Huawei

let huaweiFiltrer = produits.filter(function (produit) {
  return produit.categorie === "Huawei";
});

// Event sur btnHuawei
btnHuawei.addEventListener("click", function () {
  afficherArticle(huaweiFiltrer);
});

// Pour Samsung

let samsungFiltrer = produits.filter(function (produit) {
  return produit.categorie === "Samsung";
});

// Event sur btnSamsung
btnSamsung.addEventListener("click", function () {
  afficherArticle(samsungFiltrer);
});

// Pour Iphone

let iphoneFiltrer = produits.filter(function (produit) {
  return produit.categorie === "Iphone";
});

// Event sur iphone
btnIphone.addEventListener("click", function () {
  afficherArticle(iphoneFiltrer);
});

// Pour Xioami

let xiaomiFiltrer = produits.filter(function (produit) {
  return produit.categorie === "Xiaomi";
});

// Event sur iphone
btnXioami.addEventListener("click", function () {
  afficherArticle(xiaomiFiltrer);
});

// Création du filter des produits pour l'input search
btnSearch.addEventListener("click", () => {
  let search = document.getElementById("search");
  if (
    search.value == "Huawei" ||
    search.value == "HUAWEI" ||
    search.value == "huawei"
  ) {
    afficherArticle(huaweiFiltrer);
  } else if (
    search.value == "Iphone" ||
    search.value == "IPHONE" ||
    search.value == "iphone"
  ) {
    afficherArticle(iphoneFiltrer);
  } else if (
    search.value == "samsung" ||
    search.value == "Samsung" ||
    search.value == "SAMSUNG"
  ) {
    afficherArticle(samsungFiltrer);
  } else if (
    search.value == "Xiaomi" ||
    search.value == "XIAOMI" ||
    search.value == "xiaomi"
  ) {
    afficherArticle(xiaomiFiltrer);
  }  else if (
    search.value == "All" ||
    search.value == "ALL" ||
    search.value == "all"
  ) {
    afficherArticle(produits);
  }
});

mettreAJourTotal();



/* // fonction d'ajout des produits au panier
const addToCart = (product_id, produits) => {
  let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
  if (carts.length <= 0) {
    carts = [{
      product_id: product_id,
      quantity: 1
    }]
  }else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1
    });
  }else{
    carts[positionThisProductInCart].quantity += 1;
  }
  addCardToHTML(produits);
  addCartMemory();
  console.log(carts);
} */