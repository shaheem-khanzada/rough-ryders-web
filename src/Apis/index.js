import axios from "axios"

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const fetchNftList = (wallet) => {
    return axios.get(`/rough-ryders/list?wallet=${wallet}`);
};

const calculateNftReward = (body) => {
    return axios.post('/rough-ryders/calculate-reward', body);
};

const fetchUserBalance = (wallet) => {
    return axios.get(`/rough-ryders/user-balance?wallet=${wallet}`)
}

const fetchRewardTokens = () => {
    return axios.get('/rough-ryders/reward-tokens')
}

const claimNftReward = (body) => {
    return axios.post('/rough-ryders/claim-nft-reward', body)
}

const Apis = {
    fetchNftList,
    calculateNftReward,
    fetchUserBalance,
    fetchRewardTokens,
    claimNftReward
}
export { Apis }