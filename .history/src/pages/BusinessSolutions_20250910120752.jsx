import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

const BusinessSolutions = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const reasonsRef = useRef(null);
  const solutionsRef = useRef(null);
  const pinnedSectionRef = useRef(null);
  const slidingSectionRef = useRef(null);
  
  const [currentProblem, setCurrentProblem] = useState(0);
  const problems = ["accounting", "sales", "legal", "finance", "hr", "auditing"];

  useEffect(() => {
    // Set initial states - titles visible immediately, content hidden
    gsap.set([".hero-title", ".hero-subtitle"], { opacity: 1, y: 0 });
    gsap.set([".methodology-content", ".methodology-phase"], { opacity: 0, y: 30 });
    gsap.set([".reasons-content", ".reason-card"], { opacity: 0, y: 30 });
    gsap.set([".solutions-content", ".service-card"], { opacity: 0, y: 30 });
    gsap.set(".transition-morph", { scale: 0, transformOrigin: "center" });

    // Cycling text animation
    const cycleProblems = () => {
      gsap.to(".problem-text", {
        duration: 0.5,
        opacity: 0,
        y: -20,
        onComplete: () => {
          setCurrentProblem((prev) => (prev + 1) % problems.length);
          gsap.fromTo(".problem-text", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
      });
    };

    const interval = setInterval(cycleProblems, 2000);

    // Hero section - only fade out animation with morphing transition
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
      .to(".hero-title", { opacity: 0, y: -30, duration: 0.5 })
      .to(".hero-subtitle", { opacity: 0, y: -30, duration: 0.5 }, "-=0.3")
      .to(".hero-section", { scale: 1.1, duration: 0.8 }, "-=0.4");

    // Solutions methodology section - content-driven transitions
    const methodologyTl = gsap.timeline({
      scrollTrigger: {
        trigger: pinnedSectionRef.current,
        start: "top top",
        end: "+=2800",
        scrub: 2,
        pin: true,
        anticipatePin: 1,
      },
    });

    methodologyTl
      .to(".methodology-content", { opacity: 1, y: 0, duration: 0.5 })
      .to(".methodology-phase", { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }, "-=0.3")
      .to(".phase-bg", { scale: 1.05, opacity: 0.8, duration: 1, stagger: 0.1 }, "-=0.5")
      .to(".methodology-phase", { opacity: 0, y: -20, duration: 0.4, stagger: 0.1 }, "+=1")
      .to(".methodology-section", { scale: 1.1, duration: 0.8 }, "-=0.2");

    // Reasons section - emerging from methodology
    const reasonsTl = gsap.timeline({
      scrollTrigger: {
        trigger: reasonsRef.current,
        start: "top top",
        end: "+=1800",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    reasonsTl
      .to(".reasons-content", { opacity: 1, y: 0, duration: 0.4 })
      .to(".reason-card", { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.2")
      .to(".reason-card", { scale: 1.02, duration: 0.3, stagger: 0.05 }, "-=0.3")
      .to(".reasons-content", { opacity: 0, y: -20, duration: 0.4 }, "+=1")
      .to(".reasons-section", { scale: 1.1, duration: 0.8 }, "-=0.2");

    // Solutions section - professional presentation
    const solutionsTl = gsap.timeline({
      scrollTrigger: {
        trigger: solutionsRef.current,
        start: "top top",
        end: "+=1200",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    solutionsTl
      .to(".solutions-content", { opacity: 1, y: 0, duration: 0.4 })
      .to(".solutions-line", { width: "100%", duration: 0.6 }, "-=0.2")
      .to(".solutions-content", { opacity: 0, y: -20, duration: 0.4 }, "+=1")
      .to(".solutions-section", { scale: 1.1, duration: 0.8 }, "-=0.2");

    // Service cards section - systematic reveal
    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top top",
        end: "+=1800",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    servicesTl
      .to(".service-card", { opacity: 1, y: 0, duration: 0.8, stagger: 0.04 })
      .to(".service-card", { scale: 1.02, duration: 0.3, stagger: 0.02 }, "-=0.4")
      .to(".service-card", { scale: 1, duration: 0.3, stagger: 0.02 }, "-=0.2");

    return () => {
      clearInterval(interval);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const methodologyPhases = [
    {
      title: "Strategic Planning",
      description: "We analyze your market position and develop comprehensive strategies aligned with your business objectives."
    },
    {
      title: "Implementation",
      description: "Our expert team executes solutions with precision, ensuring seamless integration with your existing operations."
    },
    {
      title: "Growth & Optimization",
      description: "Continuous monitoring and optimization to maximize ROI and drive sustainable business growth."
    }
  ];

  const whyChooseReasons = [
    {
      title: "Industry Expertise",
      description: "Deep understanding of market dynamics across various sectors and business models."
    },
    {
      title: "Proven Results",
      description: "Track record of successful business transformations and sustainable growth achievements."
    },
    {
      title: "Partnership Approach",
      description: "We work as an extension of your team, committed to your long-term success and growth."
    }
  ];

  const services = [
    { title: "Financial Solutions", color: "bg-blue-500" },
    { title: "Legal Consultation", color: "bg-green-500" },
    { title: "Business Development & Sales", color: "bg-purple-500" },
    { title: "Supply Chain & Logistics", color: "bg-orange-500" },
    { title: "IT Solutions", color: "bg-cyan-500" },
    { title: "Human Resources Services", color: "bg-pink-500" },
    { title: "Web and Mobile Development", color: "bg-indigo-500" },
    { title: "Marketing and Advertising", color: "bg-red-500" },
    { title: "Public Relations Services", color: "bg-yellow-500" }
  ];

  return (
    <main ref={containerRef} className="w-full relative kkfont normal">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section h-screen bg-gradient-to-br from-[#1D7CB9] to-[#0F4A6B] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-15"></div>
        
        {/* Professional hexagon pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full gap-2 p-8">
            {Array.from({length: 48}).map((_, i) => (
              <div key={i} className="border border-white transform rotate-45 rounded-sm"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center text-white px-8 max-w-6xl">
          <h1 className="hero-title text-6xl md:text-8xl font-light tracking-tight mb-8">
            We solve your{" "}
            <span className="problem-text text-yellow-400 inline-block font-medium">
              {problems[currentProblem]}
            </span>
            <br />problems
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl font-light opacity-90 max-w-4xl mx-auto leading-relaxed">
            Comprehensive business solutions designed to<br />transform challenges into opportunities
          </p>
        </div>
      </section>

      {/* Methodology Section with Content-Driven Transitions */}
      <section ref={pinnedSectionRef} className="methodology-section min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        
        
        <div className="text-center text-white px-8 max-w-6xl relative z-10">
          <div className="methodology-content flex flex-col items-center justify-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-light mb-12 tracking-tight text-center">Our Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
              {methodologyPhases.map((phase, index) => (
                <div key={index} className="methodology-phase bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20 relative overflow-hidden">
                  <div className="phase-bg absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-20 scale-100"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-500 bg-opacity-30 rounded-full mb-6 mx-auto"></div>
                    <h3 className="text-2xl font-bold mb-4 text-center">{phase.title}</h3>
                    <p className="text-gray-200 text-center leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section ref={reasonsRef} className="reasons-section min-h-screen bg-white flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Why You Need<br />Business Solutions
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="reasons-content flex flex-col items-center justify-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
              {whyChooseReasons.map((reason, index) => (
                <div key={index} className="reason-card bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="w-16 h-16 bg-[#1D7CB9] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slide Trigger for Business Section */}
      <div className="slide-trigger-business h-screen"></div>

      {/* Sliding Business Section */}
      <div className="relative h-screen">
        <section ref={slidingSectionRef} className="absolute w-full h-full bg-gradient-to-r from-green-600 to-blue-700 flex items-center justify-center text-white">
          <div className="text-center px-8 max-w-5xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Transform Your Business Today</h2>
            <p className="text-xl md:text-2xl opacity-90 mb-12">Partner with us to unlock your business potential and achieve sustainable growth through our comprehensive solutions.</p>
            <button className="bg-white text-blue-700 px-12 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started Now
            </button>
          </div>
        </section>
      </div>

      {/* Solutions Description Section */}
      <section ref={solutionsRef} className="solutions-section min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center relative">
        <div className="max-w-6xl mx-auto px-8 text-center w-full solutions-content">
          <h2 className="text-5xl md:text-6xl font-light mb-8 text-gray-900 tracking-tight">
            360° Business Solutions
          </h2>
          <div className="solutions-line w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-light">
            At BinRashid Egypt, we provide comprehensive business solutions across all critical areas—from financial 
            management and legal consultation to technology development and strategic marketing. Our integrated approach 
            ensures your business operates efficiently and achieves sustainable growth.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="min-h-screen bg-white flex items-center justify-center relative">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Our Service Portfolio
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {services.map((service, index) => (
              <div key={index} className="service-card group">
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-[#1D7CB9] transform hover:-translate-y-2">
                  <div className={`w-16 h-16 ${service.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-[#1D7CB9] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <div className="w-12 h-1 bg-[#1D7CB9] group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-[#1D7CB9] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Let's discuss how our comprehensive solutions can address your specific challenges and drive sustainable growth.
          </p>
          <button className="bg-white text-[#1D7CB9] px-12 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
            Get Your Free Consultation
          </button>
        </div>
      </section>
    </main>
  );
};

export default BusinessSolutions;
