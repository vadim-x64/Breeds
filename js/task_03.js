import { breeds } from './data_sample.js';

const list = document.querySelector("ul#breeds");
const items = [];

breeds.forEach(breed => {
    const li = document.createElement("li");
    li.classList.add("card");

    const img = document.createElement("img");

    if (breed.reference_image_id) {
        img.src = `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`;
    } else {
        img.alt = "No image available";
    }

    li.appendChild(img);

    const h2 = document.createElement("h2");
    h2.textContent = breed.name;
    li.appendChild(h2);

    if (breed.breed_group) {
        const groupP = document.createElement("p");
        groupP.classList.add("group");
        groupP.textContent = breed.breed_group;
        li.appendChild(groupP);
    }

    if (breed.breed_type) {
        const typeP = document.createElement("p");
        typeP.classList.add("group");
        typeP.textContent = breed.breed_type;
        li.appendChild(typeP);
    }

    if (breed.temperament) {
        const temperamentP = document.createElement("p");
        temperamentP.textContent = breed.temperament;
        li.appendChild(temperamentP);
    }

    const weightP = document.createElement("p");
    weightP.innerHTML = `Weight: <span>${breed.weight?.metric || "N/A"} kg</span>`;
    li.appendChild(weightP);
    items.push(li);
});

list.append(...items);