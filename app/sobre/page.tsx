import { MapPin, Users, Droplets, Calendar } from "lucide-react"

export default function SobrePage() {
  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sobre a Chácara Carnaubanos</h1>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Descrição Principal */}
        <div className="mb-8">
          <p className="text-foreground leading-relaxed text-center mb-6">
            A Chácara Carnaubanos é o lugar perfeito para realizar seus eventos em um ambiente familiar e acolhedor.
            Oferecemos uma estrutura completa para tornar seu momento especial inesquecível.
          </p>
        </div>

        {/* Cards de Destaque */}
        <div className="space-y-4 mb-8">
          <div className="bg-card border-2 border-primary rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary rounded-full p-3 flex-shrink-0">
                <Calendar className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Espaço para Eventos</h3>
                <p className="text-foreground leading-relaxed">
                  Área ampla e versátil para festas de aniversário, confraternizações, churrascos e celebrações de todos
                  os tipos. Ambiente preparado para receber sua família e amigos com conforto e segurança.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-primary rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary rounded-full p-3 flex-shrink-0">
                <Droplets className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Área de Banho</h3>
                <p className="text-foreground leading-relaxed">
                  Área de lazer aquática completa para você e sua família aproveitarem momentos de diversão e
                  relaxamento. Perfeita para dias quentes e momentos de descontração.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-primary rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary rounded-full p-3 flex-shrink-0">
                <Users className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Ambiente Familiar</h3>
                <p className="text-foreground leading-relaxed">
                  Espaço acolhedor e seguro, ideal para reunir a família. Nossa chácara proporciona privacidade e
                  tranquilidade para você aproveitar momentos especiais com quem mais importa.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-primary rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary rounded-full p-3 flex-shrink-0">
                <MapPin className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Estrutura Completa</h3>
                <ul className="text-foreground leading-relaxed space-y-1 list-disc list-inside">
                  <li>Área coberta para eventos</li>
                  <li>Churrasqueira</li>
                  <li>Banheiros</li>
                  <li>Estacionamento</li>
                  <li>Área verde ampla</li>
                  <li>Iluminação ambiente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-primary mb-2">Pronto para Agendar?</h3>
          <p className="text-foreground mb-4">Reserve agora mesmo a Chácara Carnaubanos para seu próximo evento!</p>
          <a
            href="/agendamento"
            className="inline-block bg-primary text-black font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Fazer Agendamento
          </a>
        </div>
      </div>
    </div>
  )
}
