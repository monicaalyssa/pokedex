
let pokemonRepository = (function () {

    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon &&
            'detailsUrl' in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log('Pokemon is not correct');
        }
    }

    function getAll() {
        return pokemonList;
    }

    function addListItem(pokemon) {
        let pokemonListGrid = document.querySelector('ul');
        pokemonListGrid.classList.add('pokemon__grid');

        let listItem = document.createElement('li');
        listItem.innerText = pokemon.name
        listItem.classList.add('pokemon__name')

        pokemonRepository.loadDetails(pokemon).then(function () {
            let pokemonImg = document.createElement('img');
            pokemonImg.src = pokemon.imageUrl;
            listItem.appendChild(pokemonImg);
        });

        pokemonListGrid.appendChild(listItem);

        let button = document.createElement('button');
        button.classList.add('btn', 'btn-secondary',);
        button.innerText = ('see details');
       
        button.setAttribute('type', 'button');
        button.setAttribute('data-toggle', 'modal');
        button.setAttribute('data-target', '#exampleModal');

        listItem.appendChild(button);

        button.addEventListener('click', function () {
            showDetails(pokemon);
        });

     
    }

    function showDetails(item) {
        pokemonRepository.loadDetails(item).then(function () {

            let modalBody = document.querySelector('.modal-body');
            let modalTitle = document.querySelector('.modal-title');
            let modalHeader = document.querySelector('.modal-header');
            let modalImage = document.querySelector('.modal-image');
            let modalHeight = document.querySelector('.modal-height');


            modalTitle.innerText = item.name;
            modalImage.setAttribute('src', item.imageUrl);
            modalHeight.innerText = 'Height: ' + item.height;

            let modalTypes = document.querySelector('.modal-types');

            item.types.forEach((element) => {
                modalTypes.innerText = (element.type.name);
                modalBody.appendChild(modalTypes);
            });

            modalTitle.append(modalHeader);
            modalBody.append(modalImage);
            modalBody.append(modalHeight);


        });
    };

    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        let modalContainer = document.querySelector('#modal-container');
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })

    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
        }).catch(function (e) {
            console.error(e);
        });
    }


    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails
    };

})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});



