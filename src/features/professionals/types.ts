/** Tipos de la vidriera pública de profesionales. */

export type PublicProfessional = {
  id: string;
  nombre: string;
  oficio: string;
  rating: number;
  resenas_count: number;
  avatar: string | null;
  zona: string | null;
  all_trades?: string[];
};

export type PublicSkill = {
  nombre: string;
  descripcion: string;
  anos_experiencia: number | null;
  es_principal: boolean;
};

export type PublicReview = {
  id: string;
  rating: number;
  comentario: string;
  fecha: string;
  cliente: string;
};

export type PublicProfessionalDetail = {
  profile: PublicProfessional & { descripcion: string };
  habilidades: PublicSkill[];
  resenas: PublicReview[];
};
