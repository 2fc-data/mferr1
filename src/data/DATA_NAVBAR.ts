// Definir a interface para os itens da navbar
export interface NavbarItem {
  name: string;
  path: string;
}

// Dados dos itens de navegação
export const NAVBARITEMS: NavbarItem[] = [
  { name: "Início", path: "/"},
  { name: "Dashboard", path: "/dashboard"},
];
