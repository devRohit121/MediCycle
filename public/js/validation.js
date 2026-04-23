document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form.needs-validate");

  // simple message map
  const messages = {
    email: "Email is required",
    password: "Password is required",
    phone: "Phone is required",
    name: "Name is required",
    id: "ID is required",
    default: "This field is required",
  };

  // detect nested field key safely
  const getKey = (field) => {
    if (field.dataset.key) return field.dataset.key;

    // batch[name] -> name
    const match = field.name.match(/\[(.*?)\]/);
    return match ? match[1] : field.name;
  };

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      let isValid = true;

      form.querySelectorAll("[required]").forEach((field) => {
        const key = getKey(field);

        const label = field.dataset.label || key;

        const errorId = field.name + "-error";

        let errorEl = document.getElementById(errorId);

        if (!errorEl) {
          errorEl = document.createElement("p");
          errorEl.className = "text-red-500 text-sm mt-1";
          field.insertAdjacentElement("afterend", errorEl);
        }

        field.classList.remove("border-red-500");

        if (!field.value.trim()) {
          isValid = false;
          errorEl.textContent = `${label} is required`;
          field.classList.add("border-red-500");
        } else {
          errorEl.textContent = "";
        }
      });

      if (!isValid) e.preventDefault();
    });
  });
});