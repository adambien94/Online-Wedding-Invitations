import Head from "next/head";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Steps from "@/components/Steps";
import TemplatesPreview from "@/components/TemplatesPreview";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nasz Dzień — Strona główna</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          <Hero />
          <Features />
          <Steps />
          <TemplatesPreview />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
