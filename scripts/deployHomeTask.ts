import { toNano } from '@ton/core';
import { HomeTask } from '../wrappers/HomeTask';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const homeTask = provider.open(HomeTask.createFromConfig({}, await compile('HomeTask')));

    await homeTask.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(homeTask.address);

    // run methods on `homeTask`
}
