import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { HomeTask } from '../wrappers/HomeTask';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HomeTask', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HomeTask');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let homeTask: SandboxContract<HomeTask>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        homeTask = blockchain.openContract(HomeTask.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await homeTask.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: homeTask.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and homeTask are ready to use
    });
});
