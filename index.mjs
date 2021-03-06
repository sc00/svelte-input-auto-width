export const autoWidth = (node) => {
  /* Constants */
  const update = new Event("update");
  const buffer = 5;

  /* Functions */
  const init = () => {
    addStyles();
    observeElement();
    addEventListeners();
    setInitialWidth();
  };

  const dispatchUpdateEvent = () => {
    node.dispatchEvent(update);
  };

  const setInitialWidth = () => {
    let width;

    if (node.placeholder && !node.value) {
      node.value = node.placeholder;
      node.style.width = "0px";
      width = node.scrollWidth;
      node.value = "";
    } else {
      node.style.width = "0px";
      width = node.scrollWidth;
    }

    node.style.width = width + buffer + "px";
  };

  const setWidth = () => {
    node.style.width = "0px";
    node.style.width = node.scrollWidth + buffer + "px";
  };

  const addStyles = () => {
    node.style.boxSizing = "border-box";
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
    node.addEventListener("input", () => {
      dispatchUpdateEvent();
    });
    node.addEventListener("update", setWidth);
  };

  const removeEventListeners = () => {
    node.removeEventListener("input", dispatchUpdateEvent);
    node.removeEventListener("update", setWidth);
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
      },
    };
  }
};
