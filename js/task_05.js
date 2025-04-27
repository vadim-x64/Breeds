import { breeds } from './data_full.js';

document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    renderBreeds(breeds);
    setupEventListeners();
});

function setupUI() {
    const container = document.createElement('div');
    container.className = 'controls-container';

    const sortingContainer = document.createElement('div');
    sortingContainer.className = 'sorting-container';

    const sortLabel = document.createElement('label');
    sortLabel.htmlFor = 'sort-select';
    sortLabel.textContent = 'Сортувати за: ';

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort-select';

    const sortOptions = [
        { value: 'name-asc', text: 'Назвою (А-Я)' },
        { value: 'name-desc', text: 'Назвою (Я-А)' },
        { value: 'weight-asc', text: 'Вагою (від легких до важких)' },
        { value: 'weight-desc', text: 'Вагою (від важких до легких)' },
        { value: 'height-asc', text: 'Висотою (від низьких до високих)' },
        { value: 'height-desc', text: 'Висотою (від високих до низьких)' },
        { value: 'life-asc', text: 'Тривалістю життя (зростання)' },
        { value: 'life-desc', text: 'Тривалістю життя (спадання)' }
    ];

    sortOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        sortSelect.appendChild(optionElement);
    });

    sortingContainer.appendChild(sortLabel);
    sortingContainer.appendChild(sortSelect);

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'Пошук за назвою або описом...';
    searchContainer.appendChild(searchInput);

    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'filters-container';

    const groupFilterContainer = document.createElement('div');
    groupFilterContainer.className = 'filter-group';

    const groupLabel = document.createElement('label');
    groupLabel.htmlFor = 'group-filter';
    groupLabel.textContent = 'Група: ';

    const groupSelect = document.createElement('select');
    groupSelect.id = 'group-filter';

    const groups = ['Всі групи', ...new Set(breeds
        .filter(breed => breed.breed_group)
        .map(breed => breed.breed_group))].sort();

    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group === 'Всі групи' ? '' : group;
        option.textContent = group;
        groupSelect.appendChild(option);
    });

    groupFilterContainer.appendChild(groupLabel);
    groupFilterContainer.appendChild(groupSelect);

    const weightFilterContainer = document.createElement('div');
    weightFilterContainer.className = 'filter-group';

    const weightLabel = document.createElement('div');
    weightLabel.textContent = 'Вага (кг): ';

    const weightRangeContainer = document.createElement('div');
    weightRangeContainer.className = 'weight-range-container';

    const weightMinInput = document.createElement('input');
    weightMinInput.type = 'number';
    weightMinInput.id = 'weight-min';
    weightMinInput.placeholder = 'Мін';
    weightMinInput.min = 0;

    const weightMaxInput = document.createElement('input');
    weightMaxInput.type = 'number';
    weightMaxInput.id = 'weight-max';
    weightMaxInput.placeholder = 'Макс';
    weightMaxInput.min = 0;

    weightRangeContainer.appendChild(weightMinInput);
    weightRangeContainer.appendChild(document.createTextNode(' - '));
    weightRangeContainer.appendChild(weightMaxInput);

    weightFilterContainer.appendChild(weightLabel);
    weightFilterContainer.appendChild(weightRangeContainer);

    const lifeFilterContainer = document.createElement('div');
    lifeFilterContainer.className = 'filter-group';

    const lifeLabel = document.createElement('div');
    lifeLabel.textContent = 'Тривалість життя (роки): ';

    const lifeRangeContainer = document.createElement('div');
    lifeRangeContainer.className = 'life-range-container';

    const lifeMinInput = document.createElement('input');
    lifeMinInput.type = 'number';
    lifeMinInput.id = 'life-min';
    lifeMinInput.placeholder = 'Мін';
    lifeMinInput.min = 0;

    const lifeMaxInput = document.createElement('input');
    lifeMaxInput.type = 'number';
    lifeMaxInput.id = 'life-max';
    lifeMaxInput.placeholder = 'Макс';
    lifeMaxInput.min = 0;

    lifeRangeContainer.appendChild(lifeMinInput);
    lifeRangeContainer.appendChild(document.createTextNode(' - '));
    lifeRangeContainer.appendChild(lifeMaxInput);

    lifeFilterContainer.appendChild(lifeLabel);
    lifeFilterContainer.appendChild(lifeRangeContainer);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Скинути фільтри';
    resetButton.id = 'reset-filters';
    resetButton.className = 'reset-button';

    filtersContainer.appendChild(groupFilterContainer);
    filtersContainer.appendChild(weightFilterContainer);
    filtersContainer.appendChild(lifeFilterContainer);
    filtersContainer.appendChild(resetButton);

    container.appendChild(searchContainer);
    container.appendChild(sortingContainer);
    container.appendChild(filtersContainer);

    const resultsCounter = document.createElement('div');
    resultsCounter.id = 'results-counter';
    resultsCounter.className = 'results-counter';

    const heading = document.querySelector('h1');
    heading.after(container);
    container.after(resultsCounter);
}

function setupEventListeners() {
    document.getElementById('sort-select').addEventListener('change', applyFiltersAndSort);
    document.getElementById('search-input').addEventListener('input', applyFiltersAndSort);
    document.getElementById('group-filter').addEventListener('change', applyFiltersAndSort);
    document.getElementById('weight-min').addEventListener('input', applyFiltersAndSort);
    document.getElementById('weight-max').addEventListener('input', applyFiltersAndSort);
    document.getElementById('life-min').addEventListener('input', applyFiltersAndSort);
    document.getElementById('life-max').addEventListener('input', applyFiltersAndSort);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
}

function applyFiltersAndSort() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const selectedGroup = document.getElementById('group-filter').value;
    const weightMin = document.getElementById('weight-min').value;
    const weightMax = document.getElementById('weight-max').value;
    const lifeMin = document.getElementById('life-min').value;
    const lifeMax = document.getElementById('life-max').value;
    const sortOption = document.getElementById('sort-select').value;

    let filteredBreeds = breeds.filter(breed => {
        const nameMatch = breed.name.toLowerCase().includes(searchText);
        const temperamentMatch = breed.temperament && breed.temperament.toLowerCase().includes(searchText);
        const searchMatch = nameMatch || temperamentMatch;
        const groupMatch = !selectedGroup || breed.breed_group === selectedGroup;
        let avgWeight = calculateAverageWeight(breed.weight.metric);
        const weightMinMatch = !weightMin || avgWeight >= parseFloat(weightMin);
        const weightMaxMatch = !weightMax || avgWeight <= parseFloat(weightMax);
        let avgLife = calculateAverageLife(breed.life_span);
        const lifeMinMatch = !lifeMin || avgLife >= parseFloat(lifeMin);
        const lifeMaxMatch = !lifeMax || avgLife <= parseFloat(lifeMax);
        return searchMatch && groupMatch && weightMinMatch && weightMaxMatch && lifeMinMatch && lifeMaxMatch;
    });

    filteredBreeds = sortBreeds(filteredBreeds, sortOption);
    renderBreeds(filteredBreeds);
    updateResultsCounter(filteredBreeds.length);
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('group-filter').value = '';
    document.getElementById('weight-min').value = '';
    document.getElementById('weight-max').value = '';
    document.getElementById('life-min').value = '';
    document.getElementById('life-max').value = '';
    document.getElementById('sort-select').value = 'name-asc';
    applyFiltersAndSort();
}

function sortBreeds(breeds, sortOption) {
    return [...breeds].sort((a, b) => {
        switch (sortOption) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'weight-asc':
                return calculateAverageWeight(a.weight.metric) - calculateAverageWeight(b.weight.metric);
            case 'weight-desc':
                return calculateAverageWeight(b.weight.metric) - calculateAverageWeight(a.weight.metric);
            case 'height-asc':
                return calculateAverageHeight(a.height.metric) - calculateAverageHeight(b.height.metric);
            case 'height-desc':
                return calculateAverageHeight(b.height.metric) - calculateAverageHeight(a.height.metric);
            case 'life-asc':
                return calculateAverageLife(a.life_span) - calculateAverageLife(b.life_span);
            case 'life-desc':
                return calculateAverageLife(b.life_span) - calculateAverageLife(a.life_span);
            default:
                return 0;
        }
    });
}

function calculateAverageWeight(weightRange) {
    if (!weightRange) return 0;
    const parts = weightRange.split(' - ');
    if (parts.length === 1) {
        return parseFloat(parts[0]) || 0;
    }
    const [minWeight, maxWeight] = parts.map(part => parseFloat(part) || 0);
    return (minWeight + maxWeight) / 2;
}

function calculateAverageHeight(heightRange) {
    if (!heightRange) return 0;
    const parts = heightRange.split(' - ');
    if (parts.length === 1) {
        return parseFloat(parts[0]) || 0;
    }
    const [minHeight, maxHeight] = parts.map(part => parseFloat(part) || 0);
    return (minHeight + maxHeight) / 2;
}

function calculateAverageLife(lifeSpan) {
    if (!lifeSpan) return 0;
    const cleanSpan = lifeSpan.replace(/years/gi, '').trim();
    const parts = cleanSpan.split(' - ');
    if (parts.length === 1) {
        return parseFloat(parts[0]) || 0;
    }
    const [minLife, maxLife] = parts.map(part => parseFloat(part) || 0);
    return (minLife + maxLife) / 2;
}

function renderBreeds(breeds) {
    const breedsList = document.getElementById('breeds');
    breedsList.innerHTML = '';

    if (breeds.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'Не знайдено жодної породи за заданими критеріями.';
        breedsList.appendChild(noResults);
        return;
    }

    breeds.forEach(breed => {
        const card = document.createElement('li');
        card.classList.add('card');

        const img = document.createElement('img');
        if (breed.reference_image_id) {
            img.src = `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`;
            img.alt = breed.name;
            img.onerror = function() {
                this.src = 'https://via.placeholder.com/300x200?text=No+Image';
            };
        } else {
            img.src = 'https://via.placeholder.com/300x200?text=No+Image';
            img.alt = 'Image not available';
        }

        const title = document.createElement('h2');
        title.textContent = breed.name;

        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';

        if (breed.breed_group) {
            const group = document.createElement('p');
            group.innerHTML = `<strong>Група:</strong> ${breed.breed_group}`;
            infoContainer.appendChild(group);
        }

        const weight = document.createElement('p');
        weight.innerHTML = `<strong>Вага:</strong> ${breed.weight.metric} кг`;
        infoContainer.appendChild(weight);

        const height = document.createElement('p');
        height.innerHTML = `<strong>Висота:</strong> ${breed.height.metric} см`;
        infoContainer.appendChild(height);

        if (breed.life_span) {
            const lifeSpan = document.createElement('p');
            lifeSpan.innerHTML = `<strong>Тривалість життя:</strong> ${breed.life_span}`;
            infoContainer.appendChild(lifeSpan);
        }

        if (breed.temperament) {
            const temperament = document.createElement('p');
            temperament.innerHTML = `<strong>Темперамент:</strong> ${breed.temperament}`;
            infoContainer.appendChild(temperament);
        }

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(infoContainer);
        breedsList.appendChild(card);
    });
}

function updateResultsCounter(count) {
    const counter = document.getElementById('results-counter');
    counter.textContent = `Знайдено порід: ${count}`;
}