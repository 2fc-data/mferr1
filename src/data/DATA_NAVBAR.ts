import { FaHome, FaTachometerAlt } from "react-icons/fa";
import type { ElementType } from "react";

// Definir a interface para os itens da navbar
export interface NavbarItem {
  name: string;
  path: string;
  icon: ElementType;
}

// Dados dos itens de navegação
export const NAVBARITEMS: NavbarItem[] = [
  { name: "Início", path: "/", icon: FaHome },
  { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
];