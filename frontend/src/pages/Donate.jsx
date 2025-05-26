import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationForm from "../components/DonationForm";
import { useRef, useState } from "react";
import illustrate from "@/assets/illustrate.jpeg"; // place your SVG in /assets/
import illustrate2 from "@/assets/illustrate2.jpeg";
import illustrate3 from "@/assets/illustrate3.jpeg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Donate() {
  const formRef = useRef(null);
  const adminRef = useRef(null);
  const [activeTab, setActiveTab] = useState("onetime");

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToAdmin = () => {
    adminRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,_#e0f2fe,_#bfdbfe,_#c7d2fe)] bg-[length:400%_400%] animate-[gradientShift_15s_ease_infinite]" />

      {/* Decorative SVG illustration (bottom-right) */}
      <img
        src={illustrate}
        alt="Children Illustration"
        className="absolute top-1 right-0 h-255 w-full md:w-1/3 rounded-lg shadow-xl opacity-50 z-0 object-cover
        transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105"
        loading="lazy"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-50 px-3 py-60 max-w-7xl mx-auto">
        {/* Hero section */}
        <section className="max-w-xl space-y-6 space-x-3">
          <h1 className="text-6xl sm:text-7xl font-bold text-blue-900 leading-tight drop-shadow">
            Support UNICEF’s Mission: Caring for Every Child
          </h1>
          <p className="text-lg text-black leading-relaxed">
            Your donation provides essentials like food, education, and shelter to vulnerable children worldwide.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Donate Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Donation Portal</DialogTitle>
                <DialogDescription>
                  {activeTab === 'monthly'
                    ? "Set up recurring monthly donations"
                    : "Make a one-time donation"}
                </DialogDescription>
              </DialogHeader>
              <div
                ref={formRef}
                className="w-full max-w-md bg-blue-50 p-6 rounded-2xl shadow-xl backdrop-blur-sm"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-blue-100">
                    <TabsTrigger value="onetime">One Time</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="onetime">
                    <DonationForm mode="onetime" />
                  </TabsContent>
                  <TabsContent value="monthly">
                    <DonationForm mode="monthly" />
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={scrollToAdmin} variant="ghost" className="mt-4 bg-blue-100 text-gray-800 hover:bg-blue-900 hover:text-white">
            Admin Portal
          </Button>
        </section>
        
        {/* Donation form */}
        <div
          ref={formRef}
          className="w-full max-w-md bg-blue-50 p-6 rounded-2xl shadow-xl backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-500">
            Make a Donation
          </h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-100">
              <TabsTrigger value="onetime">One Time</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="onetime">
              <DonationForm mode="onetime" description="Make a single donation to support our cause" />
            </TabsContent>
            <TabsContent value="monthly">
              <DonationForm
                mode="monthly"
                description="Set up recurring monthly donations"
                subscriptionTerms={
                  <p className="text-sm text-muted-foreground mt-2">
                    By choosing monthly, you agree to recurring payments until canceled
                  </p>
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div
        ref={adminRef}
        className="relative z-10 flex justify-center py-60 space-y-10 w-full items-center flex-col bg-gradient-to-b from-[#adcfff] via-[#0b1e51cc] to-[#0b1e51]"
      >
        <h1 className="text-7xl font-bold mb-9 text-center text-blue-200">
          Admin Portal
        </h1>
        <p className="text-center text-blue-100 text-lg mb-9 max-w-xl">Admins can sign in to access<br /> the backend portal below</p>
        <Button className="text-gray-900 text-3xl py-4 px-8 bg-blue-300 hover:bg-blue-900 hover:text-gray-200 transition-colors w-95 h-18 duration-300">
          <a href="/admin/login">Sign In</a>
        </Button>
      </div>
    </main>
  );
}

