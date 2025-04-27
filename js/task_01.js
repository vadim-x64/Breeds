const categories = document.querySelectorAll('li.item');

console.log(`Кількість категорій: ${categories.length}`);

categories.forEach(category => {
    const title = category.querySelector('h2').textContent;
    const itemsCount = category.querySelectorAll('ul li').length;
    console.log(`Категорія: ${title}`);
    console.log(`Кількість елементів: ${itemsCount}`);
});