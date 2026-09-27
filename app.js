"use strict";

/* =====================================================
   SIMA 3.0 DESIGNER
===================================================== */


/* =====================================================
   PRODUCTS
===================================================== */

const SHIRT_IMAGE =
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/White_tshirt.png";


const products = [
    {
        id: 1,
        name: "SIMA Original",
        description: "التصميم الأساسي لسِمة.",
        price: 89
    },

    {
        id: 2,
        name: "Minimal",
        description: "تصميم بسيط وأنيق.",
        price: 99
    },

    {
        id: 3,
        name: "Saudi Spirit",
        description: "تصميم مستوحى من الهوية السعودية.",
        price: 109
    }
];


/* =====================================================
   STATE
===================================================== */

let cart = [];

let designState = {
    x: 50,
    y: 48,
    scale: 1,
    rotation: 0,
    image: null,
    name: "تصميم مخصص",
    shirt: "white"
};


/* =====================================================
   DOM
===================================================== */

const pages =
    document.querySelectorAll(".page");

const cartCount =
    document.getElementById("cartCount");

const designLayer =
    document.getElementById("designLayer");

const uploadedDesign =
    document.getElementById("uploadedDesign");

const designPlaceholder =
    document.getElementById("designPlaceholder");

const designUpload =
    document.getElementById("designUpload");

const shirtImage =
    document.getElementById("shirtImage");

const designName =
    document.getElementById("designName");

const aiPrompt =
    document.getElementById("aiPrompt");

const aiStatus =
    document.getElementById("aiStatus");

const toast =
    document.getElementById("toast");


/* =====================================================
   NAVIGATION
===================================================== */

function showPage(id) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const page =
        document.getElementById(id);

    if (!page) {
        return;
    }

    page.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (id === "cart") {
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

        showPage(button.dataset.page);

    }
);


/* =====================================================
   PRODUCTS
===================================================== */

function productHTML(product) {

    return `
        <article class="product-card">

            <button
                class="product-photo"
                data-product="${product.id}"
            >

                <img
                    src="${SHIRT_IMAGE}"
                    alt="${escapeHTML(product.name)}"
                >

            </button>

            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <strong class="price">
                        ${product.price} ر.س
                    </strong>

                    <button
                        class="btn btn-primary"
                        data-add-product="${product.id}"
                    >
                        أضف للسلة
                    </button>

                </div>

            </div>

        </article>
    `;
}


function renderProducts() {

    const featured =
        document.getElementById(
            "featuredProducts"
        );

    const shop =
        document.getElementById(
            "shopProducts"
        );

    if (featured) {

        featured.innerHTML =
            products
                .map(productHTML)
                .join("");

    }

    if (shop) {

        shop.innerHTML =
            products
                .map(productHTML)
                .join("");

    }

}


document.addEventListener(
    "click",
    event => {

        const add =
            event.target.closest(
                "[data-add-product]"
            );

        if (add) {

            addProductToCart(
                Number(add.dataset.addProduct)
            );

            return;
        }

        const product =
            event.target.closest(
                "[data-product]"
            );

        if (product) {

            openProduct(
                Number(product.dataset.product)
            );

        }

    }
);


/* =====================================================
   PRODUCT DETAILS
===================================================== */

function openProduct(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) {
        return;
    }

    const container =
        document.getElementById(
            "productDetails"
        );

    container.innerHTML = `

        <div class="details-image">

            <img
                src="${SHIRT_IMAGE}"
                alt="${escapeHTML(product.name)}"
            >

        </div>

        <div class="details-info">

            <span class="small-label">
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
                class="btn btn-primary"
                id="detailsAdd"
            >
                إضافة للسلة
            </button>

        </div>
    `;

    showPage("product");

    document
        .getElementById("detailsAdd")
        .addEventListener(
            "click",
            () => {
                addProductToCart(product.id);
            }
        );

}


/* =====================================================
   CART
===================================================== */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "simaCart"
            );

        cart =
            saved
                ? JSON.parse(saved)
                : [];

    } catch {

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


function updateCartCount() {

    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }

}


function addProductToCart(id) {

    const product =
        products.find(
            item => item.id === id
        );

    if (!product) {
        return;
    }

    cart.push({
        cartId: Date.now(),
        type: "product",
        name: product.name,
        price: product.price,
        image: SHIRT_IMAGE
    });

    saveCart();

    showToast(
        "تمت إضافة المنتج للسلة"
    );

}


function addDesignToCart() {

    const name =
        designName.value.trim() ||
        "تصميم مخصص";

    cart.push({
        cartId: Date.now(),
        type: "custom",
        name,
        price: 119,
        image: designState.image,
        shirt: designState.shirt,
        x: designState.x,
        y: designState.y,
        scale: designState.scale,
        rotation: designState.rotation
    });

    saveCart();

    showToast(
        "تمت إضافة تصميمك للسلة"
    );

    setTimeout(
        () => showPage("cart"),
        350
    );
}


function removeCartItem(id) {

    cart =
        cart.filter(
            item => item.cartId !== id
        );

    saveCart();

    renderCart();
}


function renderCart() {

    const list =
        document.getElementById(
            "cartItems"
        );

    const summary =
        document.getElementById(
            "cartSummary"
        );

    if (!list || !summary) {
        return;
    }

    if (cart.length === 0) {

        list.innerHTML = `
            <div class="panel-card">
                السلة فارغة حاليًا.
            </div>
        `;

        summary.innerHTML = "";

        return;
    }


    list.innerHTML =
        cart
            .map(item => `

                <div class="cart-item">

                    <div class="cart-left">

                        <div class="cart-thumb">

                            ${
                                item.image
                                ? `
                                    <img
                                        src="${item.image}"
                                        alt=""
                                    >
                                `
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
                        class="remove-button"
                        data-remove-cart="${item.cartId}"
                    >
                        حذف
                    </button>

                </div>

            `)
            .join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + Number(item.price),
            0
        );


    summary.innerHTML = `

        <strong>
            الإجمالي:
            ${total} ر.س
        </strong>

        <button
            class="btn btn-primary"
            id="checkoutButton"
        >
            إتمام الطلب
        </button>

    `;


    document
        .getElementById(
            "checkoutButton"
        )
        .addEventListener(
            "click",
            () => {

                showToast(
                    "الدفع سيتم ربطه لاحقًا"
                );

            }
        );

}


document.addEventListener(
    "click",
    event => {

        const remove =
            event.target.closest(
                "[data-remove-cart]"
            );

        if (!remove) {
            return;
        }

        removeCartItem(
            Number(
                remove.dataset.removeCart
            )
        );

    }
);


/* =====================================================
   REAL TOUCH DESIGNER
===================================================== */

let pointers = new Map();

let gesture = {
    startX: 0,
    startY: 0,
    startDistance: 0,
    startAngle: 0,
    startScale: 1,
    startRotation: 0,
    startDesignX: 50,
    startDesignY: 48
};


function getDistance(a, b) {

    return Math.hypot(
        a.clientX - b.clientX,
        a.clientY - b.clientY
    );

}


function getAngle(a, b) {

    return Math.atan2(
        b.clientY - a.clientY,
        b.clientX - a.clientX
    ) * 180 / Math.PI;

}


function getStageCoordinates(event) {

    const stage =
        document.getElementById(
            "mockupStage"
        );

    const rect =
        stage.getBoundingClientRect();

    return {
        x:
            ((event.clientX - rect.left) /
                rect.width) *
            100,

        y:
            ((event.clientY - rect.top) /
                rect.height) *
            100
    };

}


function applyDesignTransform() {

    designLayer.style.left =
        `${designState.x}%`;

    designLayer.style.top =
        `${designState.y}%`;

    designLayer.style.transform =
        `
            translate(-50%, -50%)
            rotate(${designState.rotation}deg)
            scale(${designState.scale})
        `;

}


designLayer.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        designLayer.classList.add(
            "selected"
        );

        designLayer.setPointerCapture(
            event.pointerId
        );

        pointers.set(
            event.pointerId,
            event
        );


        if (pointers.size === 1) {

            gesture.startX =
                event.clientX;

            gesture.startY =
                event.clientY;

            gesture.startDesignX =
                designState.x;

            gesture.startDesignY =
                designState.y;

        }


        if (pointers.size === 2) {

            const values =
                [...pointers.values()];

            gesture.startDistance =
                getDistance(
                    values[0],
                    values[1]
                );

            gesture.startAngle =
                getAngle(
                    values[0],
                    values[1]
                );

            gesture.startScale =
                designState.scale;

            gesture.startRotation =
                designState.rotation;

        }

    }
);


designLayer.addEventListener(
    "pointermove",
    event => {

        if (
            !pointers.has(
                event.pointerId
            )
        ) {
            return;
        }

        pointers.set(
            event.pointerId,
            event
        );


        if (pointers.size === 1) {

            const dx =
                event.clientX -
                gesture.startX;

            const dy =
                event.clientY -
                gesture.startY;


            const stage =
                document.getElementById(
                    "mockupStage"
                );

            const rect =
                stage.getBoundingClientRect();


            designState.x =
                gesture.startDesignX +
                (dx / rect.width) * 100;


            designState.y =
                gesture.startDesignY +
                (dy / rect.height) * 100;


            designState.x =
                Math.max(
                    5,
                    Math.min(
                        95,
                        designState.x
                    )
                );


            designState.y =
                Math.max(
                    8,
                    Math.min(
                        92,
                        designState.y
                    )
                );


            applyDesignTransform();

        }


        if (pointers.size === 2) {

            const values =
                [...pointers.values()];

            const distance =
                getDistance(
                    values[0],
                    values[1]
                );

            const angle =
                getAngle(
                    values[0],
                    values[1]
                );


            if (
                gesture.startDistance > 0
            ) {

                const ratio =
                    distance /
                    gesture.startDistance;


                designState.scale =
                    gesture.startScale *
                    ratio;


                designState.scale =
                    Math.max(
                        0.35,
                        Math.min(
                            3,
                            designState.scale
                        )
                    );

            }


            designState.rotation =
                gesture.startRotation +
                (
                    angle -
                    gesture.startAngle
                );


            applyDesignTransform();

        }

    }
);


designLayer.addEventListener(
    "pointerup",
    event => {

        pointers.delete(
            event.pointerId
        );

        if (pointers.size === 0) {

            designLayer.classList.remove(
                "selected"
            );

        }

    }
);


designLayer.addEventListener(
    "pointercancel",
    event => {

        pointers.delete(
            event.pointerId
        );

    }
);


/* =====================================================
   IMAGE UPLOAD
===================================================== */

designUpload.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showToast(
                "اختر ملف صورة"
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            resultEvent => {

                const src =
                    resultEvent.target.result;

                designState.image =
                    src;

                uploadedDesign.src =
                    src;

                designLayer.classList.add(
                    "has-image"
                );

                designState.x = 50;
                designState.y = 48;
                designState.scale = 1;
                designState.rotation = 0;

                applyDesignTransform();

                showToast(
                    "تم رفع التصميم"
                );

            };


        reader.readAsDataURL(file);

    }
);


/* =====================================================
   SHIRT COLORS
===================================================== */

document
    .querySelectorAll(
        ".shirt-color"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".shirt-color"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                button.classList.add(
                    "active"
                );


                const color =
                    button.dataset.shirt;

                designState.shirt =
                    color;


                const images = {
                    white:
                        SHIRT_IMAGE,

                    black:
                        SHIRT_IMAGE,

                    green:
                        SHIRT_IMAGE,

                    gray:
                        SHIRT_IMAGE
                };


                shirtImage.src =
                    images[color];


                /*
                    ملاحظة:
                    الصورة الأساسية بيضاء.
                    تغيير ألوان الصور الواقعية بشكل
                    صحيح يحتاج mockup منفصل لكل لون
                    أو معالجة صور في الخلفية.
                */

                if (
                    color === "black"
                ) {

                    shirtImage.style.filter =
                        "brightness(.22) drop-shadow(0 35px 35px rgba(0,0,0,.2))";

                }

                else if (
                    color === "green"
                ) {

                    shirtImage.style.filter =
                        "brightness(.55) sepia(.35) saturate(1.8) hue-rotate(90deg) drop-shadow(0 35px 35px rgba(0,0,0,.2))";

                }

                else if (
                    color === "gray"
                ) {

                    shirtImage.style.filter =
                        "grayscale(.7) brightness(.8) drop-shadow(0 35px 35px rgba(0,0,0,.2))";

                }

                else {

                    shirtImage.style.filter =
                        "drop-shadow(0 35px 35px rgba(0,0,0,.16))";

                }

            }
        );

    });


/* =====================================================
   RESET
===================================================== */

document
    .getElementById("resetDesign")
    .addEventListener(
        "click",
        () => {

            designState.x = 50;
            designState.y = 48;
            designState.scale = 1;
            designState.rotation = 0;
            designState.image = null;

            uploadedDesign.src = "";

            designLayer.classList.remove(
                "has-image"
            );

            designUpload.value = "";

            designName.value = "";

            applyDesignTransform();

            showToast(
                "تمت إعادة ضبط التصميم"
            );

        }
    );


/* =====================================================
   ADD CUSTOM DESIGN
===================================================== */

document
    .getElementById("addDesignToCart")
    .addEventListener(
        "click",
        addDesignToCart
    );


/* =====================================================
   AI UI
===================================================== */

const aiModal =
    document.getElementById(
        "aiModal"
    );

const openAiButton =
    document.getElementById(
        "openAiButton"
    );

const closeAiModal =
    document.getElementById(
        "closeAiModal"
    );

const modalGenerate =
    document.getElementById(
        "modalGenerate"
    );

const modalPrompt =
    document.getElementById(
        "modalAiPrompt"
    );

const modalResult =
    document.getElementById(
        "modalAiResult"
    );


function openAi() {

    aiModal.classList.add("open");

    aiModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeAi() {

    aiModal.classList.remove(
        "open"
    );

    aiModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


openAiButton.addEventListener(
    "click",
    openAi
);


closeAiModal.addEventListener(
    "click",
    closeAi
);


aiModal.addEventListener(
    "click",
    event => {

        if (
            event.target === aiModal
        ) {
            closeAi();
        }

    }
);


/*
    هذه الواجهة جاهزة للـAI الحقيقي.

    لا نضع API Key داخل المتصفح.
    عند إضافة Backend/API يتم استدعاء:
    
    POST /api/generate-design

    وإرسال:
    
    {
        prompt: "..."
    }

    ثم استلام:
    
    {
        image: "data:image/png;base64,..."
    }

    ووضع الصورة مباشرة في المصمم.
*/


async function requestAIDesign(
    prompt,
    statusElement
) {

    if (!prompt.trim()) {

        statusElement.textContent =
            "اكتب وصف التصميم أولًا.";

        return;

    }


    statusElement.textContent =
        "واجهة الذكاء الاصطناعي جاهزة للربط بخدمة التوليد.";


    /*
        لا يتم إرسال أي طلب خارجي هنا
        حتى لا نكشف API Key للمستخدمين.

        في المرحلة القادمة نربط Backend آمن
        بتوليد الصور الحقيقي.
    */

}


document
    .getElementById(
        "generateAiButton"
    )
    .addEventListener(
        "click",
        () => {

            requestAIDesign(
                aiPrompt.value,
                aiStatus
            );

        }
    );


modalGenerate.addEventListener(
    "click",
    () => {

        requestAIDesign(
            modalPrompt.value,
            modalResult
        );

        modalResult.classList.add(
            "show"
        );

    }
);


/* =====================================================
   ACCOUNT
===================================================== */

document
    .getElementById("loginButton")
    .addEventListener(
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
                    "اكتب الاسم والبريد الإلكتروني.";

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
                `أهلًا ${name} 👋`;

        }
    );


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.simaToastTimer
    );


    window.simaToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   INIT
===================================================== */

function init() {

    loadCart();

    renderProducts();

    applyDesignTransform();

    showPage("home");

}


init();
