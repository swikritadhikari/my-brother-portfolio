import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoGrid from "@/components/VideoGrid";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <VideoGrid />
      <About />
      <Footer />
    </main>
  );
}
