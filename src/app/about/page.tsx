"use client";

import Image from "next/image";
import Header from "../Header";
import Footer from "../Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-96 bg-black text-white overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1600"
            alt="Skateboarding"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">ABOUT US</h1>
            <p className="text-xl max-w-2xl text-gray-200">
              Fueling the skate scene since day one
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">OUR STORY</h2>
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
              <p>
                Founded by skaters, for skaters, Ollie North Skateshop started as a
                small garage operation in Venice Beach. What began as a passion
                project to provide quality gear to the local skate community has
                grown into a trusted destination for riders across the country.
              </p>
              <p>
                We believe skateboarding is more than just a sport&mdash;it&rsquo;s a
                lifestyle, a form of self-expression, and a community that welcomes
                everyone. Whether you&rsquo;re landing your first ollie or sending it down
                a 12-stair, we&rsquo;re here to support your journey with the best gear
                and expertise.
              </p>
              <p>
                Every product we stock is tested by our team of riders. We don&rsquo;t
                just sell skateboards; we ride them, break them in, and push them to
                their limits. That&rsquo;s how we know what works and what doesn&rsquo;t.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              WHAT WE STAND FOR
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-4xl">🛹</div>
                </div>
                <h3 className="text-xl font-bold mb-3">QUALITY GEAR</h3>
                <p className="text-gray-600">
                  Only the best brands and products that we trust and ride ourselves
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-4xl">🤝</div>
                </div>
                <h3 className="text-xl font-bold mb-3">COMMUNITY</h3>
                <p className="text-gray-600">
                  Supporting local skaters and giving back to the scene that raised us
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-4xl">💯</div>
                </div>
                <h3 className="text-xl font-bold mb-3">AUTHENTICITY</h3>
                <p className="text-gray-600">
                  Real riders, real advice, real skate culture—no posers allowed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visit Us */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">VISIT OUR SHOP</h2>
            <p className="text-gray-700 mb-8 text-lg">
              Come hang out at our Venice Beach location. We&rsquo;ve got a mini ramp out
              back, a chill vibe inside, and a crew that actually knows what
              they&rsquo;re talking about.
            </p>
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 text-left">
              <h3 className="font-bold text-xl mb-4 text-cyan-600">LOCATION</h3>
              <p className="mb-2">123 Skate Street</p>
              <p className="mb-2">Venice Beach, CA 90291</p>
              <p className="mb-4">Phone: (555) 123-4567</p>

              <h3 className="font-bold text-xl mb-4 mt-6 text-cyan-600">HOURS</h3>
              <p className="mb-1">Monday - Friday: 10AM - 8PM</p>
              <p className="mb-1">Saturday: 9AM - 9PM</p>
              <p>Sunday: 10AM - 6PM</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}