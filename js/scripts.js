let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

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

    button.addEventListener("click", function () {
      showDetails(pokemon);
    });

    pokemonRepository.loadDetails(pokemon).then(function () {
      let pokemonImg = document.createElement("img");
      pokemonImg.classList.add("pokemon-image");
      pokemonImg.src = pokemon.imageUrl;
      listItem.appendChild(pokemonImg);
    });
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

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      let modalBody = document.querySelector(".modal-body");
      let modalTitle = document.querySelector(".modal-title");
      let modalHeader = document.querySelector(".modal-header");
      let modalImage = document.querySelector(".modal-image");
      let modalHeight = document.querySelector(".modal-height");
      let modalTypes = document.querySelector(".modal-types");

      modalTitle.innerText = item.name[0].toUpperCase() + item.name.slice(1);
      modalImage.setAttribute("src", item.imageUrl);
      modalHeight.innerText = "Height: " + item.height;
      modalTypes.innerText = "Types: ";

      modalBody.append(modalImage);
      modalBody.append(modalHeight);

      let array = [];

      item.types.forEach((element) => {
        let eachType = document.createElement("p");
        array.push(eachType.innerText);
        eachType.innerText =
          element.type.name[0].toUpperCase() + element.type.name.slice(1);
        modalTypes.appendChild(eachType);
        modalBody.appendChild(modalTypes);
      });
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
            detailsUrl: item.url,
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
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types;
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
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
