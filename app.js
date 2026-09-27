"use strict";

/* =====================================================
   SIMA 3.0
   Main Application
   ===================================================== */


/* ================= PRODUCTS ================= */

const products = [
    {
        id: 1,
        name: "سِمة Original",
        description: "تيشيرت بتصميم سِمة الأساسي.",
        price: 89,
        label: "SIMA"
    },

    {
        id: 2,
        name: "Minimal",
        description: "تصميم بسيط وأنيق.",
        price: 99,
        label: "S"
    },

    {
        id: 3,
        name: "Saudi Spirit",
        description: "تصميم مستوحى من الهوية السعودية.",
        price: 109,
        label: "🇸🇦"
    }
];


/* ================= STATE ================= */

let cart = [];

let selectedProduct = null;

let customDesign = {
    name: "تصميم مخصص",
    image: null,
    color: "#ffffff",
    size: 100
};


/* ================= DOM ================= */

const pages = document.querySelectorAll(".page");

const cartCount = document.getElementById("cartCount");

const featuredProducts =
    document.getElementById("featuredProducts");

const shopProducts =
    document.getElementById("shopProducts");

const cartItems =
    document.getElementById("cartItems");

const cartSummary =
    document.getElementById("cartSummary");

const productDetails =
    document.getElementById("productDetails");

const previewShirt =
    document.getElementById("previewShirt");

const designPreview =
    document.getElementById("designPreview");

const designUpload =
    document.getElementById("designUpload");

const designSize =
    document.getElementById("designSize");

const designName =
    document.getElementById("designName");

const addCustomDesign =
    document.getElementById("addCustomDesign");


/* ================= STORAGE ================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem("simaCart");

        cart = saved
            ? JSON.parse(saved)
            : [];

    } catch (error) {

        cart = [];

    }

    updateCartCount();
}


function saveCart() {

    localStorage.setItem(
        "simaCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* ================= NAVIGATION ================= */

function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });

    const target =
        document.getElementById(pageId);

    if (!target) {

        document
            .getElementById("home")
            .classList.add("active");

        return;

    }

    target.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "cart") {
        renderCart();
    }

}


document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("[data-page]");

        if (!button) {
            return;
        }

        event.preventDefault();

        const page =
            button.dataset.page;

        showPage(page);

    }
);


/* ================= PRODUCT CARD ================= */

function createProductCard(product) {

    return `
        <article class="product-card">

            <button
                class="product-image"
                data-product="${product.id}"
                aria-label="عرض المنتج"
            >

                <div class="mini-shirt">
                    ${product.label}
                </div>

            </button>

            <div class="product-info">

                <h3>${escapeHTML(product.name)}</h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <span class="price">
                        ${product.price} ر.س
                    </span>

                    <button
                        class="primary-btn"
                        data-add-product="${product.id}"
                    >
                        أضف للسلة
                    </button>

                </div>

            </div>

        </article>
    `;
}


/* ================= PRODUCTS ================= */

function renderProducts() {

    if (featuredProducts) {

        featuredProducts.innerHTML =
            products
                .map(createProductCard)
                .join("");

    }

    if (shopProducts) {

        shopProducts.innerHTML =
            products
                .map(createProductCard)
                .join("");

    }

}


document.addEventListener(
    "click",
    event => {

        const addButton =
            event.target.closest(
                "[data-add-product]"
            );

        if (addButton) {

            const id =
                Number(
                    addButton.dataset.addProduct
                );

            addToCart(id);

            return;
        }


        const productButton =
            event.target.closest(
                "[data-product]"
            );

        if (productButton) {

            const id =
                Number(
                    productButton.dataset.product
                );

            openProduct(id);

        }

    }
);


/* ================= PRODUCT DETAILS ================= */

function openProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) {
        return;
    }

    selectedProduct = product;

    productDetails.innerHTML = `

        <div class="details-image">

            <div class="shirt">
                <div class="shirt-print">
                    ${product.label}
                </div>
            </div>

        </div>

        <div class="details-info">

            <span class="eyebrow">
                SIMA PRODUCT
            </span>

            <h1>
                ${escapeHTML(product.name)}
            </h1>

            <p>
                ${escapeHTML(product.description)}
            </p>

            <div class="details-price">
                ${product.price} ر.س
            </div>

            <button
                class="primary-btn"
                id="detailsAddButton"
            >
                إضافة للسلة
            </button>

        </div>
    `;

    showPage("product");

    const detailsButton =
        document.getElementById(
            "detailsAddButton"
        );

    if (detailsButton) {

        detailsButton.addEventListener(
            "click",
            () => addToCart(product.id)
        );

    }

}


/* ================= CART ================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }

    cart.push({
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        type: "product"
    });

    saveCart();

    showToast("تمت إضافة المنتج للسلة");

}


function addCustomToCart() {

    cart.push({
        id: Date.now(),
        name:
            customDesign.name ||
            "تصميم مخصص",
        price: 119,
        image: customDesign.image,
        color: customDesign.color,
        size: customDesign.size,
        type: "custom"
    });

    saveCart();

    showToast("تمت إضافة تصميمك للسلة");

    showPage("cart");

}


function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

    renderCart();

}


function renderCart() {

    if (!cartItems || !cartSummary) {
        return;
    }

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty">
                السلة فارغة حاليًا.
                <br><br>
                <button
                    class="primary-btn"
                    data-page="shop"
                >
                    تصفح المتجر
                </button>
            </div>
        `;

        cartSummary.innerHTML = "";

        return;
    }


    cartItems.innerHTML =
        cart.map(item => `

            <div class="cart-item">

                <div class="cart-item-info">

                    <div class="cart-thumb">
                        ${
                            item.type === "custom"
                                ? "🎨"
                                : "👕"
                        }
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <div>
                            ${item.price} ر.س
                        </div>

                    </div>

                </div>

                <button
                    class="remove-btn"
                    data-remove="${item.id}"
                >
                    حذف
                </button>

            </div>

        `).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + Number(item.price),
            0
        );


    cartSummary.innerHTML = `

        <strong>
            الإجمالي:
            ${total} ر.س
        </strong>

        <button
            class="primary-btn"
            id="checkoutButton"
        >
            إتمام الطلب
        </button>

    `;


    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );

    checkoutButton.addEventListener(
        "click",
        () => {

            showToast(
                "الدفع سيتم تفعيله في المرحلة القادمة"
            );

        }
    );

}


document.addEventListener(
    "click",
    event => {

        const removeButton =
            event.target.closest(
                "[data-remove]"
            );

        if (!removeButton) {
            return;
        }

        removeFromCart(
            Number(
                removeButton.dataset.remove
            )
        );

    }
);


function updateCartCount() {

    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }

}


/* ================= DESIGNER ================= */

document
    .querySelectorAll(".color-option")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".color-option"
                    )
                    .forEach(item => {
                        item.classList.remove(
                            "active"
                        );
                    });

                button.classList.add("active");

                const color =
                    button.dataset.color;

                customDesign.color =
                    color;

                previewShirt.style.background =
                    color;

            }
        );

    });


if (designUpload) {

    designUpload.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                showToast(
                    "الملف لازم يكون صورة"
                );

                return;

            }

            const reader =
                new FileReader();

            reader.onload =
                function () {

                    customDesign.image =
                        reader.result;

                    designPreview.innerHTML = `
                        <img
                            src="${reader.result}"
                            alt="تصميمك"
                        >
                    `;

                };

            reader.readAsDataURL(file);

        }
    );

}


if (designSize) {

    designSize.addEventListener(
        "input",
        event => {

            const value =
                Number(event.target.value);

            customDesign.size =
                value;

            designPreview.style.width =
                `${value}px`;

            designPreview.style.height =
                `${value}px`;

            designPreview.style.left =
                `calc(50% - ${value / 2}px)`;

        }
    );

}


if (designName) {

    designName.addEventListener(
        "input",
        event => {

            customDesign.name =
                event.target.value.trim() ||
                "تصميم مخصص";

        }
    );

}


if (addCustomDesign) {

    addCustomDesign.addEventListener(
        "click",
        () => {

            addCustomToCart();

        }
    );

}


/* ================= ACCOUNT ================= */

const loginBtn =
    document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        () => {

            const name =
                document
                    .getElementById(
                        "accountName"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "accountEmail"
                    )
                    .value
                    .trim();


            const message =
                document.getElementById(
                    "accountMessage"
                );


            if (!name || !email) {

                message.textContent =
                    "اكتب الاسم والبريد الإلكتروني أولًا.";

                return;

            }


            localStorage.setItem(
                "simaUser",
                JSON.stringify({
                    name,
                    email
                })
            );


            message.textContent =
                `أهلًا ${name} 👋 تم تسجيل دخولك محليًا.`;

        }
    );

}


/* ================= TOAST ================= */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".sima-toast"
        );

    if (oldToast) {
        oldToast.remove();
    }


    const toast =
        document.createElement("div");

    toast.className =
        "sima-toast";

    toast.textContent =
        message;


    Object.assign(
        toast.style,
        {
            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: "9999",
            background: "#174734",
            color: "#ffffff",
            padding: "14px 20px",
            borderRadius: "12px",
            fontWeight: "700",
            boxShadow:
                "0 10px 30px rgba(0,0,0,.18)"
        }
    );


    document.body.appendChild(toast);


    setTimeout(
        () => {

            toast.remove();

        },
        2500
    );

}


/* ================= SECURITY ================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ================= INIT ================= */

function init() {

    loadCart();

    renderProducts();

    showPage("home");

}


init();
