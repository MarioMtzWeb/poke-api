
const d = document;
let $main = d.querySelector('main'),
pokeAPI = "https://pokeapi.co/api/v2/pokemon";


const getPokemos = async (API) => {

    $main.innerHTML = `
        <img src="./assets/loader.svg" alt="loader"/>
    `;

    
    try {

        let res = await fetch(API),
        json = await res.json(),
        $template = "",
        prevLink,
        nextLink;
        
        if(!res.ok) throw {status: res.status, statusText: res.statusText};
        
        for(let i = 0; i < json.results.length; i++){

            try {

                let res = await fetch(json.results[i].url),
                pokemon = await res.json();

                console.log(pokemon);

                if(!res.ok) throw {status: res.status, statusText: res.statusText};

                $template.innerHTML +=  `
                    <figure>
                        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                        <figcaption>${pokemon.name}</figcaptio>
                    </figure>
                `;

                
            }catch(err){
                
                let message = err.statusText || 'Ocurrio un error';
                
                $template.innerHTML +=  `
                <figure>
                    <figcaption>Error ${err.status} : ${message}</figcaptio>
                </figure>`;
            }
            
        }
        console.log($template);
        
        $main.innerHTML = $template;

    }catch(err) {

        let message = err.statusText || 'Ocurrio un error';

        $main.innerHTML = `Error ${err.status} : ${message}`;
    }
}

d.addEventListener('DOMContentLoaded' , getPokemos(pokeAPI));
