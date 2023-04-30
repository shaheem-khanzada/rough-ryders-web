import { create } from 'zustand';

export const LOADINGS = {
    LOAD_DETAILS: 'loadDetails',
    LOAD_TRAITS: 'loadTraits',
    CREATE_TRAIT: 'createTrait',
    DETELE_TRAIT: 'deleteTrait',
    BUY_TRAIT_WITH_ERC20: 'buyTraitWithERC20',
    BUY_TRAIT_WITH_ETH: 'buyTraitWithETH'
}

const useLoadingStore = create((set) => ({
   loadDetails: false,
   createTrait: false,
   deleteTrait: false,
   loadTraits: false,
   buyTraitWithERC20: false,
   buyTraitWithETH: false,
   setLoading: (key, boolean) => {
    set({ [key]: boolean });
   }
}));

export default useLoadingStore;