import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type HomeTaskConfig = {};

export function homeTaskConfigToCell(config: HomeTaskConfig): Cell {
    return beginCell().endCell();
}

export class HomeTask implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HomeTask(address);
    }

    static createFromConfig(config: HomeTaskConfig, code: Cell, workchain = 0) {
        const data = homeTaskConfigToCell(config);
        const init = { code, data };
        return new HomeTask(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
