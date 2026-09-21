const pages = document.querySelectorAll(".page");
const portfolioView = document.getElementById("portfolio-view");

const units = [
  {
    id: 1,
    name: "UNIDAD 01"
  },
  {
    id: 2,
    name: "UNIDAD 02"
  },
  {
    id: 3,
    name: "UNIDAD 03"
  },
  {
    id: 4,
    name: "UNIDAD 04"
  }
];


// ========================================
// CONFIGURACIÓN DEL REPOSITORIO
// ========================================

const GITHUB_USER = "carranzaf322-art";

const GITHUB_REPO =
  "Algoritmos-Estructuras-de-Datos-portafolio";

const GITHUB_BRANCH = "main";

const GITHUB_DOCUMENTS =
  "documentos";

const GITHUB_API =
  `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${GITHUB_DOCUMENTS}`;

const GITHUB_WEB =
  `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/tree/${GITHUB_BRANCH}/${GITHUB_DOCUMENTS}`;


// ========================================
// NAVEGACIÓN
// ========================================

function showPage(id) {

  pages.forEach(page => {

    page.classList.toggle(
      "active",
      page.id === id
    );

  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


document.addEventListener("click", event => {

  const target =
    event.target.closest("[data-page]");

  if (!target) {
    return;
  }

  const page =
    target.dataset.page;

  if (page === "portfolio") {

    renderUnits();

  }

  showPage(page);

});


// ========================================
// BUSCADOR
// ========================================

document.addEventListener("input", event => {

  if (event.target.id !== "file-search") {
    return;
  }

  const search =
    event.target.value
      .toLowerCase()
      .trim();

  document
    .querySelectorAll(".file")
    .forEach(file => {

      const name =
        file
          .querySelector(".file-name")
          ?.textContent
          .toLowerCase() || "";

      file.style.display =
        name.includes(search)
          ? ""
          : "none";

    });

});


// ========================================
// CREAR RUTA DE UNA SEMANA
// ========================================

function getFolderPath(unitId, weekId) {

  return (
    `unidad-${String(unitId).padStart(2, "0")}` +
    `/semana-${String(weekId).padStart(2, "0")}`
  );

}


// ========================================
// OBTENER ARCHIVOS DESDE GITHUB
// ========================================

async function getFiles(folder) {

  const url =
    `${GITHUB_API}/${folder}`;

  try {

    const response =
      await fetch(url);

    if (!response.ok) {

      if (response.status === 404) {
        return [];
      }

      throw new Error(
        `Error HTTP ${response.status}`
      );

    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter(item => {

        return (
          item.type === "file" &&
          item.name !== ".gitkeep"
        );

      })
      .map(item => {

        return {

          name: item.name,

          size: item.size || 0,

          type:
            getFileType(item.name),

          url:
            item.html_url,

          download_url:
            item.download_url,

          path:
            item.path

        };

      });

  }

  catch (error) {

    console.error(
      "Error obteniendo archivos:",
      error
    );

    return [];

  }

}


// ========================================
// MOSTRAR UNIDADES
// ========================================

async function renderUnits() {

  portfolioView.innerHTML = `

    <div class="explorer-header">

      <p class="eyebrow">
        EXPLORADOR ACADÉMICO
      </p>

      <h1>
        PORTAFOLIO
      </h1>

      <p>
        Cargando unidades...
      </p>

    </div>

  `;


  const unitCards =
    await Promise.all(

      units.map(async unit => {

        let total = 0;

        for (
          let week = 1;
          week <= 4;
          week++
        ) {

          const path =
            getFolderPath(
              unit.id,
              week
            );

          const files =
            await getFiles(path);

          total += files.length;

        }


        return `

          <article
            class="folder"
            data-unit="${unit.id}">

            <div class="folder-icon">
              ⚔️
            </div>

            <h2>
              ${unit.name}
            </h2>

            <p>
              4 semanas
            </p>

            <p>
              📦 ${total}
              archivo${total === 1 ? "" : "s"}
            </p>

          </article>

        `;

      })

    );


  portfolioView.innerHTML = `

    <div class="explorer-header">

      <p class="eyebrow">
        EXPLORADOR ACADÉMICO
      </p>

      <h1>
        PORTAFOLIO
      </h1>

      <p>
        Selecciona una unidad para acceder a sus semanas.
      </p>

    </div>


    <div class="folder-grid">

      ${unitCards.join("")}

    </div>

  `;


  document
    .querySelectorAll("[data-unit]")
    .forEach(folder => {

      folder.addEventListener(
        "click",
        () => {

          renderWeeks(
            Number(folder.dataset.unit)
          );

        }
      );

    });

}


// ========================================
// MOSTRAR SEMANAS
// ========================================

async function renderWeeks(unitId) {

  const unit =
    units.find(
      item => item.id === unitId
    );


  portfolioView.innerHTML = `

    <div class="explorer-header">

      <p class="eyebrow">
        EXPLORADOR / ${unit.name}
      </p>

      <h1>
        SEMANAS
      </h1>

      <p>
        Cargando semanas...
      </p>

    </div>

  `;


  const weekCards =
    await Promise.all(

      [1, 2, 3, 4].map(async week => {

        const path =
          getFolderPath(
            unitId,
            week
          );

        const files =
          await getFiles(path);


        return `

          <article
            class="week"
            data-week="${week}">

            <div class="week-icon">
              📜
            </div>

            <h2>
              SEMANA ${week}
            </h2>

            <p>
              ${files.length}
              archivo${files.length === 1 ? "" : "s"}
            </p>

          </article>

        `;

      })

    );


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

      <p>
        Selecciona una semana para ver sus archivos.
      </p>

    </div>


    <div class="week-grid">

      ${weekCards.join("")}

    </div>

  `;


  document
    .getElementById("back-units")
    .addEventListener(
      "click",
      renderUnits
    );


  document
    .querySelectorAll("[data-week]")
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          renderFiles(
            unitId,
            Number(card.dataset.week)
          );

        }
      );

    });

}


// ========================================
// MOSTRAR ARCHIVOS
// ========================================

async function renderFiles(
  unitId,
  weekId
) {

  const path =
    getFolderPath(
      unitId,
      weekId
    );


  portfolioView.innerHTML = `

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
        ${path}
      </p>

      <h1>
        SEMANA ${weekId}
      </h1>

      <p>
        ${files.length}
        archivo${files.length === 1 ? "" : "s"}
        en esta semana.
      </p>

    </div>


    <div
      class="file-list"
      id="file-list">

      ${
        files.length === 0

        ?

        `

          <div class="empty">

            <p>
              📦 INVENTARIO VACÍO
            </p>

            <small>
              Todavía no hay documentos en esta semana.
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
                onclick="openFile('${escapeAttribute(file.url)}')">

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


  // ======================================
  // VOLVER A SEMANAS
  // ======================================

  document
    .getElementById("back-weeks")
    .addEventListener(
      "click",
      () => renderWeeks(unitId)
    );


  // ======================================
  // BOTÓN AGREGAR DOCUMENTO
  // ======================================

  document
    .getElementById("add-file")
    .addEventListener(
      "click",
      () => {

        const githubFolder =
          `${GITHUB_WEB}/${path}`;


        const confirmar =
          confirm(
            "Se abrirá GitHub para agregar el documento a esta semana."
          );


        if (!confirmar) {
          return;
        }


        window.open(
          githubFolder,
          "_blank"
        );

      }
    );

}


// ========================================
// ABRIR ARCHIVO
// ========================================

function openFile(url) {

  if (!url) {

    alert(
      "No se encontró el enlace del documento."
    );

    return;

  }


  window.open(
    url,
    "_blank"
  );

}


// ========================================
// ICONO SEGÚN TIPO
// ========================================

function getFileIcon(name) {

  const extension =
    name
      .split(".")
      .pop()
      .toLowerCase();


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
    webp: "🖼️",

    mp4: "🎬",
    avi: "🎬",
    mov: "🎬",

    mp3: "🎵",
    wav: "🎵",

    zip: "🗜️",
    rar: "🗜️",
    "7z": "🗜️",

    txt: "📄",

    html: "🌐",
    css: "🎨",
    js: "⚙️",
    php: "🐘",

    csv: "📊",
    json: "⚙️",

    exe: "⚙️"

  };


  return (
    icons[extension] ||
    "📄"
  );

}


// ========================================
// TIPO DE ARCHIVO
// ========================================

function getFileType(name) {

  const extension =
    name
      .split(".")
      .pop()
      .toUpperCase();


  if (
    !extension ||
    extension === name.toUpperCase()
  ) {

    return "ARCHIVO";

  }


  return extension;

}


// ========================================
// FORMATO DEL TAMAÑO
// ========================================

function formatSize(bytes) {

  if (!bytes) {

    return "0 Bytes";

  }


  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];


  const i =
    Math.floor(
      Math.log(bytes) /
      Math.log(1024)
    );


  return (

    Math.round(

      bytes /
      Math.pow(1024, i) *
      100

    ) / 100

  )
  + " "
  + sizes[i];

}


// ========================================
// SEGURIDAD HTML
// ========================================

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text;

  return div.innerHTML;

}


// ========================================
// SEGURIDAD DE ATRIBUTOS
// ========================================

function escapeAttribute(text) {

  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

}


// ========================================
// INICIAR
// ========================================

renderUnits();
