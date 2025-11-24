import { motion } from "framer-motion";
import { Hero } from "../../components/Hero/Hero.component";

export const Home = () => {
  return (
    <div>
      <section className="w-full min-h-screen bg-linear-to-b from-primary to-secondary
       text-secoundary flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Advocacia Trabalhista</h1>

          <p className="text-lg md:text-xl leading-relaxed text-gray-300">
            Escritório especializado em Direito do Trabalho, com atuação preventiva e contenciosa para empregados
            e empregadores. Oferecemos consultoria, negociações extrajudiciais, acompanhamento de processos e
            elaboração de contratos trabalhistas com foco em proteção dos direitos e conformidade legal.
          </p>

          <ul className="mt-8 text-left text-gray-300 max-w-xl mx-auto space-y-3">
            <li className="flex gap-3">
              <strong className="w-36">Atuação:</strong>
              <span>Reclamações trabalhistas, acordos, rescisões, FGTS, horas extras e compliance trabalhista</span>
            </li>
            <li className="flex gap-3">
              <strong className="w-36">Abordagem:</strong>
              <span>Estratégica, ética e orientada para soluções rápidas e eficazes</span>
            </li>
            <li className="flex gap-3">
              <strong className="w-36">Atendimento:</strong>
              <span>Campinas, Guaxupé  e Poços de Caldas</span>
            </li>
          </ul>

          <p className="mt-8 text-dark">Agende uma consulta inicial para avaliação do seu caso.</p>
        </motion.div>
      </section>
      <Hero />
    </div>
  )
}
