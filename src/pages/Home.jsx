import React, { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const container = useRef(null);
  const videoRef = useRef(null);
  const cityVideoRef = useRef(null);
  const navRef = useRef(null);
  const poweringVideoRef = useRef(null);
  const growVideoRef = useRef(null);
  const launchVideoRef = useRef(null);
  const struggleVideoRef = useRef(null);

  // Helper to warm up and await readiness of a video element
  const warmUpVideo = async (videoEl) => {
    if (!videoEl) return;
    videoEl.preload = "auto";
    videoEl.muted = true;
    const waitForMeta = () =>
      new Promise((resolve) => {
        if (videoEl.readyState >= 1) return resolve();
        const handler = () => {
          videoEl.removeEventListener("loadedmetadata", handler);
          resolve();
        };
        videoEl.addEventListener("loadedmetadata", handler);
      });
    const waitForCanPlay = () =>
      new Promise((resolve) => {
        if (videoEl.readyState >= 3) return resolve();
        const handler = () => {
          videoEl.removeEventListener("canplaythrough", handler);
          resolve();
        };
        videoEl.addEventListener("canplaythrough", handler);
      });
    try {
      await waitForMeta();
      await waitForCanPlay();
      const dur =
        videoEl.duration && !Number.isNaN(videoEl.duration) ? videoEl.duration : 1;
      videoEl.currentTime = Math.min(0.05, Math.max(0, dur - 0.05));
      await videoEl.play();
      videoEl.pause();
    } catch (_) { }
  };

  // Preload all videos before initializing GSAP
  useEffect(() => {
    const vids = [
      cityVideoRef.current,
      poweringVideoRef.current,
      growVideoRef.current,
      launchVideoRef.current,
      struggleVideoRef.current,
    ].filter(Boolean);

    if (vids.length === 0) {
      setIsLoading(false);
      setIsReady(true);
      return;
    }

    Promise.all(vids.map((v) => warmUpVideo(v)))
      .catch(() => { })
      .finally(() => {
        setIsLoading(false);
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const cityVideo = cityVideoRef.current;
    const poweringVideo = poweringVideoRef.current;

    // Set city video playback rate to 0.67x (1.5x slower)
    if (cityVideo) {
      cityVideo.playbackRate = 0.67;
      cityVideo.muted = true;
      cityVideo.play && cityVideo.play().catch(() => { });
    }
    gsap.set(
      [
        ".text1-body",
        ".text2-head",
        ".text2-body",
        ".text3-head",
        ".text3-body",
      ],
      { opacity: 0, y: 50 }
    );

    // Prepare powering growth video
    if (poweringVideo) {
      gsap.set(poweringVideo, { opacity: 0 });
    }

    // Section 2 timeline: pin and animate text with side video
    const tlSection2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".section2",
        start: "top top",
        end: "+=2000",
        scrub: 2,
        pin: true,
        anticipatePin: 1,
      },
    });

    if (poweringVideo) {
      const poweringEase = gsap.parseEase("power2.out");
      ScrollTrigger.create({
        trigger: ".section2",
        start: "top top",
        end: "+=2000",
        scrub: true,
        onUpdate: (self) => {
          const d =
            poweringVideo.duration && !Number.isNaN(poweringVideo.duration)
              ? poweringVideo.duration
              : 8;
          const offset = Math.min(0.6, Math.max(0.1, d * 0.05));
          const p = poweringEase(self.progress);
          const target = Math.min(d - 0.033, Math.max(0.033, offset + p * (d - offset)));
          poweringVideo.currentTime = target;
        },
      });

      // Show video slightly before text; remove video fades (baked in)
      tlSection2
        .set(poweringVideo, { opacity: 1 })
        .set([".section2 .text-head", ".section2 .text-body"], {
          opacity: 0,
          y: 50,
        })
        .to(".section2 .text-head", { duration: 0.8, opacity: 1, y: 0 })
        .to(".section2 .text-body", { duration: 0.8, opacity: 1, y: 0 }, "-=0.4")
        .to([".section2 .text-head", ".section2 .text-body"], {
          opacity: 0,
          y: -50,
          duration: 0.8,
        }, "+=0.8")
        .set(poweringVideo, { opacity: 0 });
    }

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".section4",
        start: "top top",
        end: "+=2000", // will be updated dynamically based on video durations
        scrub: 2,
        pin: true,
        markers: false,
        anticipatePin: 1,
      },
    });

    const growVideo = growVideoRef.current;
    const launchVideo = launchVideoRef.current;
    const struggleVideo = struggleVideoRef.current;

    // Prepare section4 videos
    // rows visibility initialization
    // Start with only row1 visible to avoid stacking issues
    gsap.set([".row1", ".row2", ".row3"], { autoAlpha: 0 });
    gsap.set(".row1", { autoAlpha: 1 });

    // Durations based on video metadata (fallbacks if not ready)
    const getDur = (v, fb) =>
      v && v.duration && !Number.isNaN(v.duration) && v.duration > 0
        ? v.duration
        : fb;
    let d1 = getDur(growVideo, 6);
    let d2 = getDur(launchVideo, 8);
    let d3 = getDur(struggleVideo, 6);

    // Use each video's duration to set scroll distance proportionally
    const pixelsPerSecond = 350; // tune scroll density
    const totalPx = Math.max(1200, Math.round((d1 + d2 + d3) * pixelsPerSecond));
    if (tl2.scrollTrigger) {
      tl2.scrollTrigger.vars.end = `+=${totalPx}`;
      tl2.scrollTrigger.refresh();
    }

    // Segment 1: show row1 before text
    tl2
      .set([".row1", ".row2", ".row3"], { autoAlpha: 0 })
      .set(".row1", { autoAlpha: 1 })
      .call(() => {
        // Nudge time forward to ensure first frame is decoded
        if (growVideo && growVideo.duration && !Number.isNaN(growVideo.duration)) {
          const offset = Math.min(0.6, Math.max(0.1, growVideo.duration * 0.05));
          if (growVideo.currentTime < offset) {
            growVideo.currentTime = Math.min(offset, growVideo.duration - 0.033);
          }
        }
      })
      .to(".text1-head", { duration: d1 * 0.25, opacity: 1, y: 0 })
      .to(".text1-body", { duration: d1 * 0.25, opacity: 1, y: 0 }, `-=${d1 * 0.1}`)
      .to([".text1-head", ".text1-body"], { opacity: 0, y: -50, duration: d1 * 0.25 }, `+=${d1 * 0.15}`)

    // Segment 2
    tl2
      .set([".row1", ".row2", ".row3"], { autoAlpha: 0 })
      .set(".row2", { autoAlpha: 1 })
      .call(() => {
        if (launchVideo && launchVideo.duration && !Number.isNaN(launchVideo.duration)) {
          const offset = Math.min(0.6, Math.max(0.1, launchVideo.duration * 0.05));
          if (launchVideo.currentTime < offset) {
            launchVideo.currentTime = Math.min(offset, launchVideo.duration - 0.033);
          }
        }
      })
      .to(".text2-head", { duration: d2 * 0.25, opacity: 1, y: 0 })
      .to(".text2-body", { duration: d2 * 0.25, opacity: 1, y: 0 }, `-=${d2 * 0.1}`)
      .to([".text2-head", ".text2-body"], { opacity: 0, y: -50, duration: d2 * 0.25 }, `+=${d2 * 0.15}`)

    // Segment 3
    tl2
      .set([".row1", ".row2", ".row3"], { autoAlpha: 0 })
      .set(".row3", { autoAlpha: 1 })
      .call(() => {
        if (struggleVideo && struggleVideo.duration && !Number.isNaN(struggleVideo.duration)) {
          const offset = Math.min(0.6, Math.max(0.1, struggleVideo.duration * 0.05));
          if (struggleVideo.currentTime < offset) {
            struggleVideo.currentTime = Math.min(offset, struggleVideo.duration - 0.033);
          }
        }
      })
      .to(".text3-head", { duration: d3 * 0.25, opacity: 1, y: 0 })
      .to(".text3-body", { duration: d3 * 0.25, opacity: 1, y: 0 }, `-=${d3 * 0.1}`)
      .to([".text3-head", ".text3-body"], { opacity: 0, y: -50, duration: d3 * 0.25 }, `+=${d3 * 0.15}`)

    const section4Scrubber = ScrollTrigger.create({
      trigger: ".section4",
      start: "top top",
      end: `+=${totalPx}`,
      scrub: true,
      onUpdate: (self) => {
        // Update durations in case metadata just became available
        d1 = getDur(growVideo, d1);
        d2 = getDur(launchVideo, d2);
        d3 = getDur(struggleVideo, d3);
        const total = d1 + d2 + d3;
        const t = self.progress * total;
        const clamp = (val, max) => Math.min(Math.max(val, 0.033), Math.max(0.033, max - 0.033));

        const offset1 = Math.min(0.6, Math.max(0.1, d1 * 0.05));
        const offset2 = Math.min(0.6, Math.max(0.1, d2 * 0.05));
        const offset3 = Math.min(0.6, Math.max(0.1, d3 * 0.05));
        const ease = gsap.parseEase("power2.out");

        if (t <= d1) {
          const p = ease(t / d1);
          if (growVideo) growVideo.currentTime = clamp(offset1 + p * (d1 - offset1), d1);
          if (launchVideo) launchVideo.currentTime = 0.033;
          if (struggleVideo) struggleVideo.currentTime = 0.033;
        } else if (t <= d1 + d2) {
          const t2 = t - d1;
          const p2 = ease(t2 / d2);
          if (growVideo) growVideo.currentTime = Math.max(0.033, d1 - 0.033);
          if (launchVideo) launchVideo.currentTime = clamp(offset2 + p2 * (d2 - offset2), d2);
          if (struggleVideo) struggleVideo.currentTime = 0.033;
        } else {
          const t3 = t - d1 - d2;
          const p3 = ease(t3 / d3);
          if (growVideo) growVideo.currentTime = Math.max(0.033, d1 - 0.033);
          if (launchVideo) launchVideo.currentTime = Math.max(0.033, d2 - 0.033);
          if (struggleVideo) struggleVideo.currentTime = clamp(offset3 + p3 * (d3 - offset3), d3);
        }
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isReady]);


  // Computes an offset equal to the nav height (prevents content hiding under a fixed navbar)
  const getOffsetY = () => (navRef.current?.offsetHeight ?? 0) + 8; // +8 for a little breathing room

  const scrollToSection = useCallback((selector) => {
    gsap.to(window, {
      duration: 1,
      ease: "power2.inOut",
      scrollTo: { y: selector, offsetY: getOffsetY() },
    });
  }, []);

  return (
    <main ref={container} className="w-full home relative kkfont normal">
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 border-4 border-[#1D7CB9] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#1D7CB9]">Loading experience…</p>
          </div>
        </div>
      )}
      {/* Section 1 - No animations */}
      <section className="section1 w-screen h-screen bg-white z-0 overflow-hidden">
        <div className="text kkfont normal text-left absolute mt-[75vh] left-0 right-0 p-4 text-2xl sm:text-3xl lg:text-5xl z-10 bg-white">
          <p>Looking to grow your business?</p>
          <p className="text-[#1D7CB9] mt-2">We Got you covered!</p>
        </div>
        <div className="burj absolute top-0 right-0 z-[1] absolute inset-0 lg:w-screen h-screen lg:z-0 overflow-hidden">

          <video
            ref={cityVideoRef}
            className="  w-screen h-screen object-cover"
            src="city.mp4"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>

      {/* Section 2 - Text left, video right (scrubbed) */}
      <section id="home" className="section2 relative w-screen min-h-screen z-20 bg-white">
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Text */}
          <div className="flex flex-col items-start justify-center text-black px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-head text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Powering Growth Across MENA</h1>
            <p className="text-body text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
              We own and operate across Egypt, Saudi Arabia, and the UAE, with
              successful companies thriving in diverse sectors. This hands-on
              presence grants us unmatched market intelligence and operational
              agility. We deliver proven, localized, and strategic solutions
              that give your business a real head start.
            </p>
          </div>
          {/* Right: Video */}
          <div className="relative w-full h-64 sm:h-80 lg:h-full overflow-hidden">
            <video
              ref={poweringVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="powering_growth.mp4"
              playsInline
              muted
              preload="auto"
            />
          </div>
        </div>
      </section>

      {/* Section 4 - Expands from small box */}
      <section
        id="services"
        className="section4 mt-12 sm:mt-24 w-screen min-h-screen z-50 bg-white px-4 sm:px-6 lg:px-12"
      >
        <div className="relative w-full min-h-screen py-8 sm:py-12">
          {/* Row 1: text left, video right */}
          <div className="row1 absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center w-full max-w-6xl">
              <div className="order-1 px-2 sm:px-4">
                <h1 className="text1-head text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 max-w-xl">
                  Looking To Grow Your Business Into New Regions?
                </h1>
                <p className="text1-body text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  Taking your company into Egypt, the UAE, or Saudi Arabia can be complex, but we simplify the process. Our team handles legal approvals, financial setup, licensing, and market entry strategies so you can expand smoothly and efficiently. We also assist with UAE or Saudi residency visas, helping you establish a long-term presence for sustained growth
                </p>
              </div>
              <div className="order-2 relative w-full h-48 sm:h-64 lg:h-[60vh] overflow-hidden rounded-lg">
                <video ref={growVideoRef} className="absolute inset-0 w-full h-full object-contain" src="looking_to_grow.mp4" playsInline muted preload="auto" />
              </div>
            </div>
          </div>

          {/* Row 2: video left, text right */}
          <div className="row2 absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center w-full max-w-6xl">
              <div className="order-2 lg:order-1 relative w-full h-48 sm:h-64 lg:h-[60vh] overflow-hidden rounded-lg">
                <video ref={launchVideoRef} className="absolute inset-0 w-full h-full object-contain" src="ready_to_launch.mp4" playsInline muted preload="auto" />
              </div>
              <div className="order-1 lg:order-2 px-2 sm:px-4">
                <h1 className="text2-head text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 max-w-xl">
                  Ready To Launch A Startup In The Middle East?
                </h1>
                <p className="text2-body text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  We provide end-to-end support for entrepreneurs and startups, from choosing the right jurisdiction to business structuring, branding, and go-to-market strategies. With extensive regional insights, we help ensure your startup gets off the ground successfully.
                </p>
              </div>
            </div>
          </div>

          {/* Row 3: text left, video right */}
          <div className="row3 absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-center w-full max-w-6xl">
              <div className="order-1 px-2 sm:px-4">
                <h1 className="text3-head text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 max-w-xl">
                  Struggling With The Practicalities Of Market Entry?
                </h1>
                <p className="text3-body text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                  Our specialists guide you through complex compliance frameworks and entry protocols. We assist in documentation, translation, legal guidance, and official interactions so your entry into MENA markets is smooth and secure.
                </p>
              </div>
              <div className="order-2 relative w-full h-48 sm:h-64 lg:h-[60vh] overflow-hidden rounded-lg">
                <video ref={struggleVideoRef} className="absolute inset-0 w-full h-full object-contain" src="struggling.mp4" playsInline muted preload="auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 - Normal scroll */}
      <section
        id="values"
        className="section5 w-screen min-h-screen z-60 bg-black"
      >
        <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center">Mission</h1>
              <p className="text-sm sm:text-base lg:text-lg text-center leading-relaxed">
                At BinRashid Group Egypt, our mission is to empower businesses
                to thrive in a dynamic and competitive landscape by delivering
                comprehensive, innovative, and tailored business solutions. We
                are committed to providing exceptional services across finance,
                accounting, auditing, legal consultation, sales, and business
                development, ensuring our clients achieve sustainable growth and
                operational excellence.
              </p>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center">Vision</h1>
              <p className="text-sm sm:text-base lg:text-lg text-center leading-relaxed">
                To transform the way businesses operate by delivering
                integrated, innovative solutions that unlock potential and drive
                sustainable growth. We aspire to be the driving force behind our
                clients' success, setting new standards of excellence and
                professionalism.
              </p>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center">Values</h1>
              <p className="text-sm sm:text-base lg:text-lg text-center leading-relaxed">
                Thought Partnership, Leadership, Be the Solution, Deliver with
                Excellence, Learn and Teach, Diversity
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section6 w-screen min-h-screen bg-white">
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center">Get in Touch</h2>
          <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 text-center max-w-md sm:max-w-lg lg:max-w-2xl leading-relaxed">
            Ready to take your business to the next level? Contact us today to
            learn more about our services and how we can help you succeed.
          </p>
          <button className="bg-[#1D7CB9] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg hover:bg-blue-700 transition-colors duration-300">
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
}
