const items = document.querySelectorAll('li.item');

items.forEach(item => {
    const titleElement = item.querySelector('h2');
    const innerList = item.querySelector('ul');

    if (innerList) {
        const count = innerList.querySelectorAll('li').length;
        titleElement.textContent += ` [${count}]`;
    }
});