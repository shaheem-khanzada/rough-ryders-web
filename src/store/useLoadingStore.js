import { create } from 'zustand';

export const LOADINGS = {
    PERFORM_TWEET_ENGAGEMENT: 'performTweetEngagement',
    CLAIM_ALL: 'claimAll',
    CANCEL_TWEET_JOB: 'cancelTweetJob',
    LOAD_TWEET_JOBS: 'loadTweetJobs',
    CREATE_TWEET_JOB: 'createTweetJob',
    DEPOSIT: 'deposit',
    WITHDRAW_REWARDS: 'withdrawRewards',
    BUY_TRAIT_WITH_ERC20: 'buyTraitWithERC20',
    BUY_TRAIT_WITH_ETH: 'buyTraitWithETH'
}

const useLoadingStore = create((set) => ({
   performTweetEngagement: false,
   claimAll: false,
   cancelTweetJob: false,
   deposit: false,
   createTweetJob: false,
   withdrawRewards: false,
   loadTweetJobs: false,
   setLoading: (key, boolean) => {
    set({ [key]: boolean });
   }
}));

export default useLoadingStore;