import { ProjectStateEnum } from "../spheron-api/enums";

interface Domain {
  _id: string;
  name: string;
  link: string;
  verified: boolean;
  bucketId: string;
}

interface Bucket {
  _id: string;
  name: string;
  organizationId: string;
  state: ProjectStateEnum;
  domains: Domain[];
}

export { Bucket };
