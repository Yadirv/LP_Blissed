// Blog Card Component JavaScript
// Handles interactions for blog preview cards

window.ComponentLoader.registerComponent("blog-card", (root) => {
  if (root.__initialized) return;
  root.__initialized = true;

  console.log("[BlogCard] Initializing blog card");

  // Track clicks for analytics (optional)
  root.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && root.contains(link)) {
      const postId = root.getAttribute("data-post-id");
      const postTitle = root.querySelector(".blog-card__title")?.textContent.trim();

      console.log("[BlogCard] Post clicked:", {
        id: postId,
        title: postTitle,
        url: link.href,
      });

      // Here you could send to analytics service
      // Example: gtag('event', 'blog_card_click', { post_id: postId });
    }
  });

  // Add keyboard accessibility
  const titleLink = root.querySelector(".blog-card__title a");
  if (titleLink) {
    root.setAttribute("tabindex", "0");

    root.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        titleLink.click();
      }
    });
  }

  // Lazy load image if not already visible
  const img = root.querySelector("img");
  if (img && !img.complete) {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";

    img.addEventListener("load", () => {
      img.style.opacity = "1";
    });
  }
});
