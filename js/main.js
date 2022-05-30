
const d = document;
let $main = d.querySelector('main'),
$navLinks = d.querySelector('.container-links'),
pokeAPI = "https://pokeapi.co/api/v2/pokemon";

const getPokemos = async (API) => {
    $main.innerHTML = `
        <img class="loader" src="./assets/loader.svg" alt="loader"/>
    `;
    try {
        const res = await fetch(API);
        if(!res.ok) throw {status: res.status, statusText: res.statusText};
        const json = await res.json();
        const $fragment = d.createDocumentFragment();

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

                const $nameText = pokemon.name;
                const $imgUrl = pokemon.sprites.front_default;
                const $figure = d.createElement('figure'),
                $img = d.createElement('img'),
                $figcaption = d.createElement('figcaption');
                $figure.classList.add('poke-card--container-grid');
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
});