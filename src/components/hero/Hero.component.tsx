import { motion } from "framer-motion";
import { CircleFadingPlus, Phone, Mail, MapPin, Scale } from "lucide-react";
import heroImage from "@/assets/hero-law.jpg";
// import officeImage from "@/assets/office-interior.jpg";
import officeImage from "@/assets/mf_office1.png";
interface HeroProps {
  whatsappNumber?: string;
  email?: string;
}

export const Hero: React.FC<HeroProps> = ({
  whatsappNumber = "553537214321",
  email = "contato@escritorio.com.br"
}) => {
  const sanitizedPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${sanitizedPhone}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Asymmetric Grid */}
      <section className="min-h-screen relative grid lg:grid-cols-12 overflow-hidden">
        {/* Left Content - Takes 7 columns */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 lg:px-20 lg:py-3 bg-gradient-primary relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <Scale className="w-6 h-6 text-accent" />
              <span className="text-2xl font-medium text-secondary">Marcell Ferreira</span>
            </div> */}


            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Excelência no <span className="block text-accent">Direito</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl m-18 leading-relaxed">
              Escritório de advocacia com atuação preventiva e contenciosa para empregados e empregadores,
              especializado em <span className="font-bold text-accent underline">Direito Trabalhista</span> e <span className="font-bold text-accent underline"> Direito Previdenciário</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col mb-12 sm:flex-row gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-primary-foreground 
                font-semibold hover:bg-accent transition-colors duration-300"

              >
                <Phone className="w-5 h-5" />
                Agendar Consulta
              </a>

              <a
                href={`https://www.instagram.com/direct/t/17842144379351235/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-primary-foreground 
                font-semibold hover:bg-accent transition-colors duration-300"
              >
                <CircleFadingPlus />
                Instagram
              </a>

              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-primary-foreground 
                font-semibold hover:bg-accent transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                E-mail
              </a>
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

      <section className="py-24 px-6 md:px-12 lg:px-20">
        {/* Localização Grid */}
        <div className="grid md:grid-cols-3 xl:grid-cols-3 gap-9 text-foreground">
          {locals.map((lc, index) => (
            <motion.div
              key={lc.address}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-card hover:border-secondary hover:text-background hover:shadow-elegant transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/75 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                <lc.icon className="w-6 h-6" />
              </div>
              <p className="text-accent font-bold mb-3">{lc.city}</p>
              <p className="text-foreground text-sm mb-2 leading-relaxed">{lc.address}</p>
              <p className="text-foreground text-sm mb-2 leading-relaxed">{lc.district}</p>
              <p className="text-foreground text-sm mb-2 leading-relaxed">{lc.ref}</p>
            </motion.div>
          ))}
        </div>
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
                Nossa <span className="text-gradient-gold">Atuação</span>
              </h2>
              <p className="text-lg leading-relaxed">
                Oferecemos consultoria, negociações extra judiciais, acompanhamento de processos e
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
                className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary hover:text-background hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/75 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-accent mb-3">{service.title}</h3>
                <p className="text-foreground leading-relaxed">{service.description}</p>
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
                className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary hover:text-background hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/75 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-accent text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-foreground leading-relaxed">{item.description}</p>
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
            Pronto para Proteger Seus <span className="text-accent">Direitos?</span>
          </h2>
          <p className="text-xl mb-10">
            Agende uma consulta inicial para avaliação do seu caso.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-primary-foreground 
                font-semibold hover:bg-accent transition-colors duration-300"
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
    title: "Eficiência",
    description: "Foco em soluções rápidas e eficazes, sempre priorizando os interesses dos clientes."
  }
];

const locals = [
  {
    icon: MapPin,
    city: "Campinas SP",
    address: "R. Major Solon, 290",
    district: "Cambuí",
    ref: ""
  },
  {
    icon: MapPin,
    city: "Guaxupé MG",
    address: "R. Pereira do Nascimento, 180",
    district: "Centro",
    ref: "Sala 06"
  },
  {
    icon: MapPin,
    city: "Poços de Caldas MG",
    address: "R. Prefeito Chagas, 305",
    district: "Centro",
    ref: "Ed Manhattan - Sala 502"
  },
];
