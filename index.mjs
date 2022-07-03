export const autoWidth = (
  node,
  options = { minWidth: "1.5ch", maxWidth: "none" }
) => {
  /* Constants */
  const update = new Event("update");
  const computedStyles = window.getComputedStyle(node);
  const mirrorStyles = {
    display: "inline",
    "font-family": computedStyles.getPropertyValue("font-family"),
    "font-size": computedStyles.getPropertyValue("font-size"),
    "font-weight": computedStyles.getPropertyValue("font-weight"),
    "font-style": computedStyles.getPropertyValue("font-style"),
    left: "-9999px",
    "letter-spacing": computedStyles.getPropertyValue("letter-spacing"),
    "max-width": options.maxWidth,
    "min-width": options.minWidth,
    padding: computedStyles.getPropertyValue("padding"),
    position: "absolute",
    visibility: "hidden",
    "white-space": "pre",
  };

  /* Variables */
  let mirror;

  /* Functions */
  const init = () => {
    createMirror();
    observeElement();
    addEventListeners();
    syncElements();
  };

  const dispatchUpdateEvent = () => {
    node.dispatchEvent(update);
  };

  const createMirror = () => {
    mirror = document.createElement("div");

    Object.keys(mirrorStyles).forEach((key) => {
      mirror.style.setProperty(key, mirrorStyles[key]);
    });

    mirror.classList.add("svelte-input-auto-width-mirror");
    mirror.setAttribute("aria-hidden", "true");

    document.body.appendChild(mirror);
  };

  const removeMirror = () => {
    document.body.removeChild(mirror);
  };

  const observeElement = () => {
    let elementPrototype = Object.getPrototypeOf(node);
    let descriptor = Object.getOwnPropertyDescriptor(elementPrototype, "value");
    Object.defineProperty(node, "value", {
      get: function () {
        return descriptor.get.apply(this, arguments);
      },
      set: function () {
        descriptor.set.apply(this, arguments);
        dispatchUpdateEvent();
      },
    });
  };

  const addEventListeners = () => {
    node.addEventListener("input", (e) => {
      dispatchUpdateEvent();
    });
    node.addEventListener("update", syncElements);
  };

  const removeEventListeners = () => {
    node.removeEventListener("input", dispatchUpdateEvent);
    node.removeEventListener("update", syncElements);
  };

  const syncElements = () => {
    mirror.innerText = node.value ? node.value : node.placeholder || "";
    node.style.width = mirror.scrollWidth + "px";
  };

  if (node.tagName.toLowerCase() !== "input") {
    throw new Error(
      "svelte-input-auto-width can only be used on input elements."
    );
  } else {
    init();

    return {
      destroy() {
        removeEventListeners();
        removeMirror();
      },
    };
  }
};
