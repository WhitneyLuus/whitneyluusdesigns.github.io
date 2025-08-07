document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(
    Draggable, DrawSVGPlugin, EaselPlugin, Flip, GSDevTools, InertiaPlugin,
    MotionPathHelper, MotionPathPlugin, MorphSVGPlugin, Observer, Physics2DPlugin,
    PhysicsPropsPlugin, PixiPlugin, ScrambleTextPlugin, ScrollTrigger, ScrollSmoother,
    ScrollToPlugin, SplitText, TextPlugin, RoughEase, ExpoScaleEase, SlowMo,
    CustomEase, CustomBounce, CustomWiggle
  );

  let animationDone = false;
  let pageLoaded = false;
  let animationStarted = false;
  let animationDelayTimeout;

  // 1. Schedule animation start only if page takes long to load (e.g. 800ms)
  animationDelayTimeout = setTimeout(() => {
    animationStarted = true;

    let loading_tl = gsap.timeline({
      onComplete: () => {
        animationDone = true;
        checkReady();
      }
    });

    loading_tl
      .to(".l-box1", {duration: .2, scale: 1.25})
      .to(".splash", {duration: .0, backgroundColor: "#F4D738"})
      .to(".l-box1", {duration: .25, scale: 1, borderRadius: 100, ease: "bounce.out"})
      .to(".l-box1", {duration: .4, x: 120}, "+=0.05")
      .to(".l-box2", {duration: .4, y: 120}, "<")
      .to(".l-box4", {duration: .4, x: -120}, "<")
      .to(".l-box3", {duration: .4, y: -120}, "<")
      .to(".l-box3", {duration: .2, scale: 1.25})
      .to(".splash", {duration: .0, backgroundColor: "#87CEEB"})
      .to(".l-box3", {duration: .25, scale: 1, borderRadius: 100, ease: "bounce.out"})
      .to(".l-box3", {duration: .4, x: 120}, "+=0.05")
      .to(".l-box1", {duration: .4, y: 120}, "<")
      .to(".l-box2", {duration: .4, x: -120}, "<")
      .to(".l-box4", {duration: .4, y: -120}, "<")
      .to(".l-box4", {duration: .2, scale: 1.25})
      .to(".splash", {duration: .0, backgroundColor: "#FF6B6B"})
      .to(".l-box4", {duration: .25, scale: 1, borderRadius: 100, ease: "bounce.out"})
      .to(".l-box4", {duration: .4, x: "+=120"}, "+=0.05")
      .to(".l-box3", {duration: .4, y: "+=120"}, "<")
      .to(".l-box1", {duration: .4, x: "-=120"}, "<")
      .to(".l-box2", {duration: .4, y: "-=120"}, "<")
      .to(".l-box2", {duration: .2, scale: 1.25})
      .to(".splash", {duration: .0, backgroundColor: "#90EE90"})
      .to(".l-box2", {duration: .25, scale: 1, borderRadius: 100, ease: "bounce.out"})
      .to(".l-box2", {duration: .4, x: "+=120"}, "+=0.05")
      .to(".l-box4", {duration: .4, y: "+=120"}, "<")
      .to(".l-box3", {duration: .4, x: "-=120"}, "<")
      .to(".l-box1", {duration: .4, y: "-=120"}, "<")
      .to(".l-box1", {duration: .5, borderRadius: 0, ease: "bounce.out"}, "+=0.20")
      .to(".l-box2", {duration: .5, borderRadius: 0, ease: "bounce.out"}, "<")
      .to(".l-box3", {duration: .5, borderRadius: 0, ease: "bounce.out"}, "<")
      .to(".l-box4", {duration: .5, borderRadius: 0, ease: "bounce.out"}, "<");
  }, 800); // <- delay threshold here

  // 2. Page finished loading
  window.addEventListener('load', () => {
    pageLoaded = true;

    // If animation hasn’t started, cancel it
    if (!animationStarted) {
      clearTimeout(animationDelayTimeout);
      animationDone = true;
    }

    checkReady();
  });

  // 3. Once both page + animation are done, hide splash
  function checkReady() {
    if (animationDone && pageLoaded) {
      const app = document.getElementById('app');
      app.style.display = 'block';

      gsap.to('.splash', {
        duration: 0.5,
        opacity: 0,
        ease: 'power1.out',
        onComplete: () => {
          document.querySelector('.splash').remove();
        }
      });
    }

    startTechIconsMarquee();
  }
});
