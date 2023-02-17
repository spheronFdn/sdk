enum ProjectTypeEnum {
  STANDARD = "STANDARD",
  UPLOAD = "UPLOAD",
}

enum DeploymentEnvironmentStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PAYMENT_PENDING = "PAYMENT_PENDING",
}

enum ProjectStateEnum {
  MAINTAINED = "MAINTAINED",
  ARCHIVED = "ARCHIVED",
}

enum NodeVersionEnum {
  V_12 = "V_12",
  V_14 = "V_14",
  V_16 = "V_16",
}

enum FrameworkEnum {
  SIMPLE_JAVASCRIPT_APP = "static",
  VUE = "vue",
  REACT = "react",
  NEXT = "next",
  ANGULAR = "angular",
  PREACT = "preact",
  NUXT = "nuxt2",
  SVELTE = "svelte",
  GATSBY = "gatsby",
  ELEVENTY = "eleventy",
  DOCUSAURUS = "docusaurus",
  SANITY = "sanity",
  HUGO = "hugo",
  IONIC_REACT = "ionicreact",
  VITE = "vite",
  SCULLY = "scully",
  STENCIL = "stencil",
  BRUNCH = "brunch",
  IONIC_ANGULAR = "ionicangular",
}

export {
  ProjectTypeEnum,
  DeploymentEnvironmentStatusEnum,
  ProjectStateEnum,
  NodeVersionEnum,
  FrameworkEnum,
};
