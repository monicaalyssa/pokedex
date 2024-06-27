let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  const jsonFilePath = "images/imageurls.json";

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("Pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }

  function fetchJson(uppercaseName, listItem) {
    fetch(jsonFilePath)
      .then((response) => {
        if (!response.ok) {
          console.error("Fetch error:", response.status, response.statusText);
          throw new Error("Response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        searchImage(jsonData.Links, uppercaseName, listItem);
      })
      .catch((error) => {
        console.error("Error fetching or parsing JSON:", error);
      });
  }

  function addListItem(pokemon) {
    let pokemonListGrid = document.querySelector("ul");
    pokemonListGrid.classList.add("pokemon-grid");

    let listItem = document.createElement("li");
    uppercaseName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    let pokemonBoxName = document.createElement("p");
    pokemonBoxName.innerText = uppercaseName;
    pokemonBoxName.classList.add("pokemon-name");
    listItem.appendChild(pokemonBoxName);
    listItem.classList.add("pokemon-grid-item");
    pokemonListGrid.appendChild(listItem);

    let button = document.createElement("button");
    button.classList.add("btn", "btn-secondary", "btn-sm");
    button.innerText = "See details";

    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#exampleModal");
    listItem.appendChild(button);

    fetchJson(uppercaseName, listItem);

    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  function searchImage(individualLinks, uppercaseName, listItem) {
    let checked = false;
    for (let i = 0; i < individualLinks.length; i++) {
      let currentItem = individualLinks[i];
      if (currentItem.PhotoLink.includes(uppercaseName)) {
        console.log("Found");
        let pokemonImg = document.createElement("img");
        pokemonImg.classList.add("pokemon-image");
        pokemonImg.classList.add(uppercaseName + "-image");
        pokemonImg.src = currentItem.PhotoLink;
        pokemonImg.setAttribute("width", 100);
        pokemonImg.setAttribute("height", 100);
        listItem.appendChild(pokemonImg);
        break;
      }

      function pokemonsConditions(link) {
        let pokemonImg = document.createElement("img");
        pokemonImg.classList.add("pokemon-image");
        pokemonImg.src = link;
        pokemonImg.classList.add(uppercaseName + "-image");
        pokemonImg.setAttribute("width", 100);
        pokemonImg.setAttribute("height", 100);
        listItem.appendChild(pokemonImg);
      }
      if (currentItem.PhotoLink.includes("Nidoran")) {
        if (uppercaseName == "Nidoran-f" && checked == false) {
          pokemonsConditions(
            "https://archives.bulbagarden.net/media/upload/b/b2/0029Nidoran.png"
          );
          checked = true;
        } else if (uppercaseName == "Nidoran-m" && checked == false) {
          pokemonsConditions(
            "https://archives.bulbagarden.net/media/upload/8/8c/0032Nidoran.png"
          );
          checked = true;
        }
      }
      if (
        currentItem.PhotoLink.includes("Farfetch") &&
        uppercaseName == "Farfetchd"
      ) {
        pokemonsConditions(
          "https://archives.bulbagarden.net/media/upload/9/99/0083Farfetch%27d.png"
        );
        break;
      }
      if (
        currentItem.PhotoLink.includes("Mr._Mime") &&
        uppercaseName == "Mr-mime"
      ) {
        pokemonsConditions(
          "https://archives.bulbagarden.net/media/upload/f/fb/0122Mr._Mime.png"
        );
        break;
      }
    }
  }

  function searchPokemon() {
    let $searchBar = $("#input");

    $searchBar.on("input", function () {
      let searchValue = $searchBar.val().toLowerCase();
      let filteredPokemon = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchValue)
      );
      let $pokemonListElement = $(".pokemon-grid");
      $pokemonListElement.empty();

      if (filteredPokemon.length === 0) {
        let message = $("<p>No results</p>");
        message.addClass("no-results");
        $pokemonListElement.append(message);
      } else {
        filteredPokemon.forEach((pokemon) => {
          addListItem(pokemon);
        });
      }
    });
  }
  searchPokemon();

  let infoDiv = document.createElement("div");
  infoDiv.classList.add("info");

  function insertDecimal(num) {
    return (decimal = (num / 10).toFixed(2));
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      let modalBody = document.querySelector(".modal-body");
      let modalTitle = document.querySelector(".modal-title");
      let modalHeader = document.querySelector(".modal-header");
      let modalImage = document.querySelector(".modal-image");
      let modalHeight = document.querySelector(".modal-height");
      let modalWeight = document.querySelector(".modal-weight");
      let modalTypes = document.querySelector(".modal-types");

      let uppercaseTitle = item.name[0].toUpperCase() + item.name.slice(1);
      modalTitle.innerText = uppercaseTitle;

      let imageAttribute = document.querySelector(
        "." + uppercaseTitle + "-image"
      );
      let modalSrc = imageAttribute.getAttribute("src");
      modalImage.setAttribute("src", modalSrc);

      insertDecimal(item.height);
      modalHeight.innerText = "Height: " + decimal + " m";
      insertDecimal(item.weight);
      modalWeight.innerText = "Weight: " + decimal + " kg";
      modalTypes.innerText = "Types: ";

      modalBody.append(infoDiv);
      infoDiv.append(modalHeight);
      infoDiv.append(modalWeight);

      let array = [];

      item.types.forEach((element) => {
        typeInfo =
          element.type.name[0].toUpperCase() + element.type.name.slice(1);
        array.push(typeInfo);
      });
      let show = document.createElement("span");
      show.innerText = array.join(", ");

      modalTypes.appendChild(show);
      infoDiv.appendChild(modalTypes);
      modalBody.append(modalImage);
    });
  }

  function hideModal() {
    let modalContainer = document.querySelector("#modal-container");
    modalContainer.classList.remove("is-visible");
  }

  window.addEventListener("keydown", (e) => {
    let modalContainer = document.querySelector("#modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.height = details.height;
        item.types = details.types;
        item.weight = details.weight;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    fetchJson: fetchJson
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
