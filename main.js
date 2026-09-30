(function () {
  const root = document.documentElement;

  // If the CDN scripts were blocked, fall back to the static (fully visible) layout.
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("js");
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS shows final state

  gsap.registerPlugin(ScrollTrigger);


  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const road      = document.getElementById("road");
  const car       = document.getElementById("car");
  const trail     = document.getElementById("trail");
  const trailText = document.getElementById("trailText");

  const roadW = () => road.offsetWidth;
  gsap
    .timeline({ defaults: { ease: "power3.out" } })

    .from(road, {
      clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "power3.inOut",
      onComplete: () => gsap.set(road, { clearProps: "clipPath" }),
    })

    .from(car, { xPercent: -110, duration: 1.2 }, 0.1)
    .from("#hint", { opacity: 0, y: 12, duration: 0.7 }, "-=0.4");




  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=300%",        
      pin: true,
      scrub: 0.8,           
      invalidateOnRefresh: true, 
      anticipatePin: 1,
    },
  });

  tl.fromTo(car, { x: 0 }, { x: () => roadW(), duration: 1 }, 0);


  tl.fromTo(trail,     { x: 0 }, { x: () =>  roadW(), duration: 1 }, 0);
  tl.fromTo(trailText, { x: 0 }, { x: () => -roadW(), duration: 1 }, 0);

  tl.to("#hint", { opacity: 0, duration: 0.05 }, 0);


  [
    [".card--lime",   -1, 0.22],
    [".card--dark",   -1, 0.36],
    [".card--blue",    1, 0.50],
    [".card--orange",  1, 0.64],
  ].forEach(([sel, dir, at]) => {
    const card = document.querySelector(sel);
    const num  = card.querySelector("[data-count]");
    tl.fromTo(card,
      { opacity: 0, y: dir * 40, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" }, at);

    tl.fromTo(num,
      { textContent: 0 },
      { textContent: +num.dataset.count, duration: 0.18, ease: "power1.out", snap: { textContent: 1 } }, at);
  });

 
  gsap.set("#scene", { visibility: "visible" });
})();