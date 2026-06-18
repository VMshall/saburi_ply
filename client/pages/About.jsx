import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "../components/Footer";
import { PlywoodGallery } from "../components/PlywoodGallery";
import { AboutUs } from "../components/AboutUs";
import { ProcessQuality } from "../components/ProcessQuality";
import { GoGreen } from "../components/GoGreen";
import { Mission } from "../components/MissionVision";
import { Vision } from "../components/MissionVision";
// import { OurTeam } from "../components/OurTeam";
import { BecomeOurPartner } from "../components/BecomeOurPartner";
import { NewAboutUs } from "../components/NewAboutUs";
// import {HowItWorks} from "../components/HowItWorks";

export default function About() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHeader title="About Us" />

      <NewAboutUs />
      {/* <HowItWorks/> */}
      <ProcessQuality />
      <PlywoodGallery />
      <GoGreen />
      <Mission />
      <Vision />
      {/* <OurTeam /> */}
      <BecomeOurPartner />
      <Footer />
    </div>
  );
}
