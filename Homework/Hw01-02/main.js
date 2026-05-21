let items = [
    { id: 1, name: 'Помідори', count: 1, isBought: false },
    { id: 2, name: 'Печиво', count: 1, isBought: false },
    { id: 3, name: 'Сир', count: 1, isBought: false }
];

const itemList = document.querySelector('.item-list');
const inputAdd = document.querySelector('#input-add');
const btnAdd = document.querySelector('.btn-add');

function render() {
    itemList.innerHTML = '';

    items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'item-row';

        li.innerHTML = `
            <span class="item-name">${item.name}</span>
            <div class="item-controls">
                <button class="btn-minus" data-tooltip="Зменшити кількість">-</button>
                <span class="item-count">${item.count}</span>
                <button class="btn-plus" data-tooltip="Збільшити кількість">+</button>
            </div>
            <div class="item-actions">
                <button class="btn-buy" data-tooltip="Відмітити як куплене">Куплено</button>
                <button class="btn-delete" data-tooltip="Видалити товар">✖</button>
            </div>
        `;

        itemList.appendChild(li);

        if (items.indexOf(item) !== items.length - 1) {
            const hr = document.createElement('hr');
            itemList.appendChild(hr);
        }
    });
}