import { create } from 'zustand'
import { normalizeErrorMessage } from '../utils';
import TraitShopAbi from '../contracts/TraitsShop.json'
import Erc20TokenAbi from '../contracts/ERC20_Contract_Abi.json'

const useContractStore = create((set) => ({
  traitShopContract: null,
  erc20TokenContract: null,
  isAdmin: false,
  getERC20TokenContractInstance: async (tokenAddress, web3) => {
    try {
      const erc20TokenContract = new web3.eth.Contract(
          Erc20TokenAbi,
          tokenAddress,
      );
     return erc20TokenContract;
  } catch (e) {
    normalizeErrorMessage(e);
  }
  },
  initTraitShopContract: async (walletAddress, web3) => {
    try {
        const traitShopContract = new web3.eth.Contract(
            TraitShopAbi,
            process.env.REACT_APP_TRAIT_SHOP_ADDRESS,
        );
        set({ traitShopContract })
        const isAdmin = await traitShopContract.methods.isAdmin(walletAddress).call();
        console.log('isAdmin', isAdmin);
        set({ isAdmin })
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },

}));

export default useContractStore;