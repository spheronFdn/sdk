export declare enum ProtocolEnum {
    ARWEAVE = "arweave",
    FILECOIN = "ipfs-filecoin",
    IPFS = "ipfs"
}
declare enum ProjectTypeEnum {
    STANDARD = "STANDARD",
    UPLOAD = "UPLOAD"
}
declare enum DeploymentEnvironmentStatusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PAYMENT_PENDING = "PAYMENT_PENDING"
}
declare enum ProjectStateEnum {
    MAINTAINED = "MAINTAINED",
    ARCHIVED = "ARCHIVED"
}
declare enum DomainTypeEnum {
    DOMAIN = "domain",
    SUBDOMAIN = "subdomain",
    HANDSHAKE_DOMAIN = "handshake-domain",
    HANDSHAKE_SUBDOMAIN = "handshake-subdomain",
    ENS_DOMAIN = "ens-domain"
}
declare enum DomainApplicationTypeEnum {
    WEB = 1,
    COMPUTE = 2
}
declare enum NodeVersionEnum {
    V_12 = "V_12",
    V_14 = "V_14",
    V_16 = "V_16"
}
declare enum FrameworkEnum {
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
    IONIC_ANGULAR = "ionicangular"
}
declare enum DeploymentStatusEnum {
    PRE_QUEUE = "PreQueue",
    QUEUED = "Queued",
    PENDING = "Pending",
    CANCELED = "Canceled",
    DEPLOYED = "Deployed",
    FAILED = "Failed",
    AUTHORIZATION_NEEDED = "AuthorizationNeeded",
    KILLING = "Killing",
    TIMED_OUT = "TimedOut"
}
export { ProjectTypeEnum, DeploymentEnvironmentStatusEnum, ProjectStateEnum, NodeVersionEnum, FrameworkEnum, DomainTypeEnum, DomainApplicationTypeEnum, DeploymentStatusEnum, };
