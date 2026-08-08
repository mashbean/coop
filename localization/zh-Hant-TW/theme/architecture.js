(() => {
  const root = document.querySelector(".architecture-page");
  if (!root) return;

  const stories = Array.from(
    root.querySelectorAll("[data-scene-trigger]"),
  );
  const sceneLabel = root.querySelector(".architecture-scene-label");
  const steps = Array.from(root.querySelectorAll("[data-scene-step]"));
  const ownerPanels = Array.from(root.querySelectorAll("[data-owner]"));

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

    steps.forEach((step) => {
      const isActive = step.dataset.sceneStep === scene;
      step.classList.toggle("is-active", isActive);
      if (isActive) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });

    if (sceneLabel && activeStory) {
      sceneLabel.textContent = activeStory.dataset.sceneTitle ?? "架構圖";
    }

    if (!animate || !window.gsap) return;

    const activePanels = ownerPanels.filter((panel) => {
      if (scene === "base") return false;
      if (scene === "compare") return true;
      return panel.dataset.owner === scene;
    });
    const inactivePanels = ownerPanels.filter(
      (panel) => !activePanels.includes(panel),
    );
    const inactivePanelOpacity = scene === "base" ? 0 : 0.08;
    const activeStep = steps.filter((step) => step.dataset.sceneStep === scene);
    const inactiveSteps = steps.filter((step) => !activeStep.includes(step));

    const sceneTimeline = window.gsap.timeline({
      defaults: { duration: 0.38, ease: "power2.out" },
    });

    if (inactivePanels.length) {
      sceneTimeline.to(
        inactivePanels,
        {
          autoAlpha: inactivePanelOpacity,
          scale: 0.985,
          overwrite: "auto",
        },
        0,
      );
    }
    if (activePanels.length) {
      sceneTimeline.to(
        activePanels,
        { autoAlpha: 1, scale: 1, stagger: 0.035, overwrite: "auto" },
        0,
      );
    }
    sceneTimeline
      .to(
        inactiveSteps,
        { autoAlpha: 0.48, scale: 1, overwrite: "auto" },
        0,
      )
      .to(
        activeStep,
        { autoAlpha: 1, scale: 1.025, overwrite: "auto" },
        0,
      );
  };

  if (!window.gsap || !window.ScrollTrigger) {
    root.dataset.scene = "compare";
    stories.forEach((story) => story.classList.add("is-active"));
    steps.forEach((step) => step.classList.add("is-active"));
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
        setScene("compare", false);
        ownerPanels.forEach((panel) => gsap.set(panel, { clearProps: "all" }));
        stories.forEach((story) => story.classList.add("is-active"));
        steps.forEach((step) => step.classList.add("is-active"));
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
          ".architecture-step",
          { autoAlpha: 0, y: 8, stagger: 0.06, duration: 0.45 },
          "-=0.48",
        )
        .from(
          ".architecture-zone",
          { autoAlpha: 0, y: 10, stagger: 0.06, duration: 0.5 },
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
        ownerPanels.forEach((panel) => gsap.set(panel, { clearProps: "all" }));
        steps.forEach((step) => gsap.set(step, { clearProps: "all" }));
      };
    },
  );

  window.addEventListener(
    "load",
    () => requestAnimationFrame(() => ScrollTrigger.refresh()),
    { once: true },
  );
})();
