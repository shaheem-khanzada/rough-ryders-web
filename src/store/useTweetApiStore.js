import { create } from 'zustand'
import { Apis } from '../Apis'
import { normalizeErrorMessage } from '../utils';
import useLoadingStore, { LOADINGS } from './useLoadingStore';
import { toast } from 'react-toastify';

const useTweetApiStore = create((set, get) => ({
  tweetJobs: [],
  tweetJob: {},
  userRewards: [],
  verifiedRewards: [],
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
  fetchTweetJobs: async () => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.LOAD_TWEET_JOBS, true);
      const response = await Apis.fetchTweetJobs()
      set({ tweetJobs: response.data });
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
  getRewardWithdrawDetails: async (wallet) => {
    try {
      const response = await Apis.getRewardWithdrawDetails(wallet);
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
}));

export default useTweetApiStore;