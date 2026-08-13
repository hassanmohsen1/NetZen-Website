<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import HeroSection from '@/components/HeroSection.vue'
import TrustSection from '@/components/TrustSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import SolutionsSection from '@/components/SolutionsSection.vue'
import WhyNetzenSection from '@/components/WhyNetzenSection.vue'
import TechEcosystem from '@/components/TechEcosystem.vue'
import CtaBanner from '@/components/CtaBanner.vue'
import ContactSection from '@/components/ContactSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import AnimatedBackground from '@/components/AnimatedBackground.vue'
</script>

<template>
  <div class="bg-background text-on-surface min-h-screen overflow-x-hidden relative">
    <AnimatedBackground />
    <AppNavbar />
    <main>
      <HeroSection />
      <TrustSection />
      <ServicesSection />
      <SolutionsSection />
      <WhyNetzenSection />
      <TechEcosystem />
      <CtaBanner />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>
