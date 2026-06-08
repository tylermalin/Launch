import type { Metadata } from 'next'
import './sensors.css'
import SensorsNavbar from '@/components/sensors/Navbar'
import HeroSection from '@/components/sensors/HeroSection'
import SpecTicker from '@/components/sensors/SpecTicker'
import UseCasesSection from '@/components/sensors/UseCasesSection'
import FeaturesSection from '@/components/sensors/FeaturesSection'
import ProductShowcase from '@/components/sensors/ProductShowcase'
import TechSection from '@/components/sensors/TechSection'
import SpecsSection from '@/components/sensors/SpecsSection'
import SystemSection from '@/components/sensors/SystemSection'
import DeploymentMap from '@/components/sensors/DeploymentMap'
import StatsSection from '@/components/sensors/StatsSection'
import CTASection from '@/components/sensors/CTASection'
import SensorsFooter from '@/components/sensors/Footer'

export const metadata: Metadata = {
  title: 'Mālama Sensor Systems | Hardware-Signed Environmental Data',
  description:
    'Solar-powered environmental monitoring sensors with dual-radio (LoRa + NB-IoT) connectivity. Soil, atmosphere, and remote sensing — built for the harshest conditions.',
}

// "Obsidian Precision" sensor product landing — standalone dark experience.
// (Global Mālama nav/footer are hidden on /sensors; this page carries its own.)
export default function SensorsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f5f5' }}>
      <SensorsNavbar />
      <HeroSection />
      <SpecTicker />
      <UseCasesSection />
      <FeaturesSection />
      <ProductShowcase />
      <TechSection />
      <SpecsSection />
      <SystemSection />
      <DeploymentMap />
      <StatsSection />
      <CTASection />
      <SensorsFooter />
    </div>
  )
}
