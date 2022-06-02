
const d = document;
let $main = d.querySelector('main'),
$navLinks = d.querySelector('.container-links'),
pokeAPI = "https://pokeapi.co/api/v2/pokemon",
dbPokemons = [],
$form = d.querySelector('.form-search');


const searchPokemon = (form) => {
    return form.search.value;
};  

const createModalPokemon = (data) => {
    const $container = d.createElement('div'),
    $pokeContainer = d.createElement('div'),
    $btnClose = d.createElement('button'),
    $ul = d.createElement('ul');
    $img = d.createElement('img');
    $btnClose.textContent = 'X';
    $ul.innerHTML = `
        <li> Altura: ${data.weight} cm </li>
        <li> Peso: ${data.height} kg </li>
        <li> Tipo: ${data.types[0].type.name} </li> 
    `;
    $img.src = data.sprites.front_default;
    $container.appendChild($pokeContainer);
    $pokeContainer.appendChild($img);
    $pokeContainer.appendChild($ul);
    $pokeContainer.appendChild($btnClose);
    $btnClose.classList.add('btn-modal-close');
    $img.classList.add('img-modal-pokemon');
    $pokeContainer.classList.add('container-modal-pokemon');
    $container.classList.add('modal-pokemon');

    d.body.appendChild($container);
}

const getPokemos = async (API) => {
    $main.innerHTML = `
        <img class="loader" src="./assets/loader.svg" alt="loader"/>
    `;
    try {
        const res = await fetch(API);
        if(!res.ok) throw {status: res.status, statusText: res.statusText};
        const json = await res.json();
        const $fragment = d.createDocumentFragment();
        let pokemons = [];
        
        let prevPage = json.previous;
        let nextPage = json.next;
        
        $navLinks.innerHTML = '';
        $navLinks.innerHTML = `
            <button class="btn-link--nav" data-page="${prevPage}" 
            ${(prevPage !== null) ? "" : "disabled" }>
            ◀
            </button>
            <button class="btn-link--nav" data-page="${nextPage}"
            ${(nextPage !== null) ? "" : "disabled" }>
            ▶
            </button>
            `;
        
        for(let i = 0; i < json.results.length; i++){
            try {

                const res = await fetch(json.results[i].url);
                if(!res.ok) throw {status: res.status, statusText: res.statusText};
            
                const pokemon = await res.json();

                pokemons.push(pokemon);

                const $nameText = pokemon.name;
                const $imgUrl = pokemon.sprites.front_default;
                const $figure = d.createElement('figure'),
                $img = d.createElement('img'),
                $figcaption = d.createElement('figcaption');
                $figure.classList.add('poke-card--container-grid');
                $figcaption.classList.add('figcaption--poke-card');
                $figure.dataset.id = i;
                $img.src = $imgUrl;
                $img.alt = $nameText;
                $figcaption.textContent = $nameText;
                $figure.appendChild($img);
                $figure.appendChild($figcaption);
                $fragment.appendChild($figure);

            }catch(err){
                console.log(err);
                let message = err.statusText || 'Ocurrio un error';
                $template.innerHTML +=  `
                <figure>
                    <figcaption>Error ${err.status} : ${message}</figcaption>
                </figure>`;
            }   
        }
        dbPokemons = [...pokemons];
        $main.innerHTML = '';
        $main.appendChild($fragment);
    }catch(err) {
        let message = err.statusText || 'Ocurrio un error';
        $main.innerHTML = `Error ${err.status} : ${message}`;
    }
}
d.addEventListener('DOMContentLoaded' , getPokemos(pokeAPI));

d.addEventListener('click', e => {
    
    if(e.target.matches('.btn-link--nav')){
        const page = e.target.dataset.page;
        getPokemos(page);
    }

    if(e.target.matches('.poke-card--container-grid *')){
        let id = Number(e.target.parentNode.getAttribute('data-id'));
        createModalPokemon(dbPokemons[id]);
        console.log(id);
    }
    if(e.target.matches('.btn-modal-close')){
        console.log('Cerrar');
        e.target.parentNode.parentNode.remove();
    }
});

d.addEventListener('submit', e => {
    
    e.preventDefault();
    
    if(!$form.search.value){
        alert('Ingrese un nombre');
        return;
    };
    
    let search = searchPokemon($form);

    fetch(`${pokeAPI}/${search.toLowerCase()}`)
        .then( res => {
            return res.json();
        })
        .then( data => {
            console.log(data);
            createModalPokemon(data);
        })
        .catch( err => {
            console.log(err);
        });

    $form.search.value = '';
    
});