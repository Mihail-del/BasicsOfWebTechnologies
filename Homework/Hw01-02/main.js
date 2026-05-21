let items = [
    { id: 1, name: 'Помідори', count: 1, isBought: false, isEditing: false },
    { id: 2, name: 'Печиво', count: 1, isBought: false, isEditing: false },
    { id: 3, name: 'Сир', count: 1, isBought: false, isEditing: false }
];

const itemList = document.querySelector('.item-list');
const inputAdd = document.querySelector('#input-add');
const btnAdd = document.querySelector('.btn-add');

function render() {
    itemList.innerHTML = '';

    const summaryTagsLeft = document.querySelector('.summary-section:nth-of-type(1) .summary-tags');
    const summaryTagsBought = document.querySelector('.summary-section:nth-of-type(2) .summary-tags');

    if (summaryTagsLeft) summaryTagsLeft.innerHTML = '';
    if (summaryTagsBought) summaryTagsBought.innerHTML = '';

    items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'item-row';
        li.dataset.id = item.id;

        const nameContent = item.isEditing && !item.isBought
            ? `<input type="text" class="input-edit" value="${item.name}">`
            : `<span class="item-name ${item.isBought ? 'bought' : ''}">${item.name}</span>`;

        li.innerHTML = `
            ${nameContent}
            <div class="item-controls" ${item.isBought ? 'style="display: none;"' : ''}>
                <button class="btn-minus" data-tooltip="Зменшити кількість" ${item.count === 1 ? 'disabled' : ''}>-</button>
                <span class="item-count">${item.count}</span>
                <button class="btn-plus" data-tooltip="Збільшити кількість">+</button>
            </div>
            <div class="item-actions">
                <button class="btn-buy" data-tooltip="${item.isBought ? 'Відмітити як не куплене' : 'Відмітити як куплене'}">
                    ${item.isBought ? 'Зробити не купленим' : 'Куплено'}
                </button>
                <button class="btn-delete" data-tooltip="Видалити товар" ${item.isBought ? 'style="display: none;"' : ''}>✖</button>
            </div>
        `;

        itemList.appendChild(li);

        if (item.isEditing && !item.isBought) {
            const editInput = li.querySelector('.input-edit');
            editInput.focus();
            editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
        }

        if (items.indexOf(item) !== items.length - 1) {
            const hr = document.createElement('hr');
            itemList.appendChild(hr);
        }
    });

    items.forEach((item) => {
        const tag = document.createElement('span');
        tag.className = 'summary-tag';
        tag.innerHTML = `${item.name} <span class="summary-badge">${item.count}</span>`;
        if (item.isBought) {
            if (summaryTagsBought) summaryTagsBought.appendChild(tag);
        } else {
            if (summaryTagsLeft) summaryTagsLeft.appendChild(tag);
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
            isBought: false,
            isEditing: false
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

itemList.addEventListener('click', (event) => {
    const itemRow = event.target.closest('.item-row');
    if (!itemRow) return;

    const itemId = parseInt(itemRow.dataset.id);
    if (event.target.classList.contains('btn-delete')) {
        items = items.filter(item => item.id !== itemId);
        render();
    }

    if (event.target.classList.contains('btn-plus')) {
        const item = items.find(item => item.id === itemId);
        if (item) {
            item.count++;
            render();
        }
    }

    if (event.target.classList.contains('btn-minus')) {
        const item = items.find(item => item.id === itemId);
        if (item && item.count > 1) {
            item.count--;
            render();
        }
    }

    if (event.target.classList.contains('btn-buy')) {
        const item = items.find(item => item.id === itemId);
        if (item) {
            item.isBought = !item.isBought;
            render();
        }
    }

    if (event.target.classList.contains('item-name')) {
        const item = items.find(item => item.id === itemId);
        if (item && !item.isBought) {
            item.isEditing = true;
            render();
        }
    }
});

function saveNewName(event) {
    if (!event.target.classList.contains('input-edit')) return;

    const itemRow = event.target.closest('.item-row');
    const itemId = parseInt(itemRow.dataset.id);
    const item = items.find(item => item.id === itemId);

    if (item) {
        const newName = event.target.value.trim();
        if (newName !== '') {
            item.name = newName;
        }
        item.isEditing = false;
        render();
    }
}

itemList.addEventListener('blur', saveNewName, true);

itemList.addEventListener('keydown', (event) => {
    if (event.target.classList.contains('input-edit') && event.key === 'Enter') {
        saveNewName(event);
    }
});