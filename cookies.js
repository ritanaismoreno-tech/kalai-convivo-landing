/* Aviso de cookies y Google Analytics de convivo.kalai.com.es.
   Misma lógica que kalai.com.es: Google Analytics (propiedad "Kalai") solo se
   carga si la persona pulsa "Aceptar". Aceptar y Rechazar tienen el mismo peso
   visual (criterio de la AEPD). El enlace "Configurar cookies" del pie vuelve a
   abrir el aviso. */
(function () {
  var GA_ID = "G-W2L39JWEXK";
  var KEY = "kalai-cookies"; // "granted" | "denied"

  function readChoice() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "granted" || v === "denied" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function saveChoice(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {
      /* Sin almacenamiento: el aviso volverá a salir. */
    }
  }

  function loadAnalytics() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    // La visita se envía a mano: en Google Analytics está desactivado contar
    // cambios de página por el historial.
    window.gtag("config", GA_ID, { send_page_view: false });
    window.gtag("event", "page_view", { page_location: location.href, page_title: document.title });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ["", host, "." + host, "." + host.split(".").slice(-3).join(".")];
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name.indexOf("_ga") !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + "=; Max-Age=0; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  var css =
    ".ck-wrap{position:fixed;left:0;right:0;bottom:0;z-index:9999;padding:12px}" +
    ".ck-box{max-width:760px;margin:0 auto;background:#31312f;color:#f8f6f3;border:1px solid #44443f;" +
    "box-shadow:0 20px 50px rgba(0,0,0,.5);padding:16px;display:flex;flex-direction:column;gap:12px;" +
    "font-family:var(--body,'Work Sans',sans-serif)}" +
    ".ck-text{margin:0;font-size:12px;line-height:1.6;color:#a8a59f}" +
    ".ck-text a{color:#f8f6f3;text-decoration:underline;text-underline-offset:3px}" +
    ".ck-btns{display:flex;gap:12px}" +
    ".ck-btn{flex:1;background:transparent;color:#f8f6f3;border:1px solid #44443f;padding:10px 16px;" +
    "font:700 12px/1 var(--body,'Work Sans',sans-serif);text-transform:uppercase;letter-spacing:.04em;cursor:pointer}" +
    ".ck-btn:hover{border-color:#f8f6f3}" +
    "@media(min-width:640px){.ck-wrap{padding:24px}.ck-box{flex-direction:row;align-items:center;gap:24px;padding:20px}" +
    ".ck-text{font-size:13px;flex:1}.ck-btn{flex:none}}";

  var wrap = null;

  function close() {
    if (wrap) wrap.remove();
    wrap = null;
  }

  function decide(choice) {
    var previous = readChoice();
    saveChoice(choice);
    close();
    if (choice === "granted") {
      loadAnalytics();
    } else if (previous === "granted") {
      clearAnalyticsCookies();
      location.reload();
    }
  }

  function open() {
    if (wrap) return;
    if (!document.getElementById("ck-style")) {
      var st = document.createElement("style");
      st.id = "ck-style";
      st.textContent = css;
      document.head.appendChild(st);
    }
    wrap = document.createElement("div");
    wrap.className = "ck-wrap";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-live", "polite");
    wrap.setAttribute("aria-label", "Aviso de cookies");
    wrap.innerHTML =
      '<div class="ck-box">' +
      '<p class="ck-text">Usamos cookies de Google Analytics para saber cuántas personas visitan la web y qué páginas les interesan. ' +
      'Solo se activan si aceptas. Más información en la <a href="https://kalai.com.es/politica-cookies">política de cookies</a>.</p>' +
      '<div class="ck-btns"><button type="button" class="ck-btn" data-ck="denied">Rechazar</button>' +
      '<button type="button" class="ck-btn" data-ck="granted">Aceptar</button></div></div>';
    wrap.addEventListener("click", function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute("data-ck");
      if (v) decide(v);
    });
    document.body.appendChild(wrap);
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("[data-cookie-settings]");
    if (a) {
      e.preventDefault();
      open();
    }
  });

  function start() {
    var choice = readChoice();
    if (choice === "granted") loadAnalytics();
    else if (choice === null) open();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
