export const CHILEAN_REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes"
];

export const CHILEAN_CITIES: { [key: string]: string[] } = {
  "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal", "Sierra Gorda"],
  "Atacama": ["Copiapó", "Caldera", "Chañaral", "Diego de Almagro", "El Salvador", "Huasco", "Tierra Amarilla", "Vallenar"],
  "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "San Felipe", "Los Andes", "Limache", "Olmué", "Llaillay", "Putaendo", "Santa María", "Cabildo", "Catemu", "Panquehue", "Petorca", "La Ligua", "Zapallar", "Papudo", "Calera", "Hijuelas", "Nogales", "La Cruz"],
  "Metropolitana": ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Macul", "Peñalolén", "La Florida", "Puente Alto", "Maipú", "La Cisterna", "La Granja", "San Miguel", "Independencia", "Recoleta", "Huechuraba", "Quilicura", "Conchalí", "Renca", "Vitacura", "Lo Barnechea", "Colina", "Lampa", "Tiltil", "Pirque", "San José de Maipo", "Buin", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "O'Higgins": ["Rancagua", "Machalí", "Graneros", "San Francisco de Mostazal", "Codegua", "Olivar", "Requínoa", "Rengo", "Malloa", "Coinco", "Coltauco", "Doñihue", "Las Cabras", "Peumo", "Pichidegua", "Quinta de Tilcoco", "San Vicente", "Pichilemu", "Navidad", "Litueche", "La Estrella", "Marchihue", "Paredones"],
  "Maule": ["Talca", "Curicó", "Linares", "Constitución", "Parral", "San Clemente", "Empedrado", "Maule", "Pelarco", "Pencahue", "Chanco", "Cauquenes", "Longaví", "Retiro", "Villa Alegre", "Colbún", "Yerbas Buenas", "Teno", "Romeral", "Rauco", "Licantén", "Vichuquén", "Molina", "Sagrada Familia", "Hualañé", "Curepto", "Río Claro"],
  "Ñuble": ["Chillán", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
  "Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Coronel", "Hualpén", "Chiguayante", "Tomé", "Penco", "Lota", "Arauco", "Curanilahue", "Lebu", "Los Álamos", "Cañete", "Contulmo", "Tirúa", "Los Ángeles", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío", "Antuco", "Cabrero", "Laja"],
  "Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Valdivia", "La Unión", "Río Bueno", "Lago Ranco", "Panguipulli", "Futrono", "Mariquina", "Lanco", "Máfil", "Corral", "Paillaco", "Los Lagos", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria", "Carahue", "Cholchol", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica"],
  "Los Ríos": ["Valdivia", "La Unión", "Río Bueno", "Lago Ranco", "Panguipulli", "Futrono", "Mariquina", "Lanco", "Máfil", "Corral", "Paillaco", "Los Lagos"],
  "Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón", "Calbuco", "Fresia", "Frutillar", "Llanquihue", "Los Muermos", "Maullín", "Puerto Octay", "Puerto Varas", "Purranque", "Puyehue", "Queilén", "Quellón", "Quemchi", "Quinchao", "Río Negro", "San Juan de la Costa", "San Pablo"],
  "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane", "Guaitecas", "Río Ibáñez", "Tortel"],
  "Magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir", "Cerro Sombrero", "Primavera", "Timaukel", "Torres del Paine"]
};

export const getCitiesForRegion = (region: string): string[] => {
  return CHILEAN_CITIES[region] || [];
};
