import { create } from 'zustand'
import { Apis } from '../Apis'
import { normalizeErrorMessage } from '../utils';
import useLoadingStore, { LOADINGS } from './useLoadingStore';

const useRoughRydersStore = create((set, get) => ({
  nfts: [],
  balances: [],
  rewardTokens: [],
  fetchNftList: async (wallet) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.LOAD_NFT_LIST, true);
      const response = await Apis.fetchNftList(wallet);
      console.log('response', response)
      set({ nfts: response.data });
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.LOAD_NFT_LIST, false);
    }
  },
  calculateNftReward: async (body) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.CALCULATE_REWARDS, true);
      const { data } = await Apis.calculateNftReward(body);
      return data;
    } catch (e) {
      normalizeErrorMessage(e);
      throw e;
    } finally {
      setLoading(LOADINGS.CALCULATE_REWARDS, false);
    }
  },
  claimNftReward: async (body) => {
    const setLoading = useLoadingStore.getState().setLoading;
    const nfts = get().nfts;
    try {
      setLoading(LOADINGS.CLAIM_NFT_REWARD, true);
      const { data } = await Apis.claimNftReward(body);
      const updatedNfts = nfts.map((nft) => {
        if (nft._id === body.nftId) {
          return { ...nft, startDate: new Date() };
        }
        return nft;
      });
      set({ nfts: updatedNfts })
      return data;
    } catch (e) {
      normalizeErrorMessage(e);
      throw e;
    } finally {
      setLoading(LOADINGS.CLAIM_NFT_REWARD, false);
    }
  },
  fetchUserBalance: async (wallet) => {
    try {
      const response = await Apis.fetchUserBalance(wallet);
      console.log('balance response', response)
      set({ balances: response.data });
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },
  fetchRewardTokens: async () => {
    try {
      const response = await Apis.fetchRewardTokens();
      console.log('reward tokens', response)
      set({ rewardTokens: response.data });
    } catch (e) {
      normalizeErrorMessage(e);
    }
  }

}));

export default useRoughRydersStore;