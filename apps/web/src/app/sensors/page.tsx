import type { Metadata } from 'next'
import './sensors.css'
import SensorsNavbar from '@/components/sensors/Navbar'
import HeroSection from '@/components/sensors/HeroSection'
import SpecTicker from '@/components/sensors/SpecTicker'
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
      {/* Body sections (Features, ProductShowcase, Tech, Specs, System, DeploymentMap, Stats, CTA) ported next. */}
      <SensorsFooter />
    </div>
  )
}
