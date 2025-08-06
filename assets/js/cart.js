// cart.js

const products = {
    'dates-adjva': { id: 'dates-adjva', name: 'Финики Аджва', price: 6000, dollar: 68, img: 'assets/images/finiki-adgva.jpg' },
    'fig': { id: 'fig', name: 'Инжир вяленный', price: 400, dollar: 4.5, img: 'assets/images/injir.webp' },
    'walnuts': { id: 'walnuts', name: 'Грецкий орех', price: 250, dollar: 2.8, img: 'assets/images/greckiy-oreh.jpg' },
    'honey': { id: 'honey', name: 'Мёд', price: 500, dollar: 6.7, img: 'assets/images/med.jpeg' },
    'peanut': { id: 'peanut', name: 'Арахис (Жер жангак)', price: 250, dollar: 2.8, img: 'assets/images/arahis.jpg' },
    'dates-medjul': { id: 'dates-medjul', name: 'Финики Меджул', price: 1500, dollar: 17.5, img: 'assets/images/finiki-medjul.webp' },
    
    // 🔽 Новые товары:
    'cashew': { id: 'cashew', name: 'Кешью', price: 1200, dollar: 13.8, img: 'assets/images/keshu.webp' },
    'almond': { id: 'almond', name: 'Миндаль', price: 900, dollar: 10.3, img: 'assets/images/mendal.jpg' },
    'kishmish': { id: 'kishmish', name: 'Изюм кишмиш', price: 850, dollar: 9.8, img: 'assets/images/izjum-kishmish.jpg' },
    'salted-peanut': { id: 'salted-peanut', name: 'Соленый арахис', price: 380, dollar: 4.4, img: 'assets/images/naturalnyj-zharenyj-solenyj-arahis.webp' }
};


let cart = {};

// Загрузка/сохранение корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const data = localStorage.getItem('cart');
    if (data) {
        cart = JSON.parse(data);
    }
}

// Работа с корзиной
function addToCart(product) {
    if (!cart[product.id]) {
        cart[product.id] = { ...product, quantity: 1 };
    } else {
        cart[product.id].quantity++;
    }
    saveCart();
    updateIndexUI();
    updateCartCount();
    renderCartPage();
}

function removeFromCart(product) {
    if (cart[product.id]) {
        cart[product.id].quantity--;
        if (cart[product.id].quantity <= 0) {
            delete cart[product.id];
        }
        saveCart();
        updateIndexUI();
        updateCartCount();
        renderCartPage();
    }
}

// Обновление интерфейса
function updateIndexUI() {
    for (let key in products) {
        const el = document.getElementById(`${key}-cart`);
        if (el) {
            el.innerText = cart[key] ? cart[key].quantity : '';
        }
    }
}

function updateCartCount() {
    const countEl = document.querySelector('.header__cart-count');
    if (countEl) {
        let total = 0;
        for (let key in cart) {
            total += cart[key].quantity;
        }
        countEl.innerText = total;
        countEl.style.display = total > 0 ? 'block' : 'none';
    }
}

function renderCartPage() {
    const container = document.getElementById('cart-items');
    const totalItems = document.getElementById('total-items');
    const totalAmount = document.getElementById('total-amount');
    if (!container || !totalItems || !totalAmount) return;

    container.innerHTML = '';

    let totalQty = 0;
    let totalSum = 0;

    for (let key in cart) {
        const item = cart[key];
        const div = document.createElement('div');
        div.className = 'cart__item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Цена: ${item.price} сом / ${item.dollar} $ кг</p>
                <p>Количество: ${item.quantity}</p>
                <p>Сумма: ${item.quantity * item.price} сом</p>
            </div>
            <div class="btn-row">
                <button class="btn" onclick="removeFromCart(products['${item.id}'])">-</button>
                <button class="btn" onclick="addToCart(products['${item.id}'])">+</button>
            </div>
        `;
        container.appendChild(div);
        totalQty += item.quantity;
        totalSum += item.quantity * item.price;
    }

    if (totalQty === 0) {
        container.innerHTML = '<div class="cart__empty"><i class="fas fa-shopping-cart"></i><p>Ваша корзина пуста</p></div>';
    }

    totalItems.innerText = totalQty;
    totalAmount.innerText = `${totalSum} сом`;
}

function clearCart() {
    cart = {};
    saveCart();
    updateCartCount();
    updateIndexUI();
    renderCartPage();
}

// Платёжная система
function pay() {
    const phoneNumber = document.getElementById('phone-number').value;
    if (!phoneNumber) {
        alert('Пожалуйста, введите номер телефона');
        return;
    }

    if (Object.keys(cart).length === 0) {
        alert('Корзина пуста. Нечего оплачивать!');
        return;
    }

    let totalAmount = 0;
    const receiptPositions = [];

    for (let key in cart) {
        const item = cart[key];
        const positionTotal = item.quantity * item.price;
        totalAmount += positionTotal;

        receiptPositions.push({
            count: item.quantity,
            name: item.name,
            tax_type: 3,
            price: positionTotal
        });
    }

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 5);
    const email = `order${Math.floor(Math.random() * 100000)}@tattuu-market.kg`;

    const paymentData = {
        token: "tEbg9uPwXk84mH1ihxC9N1hGMMzg0ZBn",
        payment: {
            order: String(Math.floor(Math.random() * 100000)),
            amount: totalAmount,
            currency: "KGS",
            description: "Описание заказа",
            expires_at: currentDate.toISOString(),
            options: {
                callbacks: {
                    result_url: "https://tattuu-market.kg/result",
                    check_url: "https://tattuu-market.kg/check"
                },
                user: {
                    email: email,
                    phone: phoneNumber
                },
                receipt_positions: receiptPositions
            }
        },
        successCallback: function(payment) {
            document.getElementById('payment-success').style.display = 'block';
            setTimeout(() => {
                document.getElementById('payment-success').style.display = 'none';
            }, 5000);
            clearCart();
        },
        errorCallback: function(payment) {
            document.getElementById('payment-error').style.display = 'block';
            setTimeout(() => {
                document.getElementById('payment-error').style.display = 'none';
            }, 5000);
        }
    };

    const widget = new PayBox(paymentData);
    widget.create();
}


// Загрузка PayBox SDK
(function(p, a, y, b, o, x) {
    o = p.createElement(a);
    x = p.getElementsByTagName(a)[0];
    o.async = 1;
    o.src = 'https://cdn.freedompay.kg/widget/pbwidget.js?' + 1 * new Date();
    x.parentNode.insertBefore(o, x);
})(document, 'script');


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateIndexUI();
    updateCartCount();
    renderCartPage();
});
