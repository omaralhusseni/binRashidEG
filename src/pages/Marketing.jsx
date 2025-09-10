import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

const Marketing = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const expertiseRef = useRef(null);
  const servicesRef = useRef(null);
  const whyChooseRef = useRef(null);

  useEffect(() => {
    // Set initial states
    gsap.set([".hero-title", ".hero-subtitle"], { opacity: 1, y: 0 });
    gsap.set([".expertise-text", ".innovation-text", ".results-text"], { opacity: 0, y: 50 });
    gsap.set([".services-content", ".service-category", ".service-item"], { opacity: 0, y: 30 });
    gsap.set([".why-content", ".benefit-card"], { opacity: 0, y: 30 });

    // Hero section - morphing element grows from underline
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: false,
      },
    });

    heroTl
      .to(".hero-title", { opacity: 0, y: -50, duration: 0.5 })
      .to(".hero-subtitle", { opacity: 0, y: -50, duration: 0.5 }, "-=0.3")
      .to(".morph-element", { 
        width: "100vw", 
        height: "100vh", 
        borderRadius: "0%",
        backgroundColor: "#581c87",
        duration: 0.8 
      }, "-=0.2");

    // Expertise section - background color morphing
    const expertiseTl = gsap.timeline({
      scrollTrigger: {
        trigger: expertiseRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 2,
        pin: true,
      },
    });

    expertiseTl
      .to(".expertise-bg", { backgroundColor: "#7c3aed", duration: 0.5 })
      .to(".expertise-text", { opacity: 1, y: 0, duration: 0.8 })
      .to(".expertise-text", { opacity: 0, y: -30, duration: 0.5 }, "+=1")
      .to(".expertise-bg", { backgroundColor: "#0891b2", duration: 0.8 })
      .to(".innovation-text", { opacity: 1, y: 0, duration: 0.8 })
      .to(".innovation-text", { opacity: 0, y: -30, duration: 0.5 }, "+=1")
      .to(".expertise-bg", { backgroundColor: "#059669", duration: 0.8 })
      .to(".results-text", { opacity: 1, y: 0, duration: 0.8 })
      .to(".results-text", { opacity: 0, y: -30, duration: 0.5 }, "+=1")
      .to(".expertise-bg", { backgroundColor: "#ffffff", duration: 0.8 });

    // Services section
    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesRef.current,
        start: "top top",
        end: "+=2000",
        scrub: 1,
        pin: true,
      },
    });

    servicesTl
      .to(".services-content", { opacity: 1, y: 0, duration: 0.5 })
      .to(".service-category", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.3")
      .to(".service-item", { opacity: 1, y: 0, duration: 1, stagger: 0.02 }, "-=0.5")
      .to(".services-content", { opacity: 0, y: -50, duration: 0.5 }, "+=0.5")
      .to(".services-section", { backgroundColor: "#eab308", duration: 0.8 });

    // Why Choose Us section
    const whyTl = gsap.timeline({
      scrollTrigger: {
        trigger: whyChooseRef.current,
        start: "top top",
        end: "+=1500",
        scrub: 1,
        pin: true,
      },
    });

    whyTl
      .to(".why-content", { opacity: 1, y: 0, duration: 0.4 })
      .to(".benefit-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, "-=0.2");

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const serviceCategories = [
    {
      title: "CREATIVE SERVICES",
      color: "from-purple-500 to-pink-500",
      services: ["BRANDING", "CONTENT CREATION", "COPYWRITING"]
    },
    {
      title: "DIGITAL MARKETING",
      color: "from-blue-500 to-cyan-500", 
      services: ["SEO OPTIMIZATION", "EMAIL MARKETING", "SOCIAL MEDIA", "MARKET RESEARCH", "MEDIA PLANNING", "CRM"]
    },
    {
      title: "WEB & MOBILE DEVELOPMENT",
      color: "from-green-500 to-emerald-500",
      services: [
        "CROSS-PLATFORM MOBILE APP DEVELOPMENT",
        "NATIVE MOBILE APP DEVELOPMENT", 
        "BACKEND DEVELOPMENT",
        "APP MAINTENANCE & SUPPORT",
        "MOBILE APP TESTING & QA",
        "FRONT-END DEVELOPMENT",
        "MOBILE APP DESIGN (UX/UI DESIGN)",
        "WEBSITE DESIGN",
        "WEB MAINTENANCE & SUPPORT"
      ]
    }
  ];

  const benefits = [
    {
      title: "360° Brand Growth",
      description: "From strategic marketing to PR and digital development, we cover every angle to elevate your brand.",
      icon: "🎯"
    },
    {
      title: "Faster, Smarter Results", 
      description: "Our data-driven approach cuts through the noise, delivering higher ROI in less time.",
      icon: "⚡"
    },
    {
      title: "A Partner Who Cares",
      description: "We treat your goals as our own, with dedicated support and adaptive strategies for long-term success.",
      icon: "🤝"
    }
  ];

  return (
    <main ref={containerRef} className="w-full relative kkfont normal">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen bg-gradient-to-br from-[#1D7CB9] via-purple-600 to-pink-600 flex items-center justify-center relative">
        {/* Morphing element - starts as title underline */}
        <div className="morph-element absolute bottom-1/2 left-1/2 w-24 h-1 bg-white transform -translate-x-1/2 translate-y-8 z-50"></div>
        
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({length: 96}).map((_, i) => (
              <div key={i} className="border border-white border-opacity-20"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-8 max-w-6xl">
          <h1 className="hero-title text-6xl md:text-8xl font-light tracking-tight mb-8">
            Marketing &<br />Advertising
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl font-light opacity-90 max-w-4xl mx-auto leading-relaxed">
            Transforming brands through strategic marketing,<br />creative excellence, and cutting-edge digital solutions
          </p>
        </div>
      </section>

      {/* Expertise Section */}
      <section ref={expertiseRef} className="expertise-section h-screen flex items-center justify-center relative">
        <div className="expertise-bg absolute inset-0 bg-purple-900"></div>
        
        <div className="text-center text-white px-8 max-w-6xl relative z-10">
          <div className="expertise-text opacity-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">Creative<br />Excellence</h2>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-3xl leading-relaxed">
              We craft compelling brand stories that resonate with your audience and drive meaningful engagement across all touchpoints.
            </p>
          </div>
          
          <div className="innovation-text opacity-0 absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">Digital<br />Innovation</h2>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-3xl leading-relaxed">
              Leveraging cutting-edge technology and data-driven insights to deliver marketing solutions that exceed expectations.
            </p>
          </div>
          
          <div className="results-text opacity-0 absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">Measurable<br />Results</h2>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-3xl leading-relaxed">
              Every campaign is optimized for performance, delivering tangible ROI and sustainable business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="min-h-screen services-section bg-white flex items-center justify-center relative">
        <div className="services-content max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Marketing Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category, index) => (
              <div key={index} className="service-category bg-gray-50 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{category.title}</h3>
                <ul className="space-y-2">
                  {category.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="service-item text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section ref={whyChooseRef} className="min-h-screen why-section why-bg bg-yellow-400 flex items-center justify-center relative">
        <div className="why-content max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-800">Why Choose BinRashid Group?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card bg-white bg-opacity-90 rounded-lg p-6 text-left">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Marketing;
