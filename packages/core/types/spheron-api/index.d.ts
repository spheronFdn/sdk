import { DeploymentStatusEnum, DomainTypeEnum, FrameworkEnum, NodeVersionEnum, ProjectStateEnum } from "./enums";
import { Configuration, Deployment, Domain, Project, TokenScope } from "./interfaces";
declare class SpheronApi {
    private readonly spheronApiUrl;
    private readonly token;
    constructor(token: string);
    getTokenScope(): Promise<TokenScope>;
    getProject(projectId: string): Promise<Project>;
    getProjectDeployments(projectId: string, options: {
        skip: number;
        limit: number;
        status?: DeploymentStatusEnum;
    }): Promise<{
        deployments: Deployment[];
    }>;
    getProjectDomains(projectId: string): Promise<{
        domains: Domain[];
    }>;
    getProjectDomain(projectId: string, domainIdentifier: string): Promise<{
        domain: Domain;
    }>;
    addProjectDomain(projectId: string, options: {
        link: string;
        type: DomainTypeEnum | string;
        deploymentEnvironments: string[];
        name: string;
    }): Promise<{
        domain: Domain;
    }>;
    patchProjectDomain(projectId: string, domainIdentifier: string, options: {
        link: string;
        deploymentEnvironments: string[];
        name: string;
    }): Promise<{
        domain: Domain;
    }>;
    verifyProjectDomain(projectId: string, domainIdentifier: string): Promise<{
        success: boolean;
        domain: Domain;
    }>;
    deleteProjectDomain(projectId: string, domainIdentifier: string): Promise<void>;
    getProjectDeploymentCount(projectId: string): Promise<{
        total: number;
        successful: number;
        failed: number;
        pending: number;
    }>;
    updateProjectState(projectId: string, state: ProjectStateEnum | string): Promise<{
        message: string;
    }>;
    updateProjectConfiguration(projectId: string, options: {
        buildCommand: string;
        installCommand: string;
        workspace: string;
        publishDir: string;
        framework: FrameworkEnum | string;
        nodeVersion: NodeVersionEnum | string;
    }): Promise<{
        configuration: Configuration;
    }>;
    getDeployment(deploymentId: string): Promise<Deployment>;
    private sendApiRequest;
}
export default SpheronApi;
