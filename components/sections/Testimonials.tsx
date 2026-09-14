"use client";

import { useState, useEffect, useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Building, Users, Play } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion, animate } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { RateOnGoogle } from "@/components/RateOnGoogle";

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  // Featured-quote 3D tilt — pointer position (normalised 0..1) → capped rotation, spring-smoothed.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  // Story-style auto-advance: a linear 0→1 progress drives both the ring fill and the slide change.
  const progress = useMotionValue(0);
  const advanceRef = useRef<ReturnType<typeof animate> | null>(null);
  const hoveredRef = useRef(false);

  // Spotlight only (metric tiles) — writes the CSS vars consumed by .spotlight-card::before.
  const handleSpotlight = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }, []);

  // Spotlight + tilt (featured quote card).
  const handleCardPointer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      px.set((e.clientX - r.left) / r.width);
      py.set((e.clientY - r.top) / r.height);
    },
    [px, py]
  );

  const resetTilt = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  const pauseAdvance = useCallback(() => {
    hoveredRef.current = true;
    advanceRef.current?.pause();
  }, []);
  const resumeAdvance = useCallback(() => {
    hoveredRef.current = false;
    advanceRef.current?.play();
  }, []);

  // Video carousel setup with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const scrollPrevVideo = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNextVideo = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollToVideo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedVideoIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const testimonials = [
    { id: 1, name: "Ar. N. Reddy", position: "General Manager", company: "", location: "Hyderabad, Telangana", content: "Saburi Ply has transformed our projects excellent finishing, strength, and service consistency.", rating: 5, projectValue: "₹50+ Lakhs", category: "Construction" },

    { id: 2, name: "Shri Santosh Sangali", position: "Director", company: "Shree Sai", location: "Hubli, Karnataka", content: "Excellent Service and superior quality products. Customers are also very happy . The team is also very helpful and responsible. The marketing team is also very supportive.", rating: 5, projectValue: "₹25+ Lakhs", category: "Interior Design" },

    { id: 3, name: "Shri Anil Katare", position: "Interior Designer", company: "", location: "Bangalore, Karnataka", content: "One of the best plywood I used till now . I suggest everyone to use Saburi plywood as the provide wide ranges of products. They don't compromise in quality and serves best quality plywood. ", rating: 5, projectValue: "₹1+ Crore", category: "Manufacturing" },

    { id: 4, name: "Shri Pankaj P Jain", position: "Dealer", company: "Siddhi Plywood & Hardware", location: "Chitradurga", content: "Dealing with saburi from past 3 years . One of the best plywood till now , and day by day the products are been upgrading. The team and company is very supportive.", rating: 5, projectValue: "₹75+ Lakhs", category: "Construction" },

    { id: 5, name: "Shri Dakshes Mohanlal Patel", position: "Dealer", company: "Katyani Trading", location: "Bangalore, Karnataka", content: "We are using saburi Plywood since 2020, and since than our sales have been increased because of its Top- notch quality product. The team is very supportive.", rating: 5, projectValue: "₹2+ Crores", category: "Retail" },
  ];

  // Video testimonials data
  const videoTestimonials = [
    { id: 1, title: "Saburi PartnerSpeak | Dealers Share Their Success", videoId: "Be2Kzk7MwLE", name: "Shri Prasad G.K.", location: "Nandini Layout, Bangalore" },
    { id: 2, title: "Why Interior Designers Choose SABURI", videoId: "9nbRS7qiCCw", name: "Shri Anil Katare", location: "Bangalore, Karnataka" },
    { id: 3, title: "Superior Plywood for Superior Interiors", videoId: "cWuGOS2dOrI", name: "Shri Santosh Sangali", location: "Hubli, Karnataka" },
    { id: 4, title: "High Repetition, Top Quality - Siddhi Plywood", videoId: "af1ztqZuzXk", name: "Shri Pankaj P. Jain", location: "Siddhi Plywood & Hardware" },
    { id: 5, title: "Competitive Prices, Top Quality - That's Saburi", videoId: "TzuT0vZr9PU", name: "Shri Himmat Patel", location: "Swami Timber, Bangalore" },
    { id: 6, title: "Consistency, Service & Top-Quality Products", videoId: "6frGFKDPnYY", name: "Shri Dakshesh Patel", location: "Katyani Trading, Bangalore" },
    { id: 7, title: "Customer Success Story with SABURI", videoId: "V2yCwNMzCu0", name: "Valued Customer", location: "Karnataka" },
  ];

  // Auto-advance the written testimonial. Reduced motion → plain timer, no ring; otherwise a 15s
  // linear tween fills the progress ring and advances on complete. Re-runs (and resets) per slide,
  // so manual navigation restarts the countdown; pauses while the card is hovered.
  useEffect(() => {
    if (reduce) {
      const t = setInterval(() => {
        setDirection(1);
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 15000);
      return () => clearInterval(t);
    }
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: 15,
      ease: "linear",
      onComplete: () => {
        setDirection(1);
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      },
    });
    if (hoveredRef.current) controls.pause();
    advanceRef.current = controls;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTestimonial, reduce]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  const goToTestimonial = (index: number) => {
    setDirection(index >= currentTestimonial ? 1 : -1);
    setCurrentTestimonial(index);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-20 bg-muted/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-left lg:text-center mb-8 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">What Our <span className="text-primary">Clients Say</span></h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto ps-0 lg:px-4">Our clients trust Saburi Ply for unmatched quality, timely delivery, and enduring performance.</p>
        </div>

        {/* Metrics strip — uniform row of three tiles */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-10">
          <div onPointerMove={handleSpotlight} className="spotlight-card bg-white rounded-lg px-3 py-4 lg:px-6 lg:py-5 shadow-sm flex flex-col items-center text-center">
            <Building className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-1 lg:mb-2" />
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">1 Lakh+</div>
            <div className="text-[11px] leading-tight sm:text-sm text-muted-foreground">Satisfied Customers</div>
          </div>
          <div onPointerMove={handleSpotlight} className="spotlight-card bg-white rounded-lg px-3 py-4 lg:px-6 lg:py-5 shadow-sm flex flex-col items-center text-center">
            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-1 lg:mb-2" />
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">500+</div>
            <div className="text-[11px] leading-tight sm:text-sm text-muted-foreground">Business Partners</div>
          </div>
          <div onPointerMove={handleSpotlight} className="spotlight-card bg-white rounded-lg px-3 py-4 lg:px-6 lg:py-5 shadow-sm flex flex-col items-center text-center">
            <Star className="h-6 w-6 lg:h-8 lg:w-8 text-primary mb-1 lg:mb-2" />
            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">4.7/5</div>
            <div className="text-[11px] leading-tight sm:text-sm text-muted-foreground">Google Rating</div>
          </div>
        </div>

        {/* Featured hero quote + height-matched list, bottom-aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <motion.div
            className="spotlight-card bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 relative flex h-full flex-col lg:min-h-[360px]"
            style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
            onPointerMove={reduce ? undefined : handleCardPointer}
            onPointerEnter={pauseAdvance}
            onPointerLeave={() => {
              resetTilt();
              resumeAdvance();
            }}
          >
            <Quote className="h-8 w-8 lg:h-12 lg:w-12 text-primary/20 absolute top-3 right-3 lg:top-4 lg:right-4 z-10" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTestimonial}
                className="flex flex-1 flex-col"
                initial={reduce ? false : { opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(current.rating)].map((_, index) => (
                      <Star key={index} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl text-foreground/80 leading-relaxed">"{current.content}"</p>
                </div>
                <div className="border-t pt-3 lg:pt-4 mt-4 lg:mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm lg:text-base font-semibold text-foreground">{current.name}</h4>
                      <p className="text-xs text-muted-foreground">{current.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Height-matched list — three equal cards spanning the featured card's height */}
          <div className="hidden lg:grid grid-rows-3 gap-4 h-full">
            {testimonials.filter((_, index) => index !== currentTestimonial).slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} onClick={() => goToTestimonial(testimonials.findIndex((t) => t.id === testimonial.id))} className="bg-white rounded-lg p-4 lg:p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-center">
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">"{testimonial.content.substring(0, 120)}..."</p>
                <div className="text-xs"><span className="font-medium text-foreground">{testimonial.name}</span><span className="text-muted-foreground"> - {testimonial.company}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel controls — centered under the block, drives the featured quote */}
        <div className="flex items-center justify-center space-x-3 lg:space-x-4 mt-6 lg:mt-8">
          <button onClick={prevTestimonial} aria-label="Previous testimonial" className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-center space-x-2">
            {testimonials.map((_, index) => {
              const isActive = index === currentTestimonial;
              if (isActive && !reduce) {
                return (
                  <button key={index} onClick={() => goToTestimonial(index)} aria-label={`Go to testimonial ${index + 1}`} className="relative w-5 h-5 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <svg className="absolute inset-0 h-5 w-5 -rotate-90" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <motion.circle cx="10" cy="10" r="8" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: progress }} />
                    </svg>
                  </button>
                );
              }
              return (
                <button key={index} onClick={() => goToTestimonial(index)} aria-label={`Go to testimonial ${index + 1}`} className={`w-2.5 h-2.5 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"}`} />
              );
            })}
          </div>
          <button onClick={nextTestimonial} aria-label="Next testimonial" className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-8 lg:mt-16 text-center">
          <div className="bg-white rounded-lg p-6 lg:p-8 shadow-sm">
            <h6 className="text-xl lg:text-2xl font-bold text-foreground mb-3 lg:mb-4">Join Our Satisfied Customers</h6>
            <p className="text-sm lg:text-base text-muted-foreground mb-4 lg:mb-6 max-w-2xl mx-auto px-4">Experience the same quality and service that our customers rave about. Get your personalized quote today and see the difference.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="bg-primary hover:bg-primary/90 text-white px-6 lg:px-8 py-3 rounded-lg font-medium transition-colors touch-manipulation w-full sm:w-auto" onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>Get Your Quote Now</button>
              <RateOnGoogle variant="button" placement="testimonials" className="w-full sm:w-auto h-auto px-6 lg:px-8 py-3" />
            </div>

            {/* Video Testimonials Slider */}
            <div className="mt-6 lg:mt-10">
              <div className="relative">
                {/* Video Carousel - All Screen Sizes */}
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-4 md:gap-6">
                    {videoTestimonials.map((video, index) => (
                      <div key={video.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)] min-w-0">
                        <div className="group relative h-full bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                          {/* Elegant gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

                          {/* Saburi Logo Badge - Smaller */}
                          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 shadow-md group-hover:shadow-lg transition-all duration-300">
                            <div className="w-4 h-4 bg-gradient-to-br from-primary to-primary/80 rounded-sm flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">S</span>
                            </div>
                            <span className="text-primary text-xs font-bold tracking-tight">SABURI</span>
                          </div>

                          {/* Video Container with Lite Embed approach */}
                          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden group/video cursor-pointer"
                            onClick={(e) => {
                              const container = e.currentTarget;
                              const iframe = document.createElement('iframe');
                              iframe.setAttribute('class', 'w-full h-full absolute inset-0');
                              iframe.setAttribute('src', `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`);
                              iframe.setAttribute('title', video.title);
                              iframe.setAttribute('frameborder', '0');
                              iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                              iframe.setAttribute('allowfullscreen', 'true');

                              container.innerHTML = '';
                              container.appendChild(iframe);
                            }}
                          >
                            {/* Static Thumbnail with Play Button Overlay */}
                            <img
                              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover opacity-60 group-hover/video:opacity-80 transition-opacity duration-300"
                              loading="lazy"
                            />

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-2xl group-hover/video:scale-110 group-hover/video:bg-primary transition-all duration-300">
                                <Play className="h-8 w-8 text-white fill-current ml-1" />
                              </div>
                            </div>

                            {/* Subtle border on video */}
                            <div className="absolute inset-0 border-b-2 border-primary/10 pointer-events-none" />
                          </div>

                          {/* Content Section - Refined Design */}
                          <div className="relative bg-white p-5">
                            {/* Decorative element */}
                            <div className="absolute top-0 left-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-10 -translate-y-10" />
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-12 translate-y-12" />

                            <div className="relative flex items-start gap-3">
                              {/* Play Icon - Smaller */}
                              <div className="flex-shrink-0 w-10 h-10 bg-primary/15 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <Play className="h-5 w-5 text-primary drop-shadow-md" />
                              </div>

                              {/* Text Content - Left Aligned */}
                              <div className="flex-1 min-w-0 text-left">
                                <h4 className="text-base lg:text-lg font-bold text-foreground mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors text-left">
                                  {video.title}
                                </h4>
                                <div className="space-y-1 text-left">
                                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-primary/70 rounded-full" />
                                    {video.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground pl-3">{video.location}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom accent line */}
                          <div className="h-1 bg-gradient-to-r from-primary/50 via-white/20 to-primary/50 group-hover:from-white/30 group-hover:via-white/40 group-hover:to-white/30 transition-all duration-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center space-x-4 mt-6 lg:mt-8">
                  <button
                    onClick={scrollPrevVideo}
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />
                  </button>
                  <div className="flex space-x-2">
                    {videoTestimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToVideo(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === selectedVideoIndex ? "bg-primary w-6" : "bg-gray-300"
                          }`}
                        aria-label={`Go to video ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={scrollNextVideo}
                    className="w-10 h-10 lg:w-12 lg:h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
