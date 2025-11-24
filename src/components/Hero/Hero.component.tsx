import { motion } from "framer-motion";
import { Phone } from "lucide-react";

interface HeroProps {
  whatsappNumber?: string;
  buttonLabel?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  whatsappNumber = "5535999999999", 
  buttonLabel = "Conversar pelo WhatsApp" 
}) => {
  const sanitized = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${sanitized}`;

  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // Comportamento padrão: abrir link do WhatsApp em nova aba/janela.
    // Mantemos a tag <a> para suportar _blank, mas deixamos aqui handler caso queira
    // registrar analytics ou comportamentos adicionais no futuro.
    // Não impedimos a navegação.
  };

  return (
    <section className="w-full bg-gray-900 text-white py-24 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="max-w-2xl text-center"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-secondary mb-4">Protegendo seus direitos com excelência</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Entre em contato com nossa equipe e receba orientação jurídica especializada. Clique no botão para iniciar
          uma conversa segura pelo WhatsApp com nosso escritório.
        </p>

        {/* Link que abre o WhatsApp com o número do escritório. */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleContactClick}
          aria-label={`Abrir WhatsApp para número ${whatsappNumber}`}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-white font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: "#25D366" }}
        >
          <Phone size={20} aria-hidden="true" />
          <span>{buttonLabel}</span>
        </a>
      </motion.div>
    </section>
  );
};
