import "./style.css";
import { renderLayout } from "./ui/layout.js";
import { router } from "./router.js";

renderLayout();

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
