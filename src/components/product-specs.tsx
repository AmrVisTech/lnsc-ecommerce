"use client"

import { motion } from "framer-motion"
import { Cpu, HardDrive, Monitor, Wifi, Ruler } from "lucide-react"

interface ProductSpecsProps {
  specs: {
    processor: {
      brand: string
      model: string
      cores: string
      baseSpeed: string
      maxSpeed: string
      cache: string
    }
    graphics: {
      gpu: string
      vram: string
      rayTracing: string
      dlss: string
    }
    memory: {
      ram: string
      maxRam: string
      slots: string
    }
    storage: {
      primary: string
      slots: string
      expandable: string
    }
    display: {
      size: string
      resolution: string
      refreshRate: string
      panel: string
      colorGamut: string
      brightness: string
    }
    connectivity: {
      wifi: string
      bluetooth: string
      ethernet: string
      usb: string
      hdmi: string
      audio: string
    }
    physical: {
      dimensions: string
      weight: string
      battery: string
      adapter: string
      keyboard: string
      trackpad: string
    }
  }
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const specSections = [
    {
      title: "Processor",
      icon: Cpu,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      items: [
        { label: "Brand", value: specs.processor.brand },
        { label: "Model", value: specs.processor.model },
        { label: "Cores", value: specs.processor.cores },
        { label: "Base Speed", value: specs.processor.baseSpeed },
        { label: "Max Speed", value: specs.processor.maxSpeed },
        { label: "Cache", value: specs.processor.cache },
      ],
    },
    {
      title: "Graphics",
      icon: Monitor,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      items: [
        { label: "GPU", value: specs.graphics.gpu },
        { label: "VRAM", value: specs.graphics.vram },
        { label: "Ray Tracing", value: specs.graphics.rayTracing },
        { label: "DLSS", value: specs.graphics.dlss },
      ],
    },
    {
      title: "Memory & Storage",
      icon: HardDrive,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      items: [
        { label: "RAM", value: specs.memory.ram },
        { label: "Max RAM", value: specs.memory.maxRam },
        { label: "RAM Slots", value: specs.memory.slots },
        { label: "Primary Storage", value: specs.storage.primary },
        { label: "Storage Slots", value: specs.storage.slots },
        { label: "Expandable", value: specs.storage.expandable },
      ],
    },
    {
      title: "Display",
      icon: Monitor,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
      items: [
        { label: "Size", value: specs.display.size },
        { label: "Resolution", value: specs.display.resolution },
        { label: "Refresh Rate", value: specs.display.refreshRate },
        { label: "Panel Type", value: specs.display.panel },
        { label: "Color Gamut", value: specs.display.colorGamut },
        { label: "Brightness", value: specs.display.brightness },
      ],
    },
    {
      title: "Connectivity",
      icon: Wifi,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900",
      items: [
        { label: "Wi-Fi", value: specs.connectivity.wifi },
        { label: "Bluetooth", value: specs.connectivity.bluetooth },
        { label: "Ethernet", value: specs.connectivity.ethernet },
        { label: "USB Ports", value: specs.connectivity.usb },
        { label: "HDMI", value: specs.connectivity.hdmi },
        { label: "Audio", value: specs.connectivity.audio },
      ],
    },
    {
      title: "Physical",
      icon: Ruler,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
      items: [
        { label: "Dimensions", value: specs.physical.dimensions },
        { label: "Weight", value: specs.physical.weight },
        { label: "Battery", value: specs.physical.battery },
        { label: "Power Adapter", value: specs.physical.adapter },
        { label: "Keyboard", value: specs.physical.keyboard },
        { label: "Trackpad", value: specs.physical.trackpad },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {specSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${section.bgColor}`}>
              <section.icon className={`w-5 h-5 ${section.color}`} />
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">{section.title}</h3>
          </div>

          <div className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                <span className="text-sm text-gray-900 dark:text-white font-semibold text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}