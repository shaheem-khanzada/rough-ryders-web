import { create } from 'zustand'
import { normalizeErrorMessage } from '../utils';
import RoughRyders from '../contracts/RoughRyders.json'
import Erc20TokenAbi from '../contracts/ERC20_Contract_Abi.json'

const useContractStore = create((set) => ({
  traitShopContract: null,
  erc20TokenContract: null,
  getERC20TokenContractInstance: (tokenAddress, web3) => {
    try {
      const erc20TokenContract = new web3.eth.Contract(
        Erc20TokenAbi,
        tokenAddress,
      );
      return erc20TokenContract;
    } catch (e) {
      console.log('error getERC20TokenContractInstance', e)
      normalizeErrorMessage(e);
    }
  },
  getRoughRydersContract: (web3) => {
    try {
      const roughRydersContract = new web3.eth.Contract(
        RoughRyders.abi,
        process.env.REACT_APP_ROUGH_RYDERS_ADDRESS,
      );
      return roughRydersContract;
    } catch (e) {
      console.log('error getRoughRydersContract', e)
      normalizeErrorMessage(e);
    }
  },
}));

export default useContractStore;