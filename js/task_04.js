import { breeds } from './data_sample.js';

let list = document.querySelector("ul");

let html = breeds.map(breed => {
    const {
        name,
        reference_image_id,
        breed_group,
        bred_for,
        temperament,
        weight
    } = breed;

    const imageUrl = `https://cdn2.thedogapi.com/images/${reference_image_id}.jpg`;

    return `
        <li class="card">
            <img src="${imageUrl}" alt="${name}">
            <h2>${name}</h2>
            ${breed_group ? `<p class="group">${breed_group}</p>` : ''}
            ${bred_for ? `<p class="group">${bred_for}</p>` : ''}
            ${temperament ? `<p>${temperament}</p>` : ''}
            <p>Weight: <span>${weight?.metric || 'N/A'} kg</span></p>
        </li>
    `;
}).join('');

list.insertAdjacentHTML('beforeend', html);