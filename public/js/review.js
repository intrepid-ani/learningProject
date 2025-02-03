document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star");
  const ratingValue = document.getElementById("ratingValue");
  const ratingInput = document.getElementById("ratingInput");

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const value = this.getAttribute("data-value");
      ratingValue.textContent = value;
      ratingInput.value = value; // Set the hidden input value for backend

      // Reset all stars
      stars.forEach((s) => s.classList.remove("active"));

      // Highlight selected stars
      for (let i = 0; i < value; i++) {
        stars[i].classList.add("active");
      }
    });
  });
});
