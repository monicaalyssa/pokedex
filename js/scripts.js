
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
        let pokemonListHtml = document.querySelector('ul');
        pokemonListHtml.classList.add('pokemon__grid');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.classList.add(pokemon.name)
        button.innerText = pokemon.name
        button.classList.add('pokemon__name')
        listItem.appendChild(button);
        pokemonListHtml.appendChild(listItem);
        button.addEventListener('click', function () {
            showDetails(pokemon);

        });

        pokemonRepository.loadDetails(pokemon).then(function () {
            let pokemonButtonImg = document.createElement('img');
            pokemonButtonImg.classList.add('pokemon-button-image');
            pokemonButtonImg.src = pokemon.imageUrl;
            button.appendChild(pokemonButtonImg);
        });

    }

    function showDetails(item) {
        pokemonRepository.loadDetails(item).then(function () {

            /* modal container */
            let modalContainer = document.querySelector('#modal-container');
            modalContainer.innerHTML = '';
            let modal = document.createElement('div');
            modal.classList.add('modal');
            modalContainer.appendChild(modal);
            modalContainer.classList.add('is-visible');


            /* modal title + exit button in one div */
            let modalHeader = document.createElement('div');
            modal.appendChild(modalHeader);
            modalHeader.classList.add('modal-header');

            /* pokemon name */
            let pokemonName = document.createElement('h1');
            pokemonName.innerText = item.name;
            pokemonName.classList.add('modal-title');
            modalHeader.appendChild(pokemonName);

            /* exit button */
            let exitButton = document.createElement('button');
            let svgExitImage = document.createElement('img');
            exitButton.classList.add('exit__button');
            let buttonImageLink = ('images/exit.svg');
            svgExitImage.src = buttonImageLink;

            exitButton.appendChild(svgExitImage);
            modalHeader.appendChild(exitButton);
            exitButton.addEventListener('click', hideModal);
            modalContainer.addEventListener('click', (e) => {
                let target = e.target;
                if (target === modalContainer) {
                    hideModal();
                }
            });


            /* modal content/pokemon details and flexbox div */
            let flexBoxModal = document.createElement('div');
            modal.appendChild(flexBoxModal);
            flexBoxModal.classList.add('flex-box-modal')
            let modalContent = document.createElement('div');
            flexBoxModal.appendChild(modalContent);
            modalContent.classList.add('modal-content');

            /* pokemon height */
            let pokemonHeight = document.createElement('p');
            pokemonHeight.innerText = ('height: ' + item.height);
            pokemonHeight.classList.add('modal-height', 'bubble');
            modalContent.appendChild(pokemonHeight);

            /* pokemon types */
            let typesTitle = document.createElement('span');
            typesTitle.innerText = ('types:');
            typesTitle.classList.add('modal-types', 'bubble');
            modalContent.appendChild(typesTitle);

            item.types.forEach((element) => {
                let pokemonTypes = document.createElement('button');
                pokemonTypes.innerText = (element.type.name);
                pokemonTypes.classList.add('modal-types-button', 'bubble');
                modalContent.appendChild(pokemonTypes);
            });

            /* pokemon image */
            let pokemonImage = document.createElement('img');
            let modalImageBox = document.createElement('div');
            modalImageBox.classList.add('modal-image-box');
            pokemonImage.src = item.imageUrl
            pokemonImage.classList.add('modal-image');
            pokemonImage.classList.add(item.name + '-image');
            modalImageBox.appendChild(pokemonImage);
            flexBoxModal.appendChild(modalImageBox);

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



