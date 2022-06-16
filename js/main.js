var M = {
  //permet de d'afficher les information concernant le flux
  deal_with_rss_items: function(items, data, i){
    let item = items[i];
    let clone = document.querySelector('template').content.cloneNode(true);
    clone.querySelector(".image").src = item.enclosure["@attributes"].url;
    clone.querySelector(".titre").textContent = item.title;
    //let date = new Date(item.pubDate);
    //clone.querySelector(".date").textContent = date.toLocaleString()
    //C.tabDates.push(date.toLocaleString())
    clone.querySelector(".description").textContent = item.description;
    clone.querySelector(".lien").href = item.link;
    M.page = document.getElementById("article_container")
    M.page.appendChild(clone);
  },
  deal_with_rss_itemsCroissant: function(data){
    let items = data.channel.item
    for (let i = 0 ; i < items.length ; i ++) {
      M.deal_with_rss_items(items, data, i)
    }
  },
  deal_with_rss_itemsDecroissant: function(data){
    let items = data.channel.item
    for (let i = items.length - 1 ; i > -1 ; i --) {
      M.deal_with_rss_items(items, data, i)
    }
  },
  //permet de récupérer le flux
  ajax_get: function(url, callback){
    var xhr = new XMLHttpRequest();
    var handler_load = function(){
      var data = JSON.parse(this.responseText);
      callback(data);
    }
    xhr.addEventListener('load', handler_load);
    xhr.open("GET", "https://gamesnews.alexis-gousseau.com/php/fluxrss.php?flux=" + url, true);
    // xhr.open("GET", "http://localhost/gamesnews/php/fluxrss.php?flux=" + url, true);
    xhr.send();
  },
  //permet de supprimer tous les enfants ayant la balise 'article'
  delete: function(){
    let AllChildren = document.querySelectorAll("article")
    for (let y = 0 ; y < AllChildren.length ; y ++) {
      M.page.removeChild(AllChildren[y]);
    }
  },
  refreshFlux: function(){
    for (let i = 0 ; i < C.tabListe.length ; i ++) {
      C.tabListe[i].addEventListener("click", function(){
        C.afficherFlux(i)
      })
    }
  }
}

var C = {
  tabListe : [],
  tabFlux : ["https://www.jeuxactu.com/rss/ja.rss", "https://www.jeuxactu.com/rss/pc.rss", "https://www.jeuxactu.com/rss/ps5.rss", "https://www.jeuxactu.com/rss/xbox-series-x.rss", "https://www.jeuxactu.com/rss/switch.rss"],
  tabFluxFav : [],
  tabFluxAjoute : [],
  tabNames : ["Toutes les catégories", "PC", "PS5", "XBOX SERIES X", "Switch"],
  tabNamesFav : [],
  tabNamesAjoute : [],
  tabCheckboxs : [],
  //tabDates : [],
  stateChange: true,
  k: 0,
  z: 0,

  //permet de d'initialiser le controller
  init: function(){
    V.init()
    V.createLiBase()
    M.ajax_get(C.tabFlux[0], M.deal_with_rss_itemsCroissant)
    V.designMenu(0)
    M.refreshFlux()
  },
  //permet de d'afficher en fonction du flux
  afficherFlux: function(i){
    if(V.filtreDate.selectedIndex == 0){
      M.delete()
      M.ajax_get(C.tabFlux[i], M.deal_with_rss_itemsCroissant)
    }
    if(V.filtreDate.selectedIndex == 1){
      M.delete()
      M.ajax_get(C.tabFlux[i], M.deal_with_rss_itemsDecroissant)
    }
    V.designMenu(i)
  },
  //permet de sauvegarder en local des données
  handler__restore: function(){
    localStorage.setItem("urls", JSON.stringify(C.tabFluxFav))
    C.tabFluxAjoute = localStorage.getItem("urls")
    C.tabFluxAjoute = JSON.parse(C.tabFluxAjoute)
    localStorage.setItem("names", JSON.stringify(C.tabNamesFav))
    C.tabNamesAjoute = localStorage.getItem("names")
    C.tabNamesAjoute = JSON.parse(C.tabNamesAjoute)
  },
  //permet de d'ajouter ou supprimer des informations en fonction de la checkbox cochée
  handler__eventCheckbox: function(){
    V.categoriesLiFavs = document.querySelectorAll(".categoriesLiFav")
    for (let y = 0 ; y < V.categoriesLiFavs.length ; y ++) {
      V.categoriesLiFavs[y].remove()
      C.tabFluxFav.splice(C.tabFlux[y])
      C.tabFluxFav.splice(C.tabFluxAjoute[y])
      C.tabNamesFav.splice(C.tabNames[y])
      C.tabNamesFav.splice(C.tabNamesAjoute[y])
      C.handler__restore()
    }
    for (let i = 0 ; i < C.tabCheckboxs.length ; i ++) {
      if(C.tabCheckboxs[i].checked == true){
        var li = document.createElement("li")
        li.textContent = C.tabNames[i + 4]
        li.classList = "categoriesLiFav"
        li.id = i
        document.querySelector(".categories__favoris").appendChild(li)
        C.tabFluxFav.push(C.tabFlux[i + 4])
        C.tabNamesFav.push(C.tabNames[i + 4])
        C.handler__restore()
      }
    }
  },
  handler__search: function(){
    var input, filter, articles, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    articles = document.querySelectorAll("article");
    li = document.querySelectorAll(".detail");
    for (i = 0 ; i < li.length ; i ++) {
      a = li[i].getElementsByTagName("h3")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        articles[i].style.display = "";
      } else {
        articles[i].style.display = "none";
      }
    }
  },
  checkResponsible: function(){
    V.getElement()
    C.k = C.k + 1
    C.z = C.z + 1
    if(window.matchMedia("(max-width: 1000px)").matches){
      if(C.z == 1){
        V.ouvertureAdd = "true"
        V.handler__add()
      }
      V.responsibleDesign()
    }
    else{
      V.nav.style.transform = "translateX(0)"
      C.k = 0
      C.z = 0
      if(C.stateChange){
        V.normalDesign()
      }
      else
        V.vignetteDesign()
    }
  }
}

var V = {
  p : -1,

  //permet d'initialiser la vue
  init: function(){
    C.tabFluxAjoute = localStorage.getItem("urls")
    C.tabFluxAjoute = JSON.parse(C.tabFluxAjoute)
    C.tabNamesAjoute = localStorage.getItem("names")
    C.tabNamesAjoute = JSON.parse(C.tabNamesAjoute)
    V.inputFlux = document.querySelector(".main__btnadd")
    V.inputName = document.querySelector(".addsup")
    V.inputValider = document.querySelector(".main__btnValider")
    V.categoriesListe = document.querySelector(".categories__liste")
    V.categoriesFavoris = document.querySelector(".categories__favoris")
    V.inputValider.addEventListener("click", V.handler__inputValue)
    V.filtreDate = document.querySelector(".filtre__date")
    V.filtreBtnValider = document.querySelector(".filtre__btnValider")
    V.filtreBtnValider.addEventListener("keyup", C.handler__search)
    V.addcat = document.querySelector(".SVGajouterCat")
    V.main = document.querySelector(".main")
    V.addcat.addEventListener("click", V.handler__add)
    V.buttonChange1 = document.querySelector(".changemode1")
    V.buttonChange2 = document.querySelector(".changemode2")
    V.bouton = document.querySelector(".changemode")
    V.buttonChange1.addEventListener("click", function(){V.transitionDesign(0)})
    V.buttonChange2.addEventListener("click", function(){V.transitionDesign(1)})
    V.page = document.getElementById("article_container")
    V.parameter = document.querySelector(".parameter")
    V.nav = document.querySelector(".navigation")
    V.navliste = document.querySelector(".categories__liste")
    V.svgmenu = document.querySelector(".SVGajouterCat")
    V.btnvalid = document.querySelector(".main__btnValider")
    V.btnFermer = document.querySelector(".btnFermer")
    V.btnMenu = document.querySelector(".btnMenu")
    V.btnMenu.addEventListener("click", function(){
      V.nav.style.transform = "translateX(0)"
    })
    V.btnFermer.addEventListener("click", function(){
      V.nav.style.transform = "translateX(100%)"
    })
    //permet de récupérer les informations stockées en local
    if(C.tabFluxAjoute != null){
      V.p = 3
      for (let i = 0 ; i < C.tabFluxAjoute.length ; i ++) {
          C.tabFlux.push(C.tabFluxAjoute[i])
          C.tabNames.push(C.tabNamesAjoute[i])
          var li = document.createElement("li")
          li.textContent = C.tabNames[i + 4]
          li.classList = "categoriesLiFav"
          li.id = i
          document.querySelector(".categories__favoris").appendChild(li)
      }
    }
  },
  //permet d'ajouter les informations aux favoris
  handler__inputValue: function(){
    V.p = V.p + 1
    V.valueFlux = V.inputFlux.value
    V.valueName = V.inputName.value
    C.tabFlux.push(V.valueFlux)
    C.tabNames.push(V.valueName)
    if(V.valueFlux !== "" | V.valueName !== ""){
      var li = document.createElement("li")
      li.textContent = V.valueName
      li.id = V.p
      li.className = "liMenu"
      li.addEventListener("click", function(){
        C.afficherFlux(li.id)
      })
      V.valueFlux.innertHtml = ""
      V.valueName.textContent = ""
    }
    document.querySelector(".categories__liste").appendChild(li)
    C.tabListe.push(li)
    var label = document.createElement('label')
    label.classList = "container"
    document.querySelector(".categories__liste").appendChild(label)
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox"
    checkbox.classList = "checkbox"
    checkbox.id = V.p;
    checkbox.addEventListener("click", C.handler__eventCheckbox)
    label.appendChild(checkbox)
    var span = document.createElement('span')
    span.classList = "checkmark"
    label.appendChild(span)
    C.tabCheckboxs.push(checkbox)
  },
  //permet de créer des li avec des checkboxs
  createLiBase: function(){
    for (let i = 0; i < C.tabNames.length; i++) {
      V.p = V.p + 1
      var li = document.createElement("li")
      li.textContent = C.tabNames[i]
      li.id = V.p
      li.className = "liMenu"
      document.querySelector(".categories__liste").appendChild(li)
      C.tabListe.push(li)
      if(i > 4){
        var label = document.createElement('label')
        label.classList = "container"
        document.querySelector(".categories__liste").appendChild(label)
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox"
        checkbox.classList = "checkbox"
        checkbox.id = V.p
        checkbox.checked = true
        checkbox.addEventListener("click", C.handler__eventCheckbox)
        label.appendChild(checkbox)
        var span = document.createElement('span')
        span.classList = "checkmark"
        label.appendChild(span)
        C.tabCheckboxs.push(checkbox)
      }
    }
  },
  handler__add : function(){
    if(V.ouvertureAdd){
      V.ouvertureAdd = false
      V.main.classList.remove("main__activated")
      V.parameter.classList.remove("parameter__activated")
      V.addcat.classList.remove("SVGajouterCatActivated")
    }
    else{
      V.ouvertureAdd = true
      V.main.classList.add("main__activated")
      V.parameter.classList.add("parameter__activated")
      V.addcat.classList.add("SVGajouterCatActivated")
    }
  },
  getElement:function(){
    V.article = document.getElementsByClassName("article")
    V.sous_article = document.getElementsByClassName("lien")
    V.image = document.getElementsByClassName("image")
    //V.date = document.getElementsByClassName("date")
    V.description = document.getElementsByClassName("description")
    V.detail = document.getElementsByClassName("detail")
    V.titre = document.getElementsByClassName("titre")
  },
  transitionDesign: function(target){
    V.page.style.opacity = "0"
    setTimeout(function(){
      if(target === 1)
        V.vignetteDesign()
      else
        V.normalDesign()
      V.page.style.opacity = "1"
    }, 300)
  },
  vignetteDesign: function(){
    C.stateChange = false
    V.buttonChange1.style.backgroundColor = "#1D1D1D"
    V.buttonChange2.style.backgroundColor = "#2CAB5B"

    V.page.style.display = "flex"
    V.page.style.flexWrap = "wrap"
    V.page.style.flexDirection = "row"
    V.page.style.justifyContent = "center"
    V.page.style.alignItems = "center"

    V.bouton.style.display = "flex"

    for(let i = 0; i < V.article.length; i++){
      V.sous_article[i].style.width = "35rem"
      V.sous_article[i].style.height = "30rem"
      V.sous_article[i].style.flexDirection = "column";

      V.article[i].style.margin = "5rem";

      V.image[i].style.width = "35rem"
      V.image[i].style.height = "auto"
      V.image[i].style.borderRadius = "20px 20px 0 0";

      //V.date[i].style.display = "none"

      V.description[i].style.display = "none"

      V.detail[i].style.width = "35rem"
      V.detail[i].style.height = "35rem"

      V.titre[i].style.width = "100%"
      V.titre[i].style.fontSize = "1.6rem"
    }
  },
  normalDesign: function(){
    C.stateChange = true

    V.buttonChange1.style.backgroundColor = "#2CAB5B"
    V.buttonChange2.style.backgroundColor = "#1D1D1D"
    V.page.style.display = "block"

    V.bouton.style.display = "flex"

    for(let i = 0; i < V.article.length; i++){
      V.sous_article[i].style.width = "75vw"
      V.sous_article[i].style.maxWidth = "100rem"
      V.sous_article[i].style.height = "15rem"
      V.sous_article[i].style.flexDirection = "row";

      V.article[i].style.margin = "6rem";

      V.image[i].style.width = "auto"
      V.image[i].style.height = "15rem"
      V.image[i].style.borderRadius = "20px 0 0 20px";

      //V.date[i].style.display = "initial"
      //V.date[i].style.fontSize = "1.6rem"

      V.description[i].style.fontSize = "1.6rem"
      V.description[i].style.display = "initial"

      V.detail[i].style.width = "50vw"
      V.detail[i].style.maxWidth = "100rem"
      V.detail[i].style.height = "15rem"

      V.titre[i].style.width = "auto"
      V.titre[i].style.fontSize = "1.6rem"
    }
  },
  designMenu: function(i){
    let x = document.querySelectorAll(".liMenu")
    for(let j = 0; j < C.tabListe.length; j++){
      if(j == i){
        x[j].style.color = "#2CAB5B"
      }
      else{
        x[j].style.color = "#ffffff"
      }
    }
  },
  responsibleDesign: function(){
    V.page.style.display = "flex"
    V.page.style.flexWrap = "wrap"
    V.page.style.flexDirection = "row"
    V.page.style.justifyContent = "center"
    V.page.style.alignItems = "center"

    V.bouton.style.display = "none";

    for(let i = 0; i < V.article.length; i++){
      V.sous_article[i].style.width = "70vw"
      V.sous_article[i].style.height = "auto"
      V.sous_article[i].style.flexDirection = "column";

      V.article[i].style.margin = "5rem";

      V.image[i].style.width = "70vw"
      V.image[i].style.height = "auto"
      V.image[i].style.borderRadius = "10px 10px 0 0";

      //V.date[i].style.display = "none"

      V.description[i].style.display = "none"

      V.detail[i].style.width = "70vw"
      V.detail[i].style.height = "auto"

      V.titre[i].style.width = "100%"
      V.titre[i].style.fontSize = "2vh"
    }
  }
};

C.init()

setInterval(C.checkResponsible, 1)
