export const autoWidth = (node) => {
  /* Constants */
  const update = new Event("update");

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

    if (node.placeholder) {
      node.value = node.placeholder;
      width = node.scrollWidth;
      console.log(width);
      node.value = "";
    } else {
      node.style.width = "0px";
      width = node.scrollWidth;
    }

    node.style.width = width + 5 + "px";
  };

  const setWidth = () => {
    node.style.width = "0px";
    node.style.width = node.scrollWidth + 5 + "px";
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
    node.addEventListener("input", (e) => {
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
