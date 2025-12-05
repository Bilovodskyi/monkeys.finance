export type InstanceRecord = {
    id: string;
    userId: string;
    name: string;
    exchange: string;
    instrument: string;
    strategy: string;
    positionSizeUSDT: string;
    isTestnet: boolean;
    status: string;
    createdAt: Date;
};