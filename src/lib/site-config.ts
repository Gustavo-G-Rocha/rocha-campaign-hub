export const siteConfig = {
  candidato: "Willian Rocha",
  cargo: "Deputado Estadual",
  slogan: "Transformando nosso Estado com você",
  whatsapp: "5541999999999", // atualize com o número real (só dígitos, com DDI)
  whatsappLabel: "Falar no WhatsApp",
  email: "contato@willianrocha.com.br",
  cidade: "Paraná",
  doarUrl: "https://queroapoiar.com.br/willianrocha",
  // Se o Quero Apoiar fornecer um link de embed/widget do contador (painel > Divulgar > Incorporar),
  // cole a URL aqui para exibir o contador ao vivo na página /doar. Deixe null para não exibir.
  doarEmbedUrl: null as string | null,
};

export const whatsappHref = `https://wa.me/${siteConfig.whatsapp}`;
