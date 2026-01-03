"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

const galleryImages = [
  {
    id: 1,
    src: "/chacara-area-de-eventos-externa-com-churrasqueira.jpg",
    alt: "Área de eventos",
  },
  {
    id: 2,
    src: "/piscina-em-chacara-ambiente-familiar.jpg",
    alt: "Área de banho",
  },
  {
    id: 3,
    src: "/area-verde-ampla-em-chacara.jpg",
    alt: "Área verde",
  },
  {
    id: 4,
    src: "/churrasqueira-completa-em-chacara.jpg",
    alt: "Churrasqueira",
  },
  {
    id: 5,
    src: "/area-coberta-para-festas-em-chacara.jpg",
    alt: "Área coberta",
  },
  {
    id: 6,
    src: "/espaco-de-lazer-familiar-em-chacara.jpg",
    alt: "Espaço de lazer",
  },
  {
    id: 7,
    src: "/jardim-decorado-em-chacara-para-eventos.jpg",
    alt: "Jardim decorado",
  },
  {
    id: 8,
    src: "/vista-noturna-de-chacara-iluminada.jpg",
    alt: "Vista noturna",
  },
]

export default function GaleriaPage() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null)

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Galeria de Fotos</h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Conheça os espaços da Chácara Carnaubanos</p>
        </div>

        {/* Grid de Imagens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-primary/30 hover:border-primary transition-all hover:scale-105 focus:outline-none focus:border-primary"
            >
              <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Modal de Imagem Ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-primary text-black hover:bg-primary/90"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="relative max-w-4xl w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              fill
              className="object-contain rounded-lg"
            />
          </div>

          <p className="absolute bottom-8 text-primary text-lg font-semibold">{selectedImage.alt}</p>
        </div>
      )}
    </div>
  )
}
