import { create } from 'zustand'
import { Apis } from '../Apis'
import { normalizeErrorMessage } from '../utils';
import useLoadingStore, { LOADINGS } from './useLoadingStore';


const useTraitStore = create((set, get) => ({
  traits: [],
  trait: {},
  fetchSellTraits: async (walletAddress) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.LOAD_TRAITS, true);
      const response = await Apis.fetchTraitSellListing(walletAddress)
      set({ traits: response.data });
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.LOAD_TRAITS, false);
    }
  },
  fetchSingleSellTraits: async (id) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.LOAD_DETAILS, true);
      const response = await Apis.fetchSingleSellTrait(id)
      set({ trait: response.data })
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.LOAD_DETAILS, false);
    }
  },
  createSellTrait: async (payload, onHide) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.CREATE_TRAIT, true);
      const traits = get().traits;
      const response = await Apis.createTraitSellListing(payload);
      set({ traits: [...traits, response.data] })
      onHide();
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.CREATE_TRAIT, false);
    }
  },
  deleteTraitSell: async (id, walletAddress) => {
    const setLoading = useLoadingStore.getState().setLoading;
    try {
      setLoading(LOADINGS.DETELE_TRAIT, true);
      await Apis.deleteTraitSell(id);
      get().fetchSellTraits(walletAddress);
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.DETELE_TRAIT, false);
    }
  },
  signMessage: async (body) => {
    try {
      return await Apis.signMessage(body);
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },
}));

export default useTraitStore;