export const autoWidth = (
  node,
  options = { minWidth: "1.5ch", maxWidth: "none" }
) => {
  /* Constants */
  const update = new Event("update");
  const visibility = "hidden";
  const whiteSpace = "pre";
  const minWidth = options.minWidth;
  const maxWidth = options.maxWidth;
  const computedStyles = window.getComputedStyle(node);
  const fontFamily = computedStyles.getPropertyValue("font-family");
  const fontSize = computedStyles.getPropertyValue("font-size");
  const fontWeight = computedStyles.getPropertyValue("font-weight");
  const fontStyle = computedStyles.getPropertyValue("font-style");
  const letterSpacing = computedStyles.getPropertyValue("letter-spacing");

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

    Object.assign(mirror.style, {
      display: "inline",
      position: "absolute",
      left: "-9999px",
      visibility,
      whiteSpace,
      minWidth,
      maxWidth,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      letterSpacing,
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
      console.log(`"${e.target.value}"`);
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
