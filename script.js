const pages = document.querySelectorAll(".page");
const portfolioView = document.getElementById("portfolio-view");

const units = [
    { id: 1, name: "UNIDAD 01" },
    { id: 2, name: "UNIDAD 02" },
    { id: 3, name: "UNIDAD 03" },
    { id: 4, name: "UNIDAD 04" }
];

const GITHUB_USER = "carranzaf322-art";
const GITHUB_REPO = "Algoritmos-Estructuras-de-Datos-portafolio";
const GITHUB_BRANCH = "main";

const GITHUB_API =
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/documentos`;

const GITHUB_WEB =
    `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/tree/${GITHUB_BRANCH}/documentos`;


// ===============================
// NAVEGACIÓN
// ===============================

function showPage(id) {

    pages.forEach(page => {
        page.classList.toggle("active", page.id === id);
    });

    window.scrollTo(0, 0);
}


document.addEventListener("click", event => {

    const target = event.target.closest("[data-page]");

    if (!target) return;

    const page = target.dataset.page;

    showPage(page);

    if (page === "portfolio") {
        openExplorer();
    }
});


// ===============================
// BUSCADOR
// ===============================

document.addEventListener("input", event => {

    if (event.target.id !== "file-search") return;

    const text = event.target.value.toLowerCase().trim();

    document.querySelectorAll(".file").forEach(file => {

        const name =
            file.querySelector(".file-name")?.textContent.toLowerCase() || "";

        file.style.display =
            name.includes(text) ? "" : "none";
    });
});


// ===============================
// RUTA
// ===============================

function getFolderPath(unit, week) {

    return `unidad-${String(unit).padStart(2, "0")}/semana-${String(week).padStart(2, "0")}`;
}


// ===============================
// LEER GITHUB
// ===============================

async function getFiles(path) {

    try {

        const response =
            await fetch(`${GITHUB_API}/${path}?t=${Date.now()}`);

        if (!response.ok) return [];

        const data = await response.json();

        if (!Array.isArray(data)) return [];

        return data.filter(file =>
            file.type === "file" &&
            file.name !== ".gitkeep"
        );

    } catch (error) {

        console.error(error);

        return [];
    }
}


// ===============================
// EXPLORADOR PRINCIPAL
// ===============================

function openExplorer() {

    portfolioView.innerHTML = `

        <div class="explorer-header">

            <p class="eyebrow">
                EXPLORADOR DE ARCHIVOS
            </p>

            <h1>
                PORTAFOLIO
            </h1>

            <p>
                Selecciona una unidad.
            </p>

        </div>

        <div class="folder-grid">

            ${units.map(unit => `

                <article
                    class="folder"
                    data-unit="${unit.id}">

                    <div class="folder-icon">
                        📁
                    </div>

                    <h2>
                        ${unit.name}
                    </h2>

                    <p>
                        4 semanas
                    </p>

                </article>

            `).join("")}

        </div>
    `;


    document.querySelectorAll("[data-unit]").forEach(folder => {

        folder.addEventListener("click", () => {

            openWeeks(
                Number(folder.dataset.unit)
            );

        });

    });
}


// ===============================
// SEMANAS
// ===============================

async function openWeeks(unitId) {

    const unit =
        units.find(u => u.id === unitId);


    portfolioView.innerHTML = `

        <div class="topbar">

            <button
                class="back"
                id="back-units">

                ← Unidades

            </button>

            <span>
                ${unit.name}
            </span>

        </div>

        <div class="explorer-header">

            <p class="eyebrow">
                EXPLORADOR / ${unit.name}
            </p>

            <h1>
                SEMANAS
            </h1>

        </div>

        <div class="week-grid">

            ${[1,2,3,4].map(week => `

                <article
                    class="week"
                    data-week="${week}">

                    <div class="week-icon">
                        📂
                    </div>

                    <h2>
                        SEMANA ${week}
                    </h2>

                    <p>
                        Abrir carpeta
                    </p>

                </article>

            `).join("")}

        </div>
    `;


    document
        .getElementById("back-units")
        .addEventListener(
            "click",
            openExplorer
        );


    document.querySelectorAll("[data-week]").forEach(card => {

        card.addEventListener("click", () => {

            openFiles(
                unitId,
                Number(card.dataset.week)
            );

        });

    });
}


// ===============================
// ARCHIVOS
// ===============================

async function openFiles(unitId, weekId) {

    const path =
        getFolderPath(unitId, weekId);


    portfolioView.innerHTML = `

        <div class="topbar">

            <button
                class="back"
                id="back-weeks">

                ← Semanas

            </button>

            <span>
                U${unitId} / S${weekId}
            </span>

        </div>

        <div class="explorer-header">

            <p class="eyebrow">
                ${path}
            </p>

            <h1>
                SEMANA ${weekId}
            </h1>

            <p>
                Cargando archivos...
            </p>

        </div>
    `;


    const files =
        await getFiles(path);


    portfolioView.innerHTML = `

        <div class="topbar">

            <button
                class="back"
                id="back-weeks">

                ← Semanas

            </button>

            <span>
                U${unitId} / S${weekId}
            </span>

        </div>


        <div class="explorer-header">

            <p class="eyebrow">
                EXPLORADOR DE ARCHIVOS
            </p>

            <h1>
                SEMANA ${weekId}
            </h1>

            <p>
                ${files.length} documento${files.length === 1 ? "" : "s"}
            </p>

        </div>


        <div class="file-list">

            ${
                files.length === 0

                ?

                `
                    <div class="empty">

                        <p>
                            📂 CARPETA VACÍA
                        </p>

                        <small>
                            No hay documentos todavía.
                        </small>

                    </div>
                `

                :

                files.map(file => `

                    <div class="file">

                        <div class="file-icon">
                            ${getFileIcon(file.name)}
                        </div>

                        <div class="file-info">

                            <strong class="file-name">
                                ${escapeHTML(file.name)}
                            </strong>

                            <small>
                                ${getFileType(file.name)}
                                ·
                                ${formatSize(file.size)}
                            </small>

                        </div>

                        <div class="file-actions">

                            <button
                                class="file-btn"
                                onclick="openFile('${escapeAttribute(file.html_url)}')">

                                👁 VER

                            </button>

                        </div>

                    </div>

                `).join("")
            }

        </div>


        <div class="add-file-container">

            <button
                class="btn primary"
                id="add-file">

                ＋ AGREGAR DOCUMENTO

            </button>

        </div>
    `;


    document
        .getElementById("back-weeks")
        .addEventListener(
            "click",
            () => openWeeks(unitId)
        );


    document
        .getElementById("add-file")
        .addEventListener(
            "click",
            () => {

                const folder =
                    `${GITHUB_WEB}/${path}`;

                window.open(
                    folder,
                    "_blank"
                );

            }
        );
}


// ===============================
// ABRIR DOCUMENTO
// ===============================

function openFile(url) {

    if (!url) return;

    window.open(
        url,
        "_blank"
    );
}


// ===============================
// ICONOS
// ===============================

function getFileIcon(name) {

    const ext =
        name.split(".").pop().toLowerCase();

    const icons = {

        pdf: "📕",

        doc: "📘",
        docx: "📘",

        xls: "📗",
        xlsx: "📗",

        ppt: "📙",
        pptx: "📙",

        jpg: "🖼️",
        jpeg: "🖼️",
        png: "🖼️",
        gif: "🖼️",

        zip: "🗜️",
        rar: "🗜️",

        mp4: "🎬",

        mp3: "🎵",

        txt: "📄",

        csv: "📊",

        json: "⚙️"

    };

    return icons[ext] || "📄";
}


// ===============================
// TIPO
// ===============================

function getFileType(name) {

    const parts = name.split(".");

    if (parts.length < 2) {
        return "ARCHIVO";
    }

    return parts.pop().toUpperCase();
}


// ===============================
// TAMAÑO
// ===============================

function formatSize(bytes) {

    if (!bytes) return "0 Bytes";

    const sizes =
        ["Bytes", "KB", "MB", "GB"];

    const i =
        Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

    return (
        Math.round(
            bytes /
            Math.pow(1024, i) *
            100
        ) / 100
    ) + " " + sizes[i];
}


// ===============================
// SEGURIDAD
// ===============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function escapeAttribute(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// ===============================
// INICIO
// ===============================

if (portfolioView) {
    openExplorer();
}
