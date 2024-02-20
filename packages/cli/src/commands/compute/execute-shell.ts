import { ShellExecutionResponse } from "@spheron/core-testing";
import Spinner from "../../outputs/spinner";
import SpheronApiService from "../../services/spheron-api";

export async function executeShell(
  instanceId: string,
  command: string,
  serviceName?: string
) {
  const spinner = new Spinner();
  try {
    const result: ShellExecutionResponse =
      await SpheronApiService.executeShellCommand(instanceId, command);
    console.log(JSON.stringify(result, null, 2));
    spinner.success(``);
  } catch (error) {
    console.log(`✖️  Error: ${error.message}`);
  } finally {
    spinner.stop();
  }
}
