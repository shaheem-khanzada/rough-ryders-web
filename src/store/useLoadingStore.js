import { create } from 'zustand';

export const LOADINGS = {
    CALCULATE_REWARDS: 'calculateRewards',
    CLAIM_NFT_REWARD: 'claimNftReward',
    CANCEL_TWEET_JOB: 'cancelTweetJob',
    LOAD_NFT_LIST: 'loadNftList',
    CREATE_TWEET_JOB: 'createTweetJob',
    DEPOSIT: 'deposit',
    WITHDRAW_REWARDS: 'withdrawRewards',
    BUY_TRAIT_WITH_ERC20: 'buyTraitWithERC20',
    BUY_TRAIT_WITH_ETH: 'buyTraitWithETH'
}

const useLoadingStore = create((set) => ({
   calculateRewards: false,
   claimNftReward: false,
   deposit: false,
   withdrawRewards: false,
   loadNftList: false,
   setLoading: (key, boolean) => {
    set({ [key]: boolean });
   }
}));

export default useLoadingStore;