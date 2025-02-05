document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star");
  const ratingValue = document.getElementById("ratingValue");
  const ratingInput = document.getElementById("ratingInput");

  const defaultRating = 1; // Default rating value
  ratingValue.textContent = defaultRating;
  ratingInput.value = defaultRating;

  // Set default stars as active
  stars.forEach((s, index) => {
    s.classList.toggle("active", index < defaultRating);
  });

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const value = Number(this.getAttribute("data-value")) || 0;
      ratingValue.textContent = value;
      ratingInput.value = value; // Update hidden input

      // Highlight selected stars
      stars.forEach((s, index) => {
        s.classList.toggle("active", index < value);
      });
    });
  });
});
