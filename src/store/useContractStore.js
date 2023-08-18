import { create } from 'zustand'
import { normalizeErrorMessage } from '../utils';
import TweetRewardSystem from '../contracts/TweetRewardSystem.json'
import Erc20TokenAbi from '../contracts/ERC20_Contract_Abi.json'

const useContractStore = create((set) => ({
  traitShopContract: null,
  erc20TokenContract: null,
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
  getTweetRewardSystemContract: async (web3) => {
    try {
      const tweetRewardSystemContract = new web3.eth.Contract(
        TweetRewardSystem.abi,
        process.env.REACT_APP_TWEET_REWARD_SYSTEM_ADDRESS,
      );
      return tweetRewardSystemContract;
    } catch (e) {
      normalizeErrorMessage(e);
    }
  },

}));

export default useContractStore;