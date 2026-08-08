(() => {
  const root = document.querySelector(".architecture-page");
  if (!root) return;

  const stories = Array.from(
    root.querySelectorAll("[data-scene-trigger]"),
  );
  const sceneLabel = root.querySelector(".architecture-scene-label");
  const tags = Array.from(root.querySelectorAll(".architecture-tag"));

  const setScene = (scene, animate = true) => {
    const activeStory = stories.find(
      (story) => story.dataset.sceneTrigger === scene,
    );

    root.dataset.scene = scene;
    stories.forEach((story) => {
      const isActive = story === activeStory;
      story.classList.toggle("is-active", isActive);
      if (isActive) story.setAttribute("aria-current", "step");
      else story.removeAttribute("aria-current");
    });

    if (sceneLabel && activeStory) {
      sceneLabel.textContent = activeStory.dataset.sceneTitle ?? "架構圖";
    }

    if (!animate || !window.gsap) return;

    const activeTags = tags.filter((tag) => {
      if (scene === "compare") return true;
      return tag.dataset.owner === scene;
    });
    const inactiveTags = tags.filter((tag) => !activeTags.includes(tag));

    window.gsap
      .timeline({ defaults: { duration: 0.42, ease: "power2.out" } })
      .to(
        inactiveTags,
        { autoAlpha: 0.16, scale: 0.97, overwrite: "auto" },
        0,
      )
      .to(
        activeTags,
        { autoAlpha: 1, scale: 1, stagger: 0.025, overwrite: "auto" },
        0,
      );
  };

  if (!window.gsap || !window.ScrollTrigger) {
    root.dataset.scene = "compare";
    stories.forEach((story) => story.classList.add("is-active"));
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const media = gsap.matchMedia();

  media.add(
    {
      desktop: "(min-width: 901px)",
      mobile: "(max-width: 900px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;

      if (reduceMotion || !desktop) {
        root.dataset.scene = "compare";
        tags.forEach((tag) => gsap.set(tag, { clearProps: "all" }));
        stories.forEach((story) => story.classList.add("is-active"));
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".architecture-map", {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
        })
        .from(
          ".architecture-layer",
          { autoAlpha: 0, y: 10, stagger: 0.07, duration: 0.55 },
          "-=0.45",
        );

      const triggers = stories.map((story) =>
        ScrollTrigger.create({
          trigger: story,
          start: "top 52%",
          end: "bottom 52%",
          onEnter: () => setScene(story.dataset.sceneTrigger),
          onEnterBack: () => setScene(story.dataset.sceneTrigger),
        }),
      );

      setScene("base", false);

      return () => {
        triggers.forEach((trigger) => trigger.kill());
        tags.forEach((tag) => gsap.set(tag, { clearProps: "all" }));
      };
    },
  );

  window.addEventListener(
    "load",
    () => requestAnimationFrame(() => ScrollTrigger.refresh()),
    { once: true },
  );
})();
