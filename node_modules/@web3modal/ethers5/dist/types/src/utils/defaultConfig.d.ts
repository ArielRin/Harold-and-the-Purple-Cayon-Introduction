import '@web3modal/polyfills';
import type { Chain, Metadata, ProviderType } from '@web3modal/scaffold-utils/ethers';
export interface ConfigOptions {
    enableEIP6963?: boolean;
    enableCoinbase?: boolean;
    enableInjected?: boolean;
    rpcUrl?: string;
    defaultChainId?: number;
    metadata: Metadata;
    chains?: Chain[];
    coinbasePreference?: 'all' | 'smartWalletOnly' | 'eoaOnly';
}
export declare function defaultConfig(options: ConfigOptions): ProviderType;
