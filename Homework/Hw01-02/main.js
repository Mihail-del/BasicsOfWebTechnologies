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
        li.dataset.id = item.id;

        li.innerHTML = `
            <span class="item-name">${item.name}</span>
            <div class="item-controls">
                <button class="btn-minus" data-tooltip="Зменшити кількість" ${item.count === 1 ? 'disabled' : ''}> -</button >
                <span class="item-count">${item.count}</span>
                <button class="btn-plus" data-tooltip="Збільшити кількість">+</button>
            </div >
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

function addItem() {
    const name = inputAdd.value.trim();

    if (name !== '') {
        const newItem = {
            id: Date.now(),
            name: name,
            count: 1,
            isBought: false
        };

        items.push(newItem);

        render();

        inputAdd.value = '';
        inputAdd.focus();
    }
}

btnAdd.addEventListener('click', addItem);
inputAdd.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addItem();
    }
});

render();