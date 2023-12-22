import { create } from 'zustand'
import { Apis } from '../Apis'
import { normalizeErrorMessage } from '../utils';
import useLoadingStore, { LOADINGS } from './useLoadingStore';
import { toast } from 'react-toastify';
import useContractStore from './useContractStore';

const useTweetApiStore = create((set, get) => ({
  tweetJobs: [],
  tweetJob: {},
  userRewards: [],
  verifiedRewards: [],
  tokenBalances: [],
  tokenBalancesOption: [],
  setTweetjob: (job) => {
    set({ tweetJob: job });
  },
  performTweetEngagement: async (payload) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.PERFORM_TWEET_ENGAGEMENT, true);
      await Apis.performTweetEngagement(payload);
      toast.success('Success!');
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.PERFORM_TWEET_ENGAGEMENT, false);
    }
  },
  fetchTweetJobs: async (wallet) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.LOAD_TWEET_JOBS, true);
      const response = await Apis.fetchTweetJobs(wallet)
      set({ tweetJobs: response.data.jobs });
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.LOAD_TWEET_JOBS, false);
    }
  },
  createTweetJob: async (payload) => {
    try {
      const response = await Apis.createTweetJob(payload);
      return response;
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },
  getWithdrawDetails: async (wallet, signature) => {
    try {
      const response = await Apis.getWithdrawDetails(wallet, signature);
      console.log('response.data', response.data);
      return response.data;
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },
  getUserRewards: async (wallet) => {
    try {
      const { data } = await Apis.getUserRewards(wallet);
      set({
        userRewards: data,
        verifiedRewards: data.filter((reward) => reward.status === 'verified')
      })
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },
  getUserTokenBalance: async (wallet) => {
    try {
      const { data } = await Apis.getUserTokenBalance(wallet);
      set({
        tokenBalances: data,
        tokenBalancesOption: data.map((item) => (
          { value: item.balance, label: `${item.tokenSymbol} - ${item.balance}`, ...item }
        ))
      })
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },
  claimAllRewards: async (payload) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.CLAIM_ALL, true);
      const { getUserRewards, getUserTokenBalance } = get();
      await Apis.claimAllRewards(payload);
      await getUserRewards(payload.wallet);
      await getUserTokenBalance(payload.wallet)
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.CLAIM_ALL, false);
    }
  },
  cancelTweetJob: async (payload, wallet) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      const { fetchTweetJobs, getUserTokenBalance } = get();
      setLoading(LOADINGS.CANCEL_TWEET_JOB, true);
      await Apis.cancelTweetJob(payload);
      await fetchTweetJobs()
      await getUserTokenBalance(wallet)
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.CANCEL_TWEET_JOB, false);
    }
  },
  
  withdrawAll: async (account, web3) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
        setLoading(LOADINGS.WITHDRAW_REWARDS, true);
        const message = "I am collecting withdraw details"
        console.log('message', message);
        const signSignature = await web3.eth.personal.sign(message, account, '');

        const { getWithdrawDetails, getUserTokenBalance } = get();
        const { getTweetRewardSystemContract } = useContractStore.getState();
        const { amounts, tokens, signature, timeOut } = await getWithdrawDetails(account, signSignature);
        const tweetRewardSystemContract = await getTweetRewardSystemContract(web3);
        const { withdrawBatch } = tweetRewardSystemContract.methods;
        await withdrawBatch(tokens, amounts, timeOut, signature).call({ from: account });
        const transaction = await withdrawBatch(tokens, amounts, timeOut, signature).send({ from: account });
        console.log('transaction', transaction);
        setTimeout(() => getUserTokenBalance(account), 3000)
        setTimeout(() => getUserTokenBalance(account), 8000)
        return transaction;
    } catch (e) {
        normalizeErrorMessage(e);
    } finally {
        setLoading(LOADINGS.WITHDRAW_REWARDS, false);
    }
}
}));

export default useTweetApiStore;