import "./style.css";
import { renderLayout } from "./ui/layout.js";
import { router } from "./router.js";

renderLayout();
router();
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
