import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Scale } from "lucide-react";
import heroImage from "@/assets/hero-law.jpg";
// import officeImage from "@/assets/office-interior.jpg";
import officeImage from "@/assets/mf_office1.png";
interface HeroProps {
  whatsappNumber?: string;
  email?: string;
}

export const Hero: React.FC<HeroProps> = ({
  whatsappNumber = "5535999999999",
  email = "contato@escritorio.com.br"
}) => {
  const sanitizedPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${sanitizedPhone}`;

  return (
    <main className="mt-[-110px] bg-transparent min-h-screen">
      {/* Hero Section with Asymmetric Grid */}
      <section className="relative grid lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Content - Takes 7 columns */}
        <div className="bg-primary lg:col-span-7 flex flex-col px-6 md:px-12 lg:px-20 py-14 lg:py-21 bg-gradient-primary relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <Scale className="w-6 h-6 text-accent" />
              <span className="text-2xl font-medium text-secondary">Marcell Ferreira</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent mb-6 leading-tight">
              Excelência no <span className="block text-secondary mt-2">Direito</span>
            </h1>

            <p className="text-lg md:text-xl text-accent max-w-2xl mb-12 leading-relaxed">
              Escritório especializado em Direito do Trabalho, com atuação preventiva e contenciosa para empregados
              e empregadores.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-accent-foreground font-semibold shadow-glow hover:scale-105 transition-transform duration-300"
              >
                <Phone className="w-5 h-5" />
                Agendar Consulta
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent/10 text-accent font-semibold border border-accent/90 hover:bg-accent/20 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                E-mail
              </a>
            </div>

            {/* Location Tags */}
            <div className="grid grid-cols-3 gap-3 mt-12">
              <div className="grid grid-rows-3 items-center gap-2 px-4 py-2 rounded-lg bg-accent/5 border border-accent/10">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-md text-accent">Campinas - SP</span>
                <span className="text-sm text-accent">Rua Major Solon, 290</span>
                <span className="text-sm text-accent">Cambuí</span>
              </div>
              <div className="grid grid-rows-3 items-center gap-2 px-4 py-2 rounded-lg bg-accent/5 border border-accent/10">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-md text-accent">Guaxupé - MG</span>
                <span className="text-sm text-accent">Rua Pereira do Nascimento, 180</span>
                <span className="text-sm text-accent">Sala 06 - Centro</span>
              </div>
              <div className="grid grid-rows-3 items-center gap-2 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-md text-accent">Poços de Caldas - MG</span>
                <span className="text-sm text-accent">Rua Prefeito Chagas, 305</span>
                <span className="text-sm text-accent">Sala 502 - Ed Manhattan</span>
              </div>
            </div>
          </motion.div>

          {/* Decorative Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Right Image - Takes 5 columns */}
        <motion.div
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-linear-to-l from-primary/20 to-transparent z-10" />
          <img
            src={heroImage}
            alt="Marcell Ferreia - Advogados"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Nossa <span className="text-secondary">Atuação</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Oferecemos consultoria, negociações extrajudiciais, acompanhamento de processos e
                elaboração de contratos trabalhistas com foco em proteção dos direitos e conformidade legal.
              </p>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={officeImage}
                alt="Interior do Escritório"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Approach Section */}
      <section className="bg-primary py-24 px-6 md:px-12 lg:px-20 bg-gradient-primary">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-3 gap-12">
            {approach.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-accent leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Pronto para Proteger Seus <span className="text-secondary">Direitos?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Agende uma consulta inicial para avaliação do seu caso.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-accent text-accent-foreground font-bold text-lg shadow-glow hover:scale-105 transition-transform duration-300"
          >
            <Phone className="w-6 h-6" />
            Falar com Especialista
          </a>
        </motion.div>
      </section>
    </main>
  );
};

// Data
const services = [
  {
    icon: Scale,
    title: "Reclamações Trabalhistas",
    description: "Representação completa em processos trabalhistas, defendendo seus direitos com expertise e dedicação."
  },
  {
    icon: Phone,
    title: "Acordos e Negociações",
    description: "Mediação e negociação de acordos extrajudiciais para resolução rápida e eficaz de conflitos."
  },
  {
    icon: Mail,
    title: "Rescisões Contratuais",
    description: "Assessoria completa em rescisões contratuais, garantindo cumprimento de todos os direitos."
  },
  {
    icon: MapPin,
    title: "FGTS e Benefícios",
    description: "Consultoria especializada em FGTS, benefícios trabalhistas e direitos previdenciários."
  },
  {
    icon: Scale,
    title: "Horas Extras",
    description: "Análise e cobrança de horas extras, adicional noturno e demais verbas trabalhistas."
  },
  {
    icon: Phone,
    title: "Compliance Trabalhista",
    description: "Assessoria preventiva para empresas, garantindo conformidade com legislação trabalhista."
  }
];

const approach = [
  {
    icon: Scale,
    title: "Estratégica",
    description: "Análise detalhada de cada caso para desenvolver a melhor estratégia jurídica possível."
  },
  {
    icon: Phone,
    title: "Ética",
    description: "Atuação pautada nos mais altos padrões éticos e de transparência profissional."
  },
  {
    icon: Mail,
    title: "Eficaz",
    description: "Foco em soluções rápidas e eficazes, sempre priorizando os interesses dos clientes."
  }
];
