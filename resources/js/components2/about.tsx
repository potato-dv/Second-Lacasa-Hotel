import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { RiHotelLine, RiUserStarLine, RiLayoutMasonryLine, RiShieldCheckLine } from "react-icons/ri"; 

/**
 * AnimatedFadeIn Component
 * Wraps children in a fade-in animation triggered when component comes into view
 */
const AnimatedFadeIn: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  fromDirection?: "left" | "right" | "bottom";
}> = ({ children, delay = 0, fromDirection = "bottom" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false,
    amount: 0.2
  });

  // Define animation variants to avoid TypeScript errors
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: fromDirection === "left" ? -40 : fromDirection === "right" ? 40 : 0,
      y: fromDirection === "bottom" ? 40 : 0
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        delay: delay
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Service item type definition with icon
 */
interface ServiceItem {
  title: string;
  desc: string;
  icon: React.ElementType;
}

/**
 * Stats item type definition
 */
interface StatItem {
  value: string;
  label: string;
  hasBorder?: boolean;
}

/**
 * About page component
 */
const About: React.FC = () => {
  // Service items data with specific icons
  const services: ServiceItem[] = [
    {
      title: "Online Booking System",
      desc: "Simplified hotel room reservations with real-time availability.",
      icon: RiHotelLine
    },
    {
      title: "Guest Management",
      desc: "Track guest information and history to enhance experiences.",
      icon: RiUserStarLine
    },
    {
      title: "Room Customization",
      desc: "Showcase your rooms with custom layouts and amenities.",
      icon: RiLayoutMasonryLine
    },
    {
      title: "Secure Payment Integration",
      desc: "Guests can make secure online payments through trusted gateways.",
      icon: RiShieldCheckLine
    },
  ];

  // Stats data
  const stats: StatItem[] = [
    {
      value: "2000+",
      label: "Bookings Completed",
      hasBorder: true
    },
    {
      value: "98%",
      label: "Happy Guests",
      hasBorder: true
    },
    {
      value: "90%",
      label: "Repeat Customers"
    }
  ];

  return (
    <section className="bg-white py-16 px-4 md:px-20 text-gray-800 cursor-default">
      <div className="max-w-7xl mx-auto">
        {/* Hotel label above the horizontal layout */}
        <AnimatedFadeIn delay={0.2} fromDirection="bottom">
          <p className="text-base font-serif italic text-[#8B6514] mb-4 text-left">LaCasa Hotel</p>
        </AnimatedFadeIn>

        {/* Title and description in a flex layout */}
        <div className="flex flex-col md:flex-row justify-between md:items-start md:space-x-8 mb-16">
          {/* Section title */}
          <div className="md:w-1/2">
            <AnimatedFadeIn delay={0.3} fromDirection="left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-left">
                <span className="text-gray-700">Where comfort meets convenience.</span>
              </h2>
            </AnimatedFadeIn>
          </div>

          {/* Section description - left aligned text but positioned on right side */}
          <div className="md:w-1/2 mt-5 md:mt-0">
            <AnimatedFadeIn delay={0.4} fromDirection="right">
              <p className="text-base md:text-lg text-gray-600 text-left">
                At <span className="font-semibold">LaCasa Hotel</span>, we offer a seamless digital booking experience by delivering high-quality web development services. 
                Our focus is on creating user-friendly platforms to streamline hotel reservations, manage guest experiences, and unlock growth opportunities through smart technology.
              </p>
            </AnimatedFadeIn>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {services.map((item, idx) => (
            <AnimatedFadeIn key={idx} delay={0.3 + (0.15 * idx)} fromDirection="bottom">
              <div className="flex items-start space-x-4 group">
                <div className="text-[#8B6514] transition-all duration-300 group-hover:text-[#6d4e10]">
                  {React.createElement(item.icon, { size: 28 })}
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-semibold">{item.title}</h4>
                  <p className="text-sm md:text-base text-gray-600">{item.desc}</p>
                </div>
              </div>
            </AnimatedFadeIn>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, idx) => (
            <AnimatedFadeIn key={idx} delay={0.4 + (0.15 * idx)} fromDirection="bottom">
              <div className={stat.hasBorder ? "border-r-2 border-gray-300 pr-8" : ""}>
                <h3 className="text-5xl font-bold text-[#8B6514]">{stat.value}</h3>
                <p className="text-gray-600 font-semibold mt-1 text-sm">{stat.label}</p>
              </div>
            </AnimatedFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;