import React from "react";
import { motion } from "framer-motion";

/**
 * PageLoader Component
 * 
 * A minimal, non-intrusive top-loading progress bar and a subtle spinner.
 * It DOES NOT include a full-screen overlay, allowing the current page to
 * remain visible during route transitions.
 */
const PageLoader = () => {
    return (
        <>
            {/* Top Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-[10000] h-1 bg-transparent overflow-hidden">
                <motion.div
                    className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    initial={{ width: "0%", x: "-100%" }}
                    animate={{
                        x: ["-100%", "-40%", "-10%", "0%"],
                        width: ["100%", "100%", "100%", "100%"]
                    }}
                    transition={{
                        duration: 8,
                        ease: "easeOut",
                        times: [0, 0.2, 0.6, 1]
                    }}
                />
            </div>

            {/* Subtle, non-intrusive spinner in the corner if preferred, or just the bar */}
            {/* For now, we'll stick to just the high-quality bar as per user preference for "YouTube/GitHub style" */}
        </>
    );
};

export default PageLoader;
