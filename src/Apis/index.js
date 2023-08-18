import axios from "axios"

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const fetchTraitSellListing = (walletAddress) => {
    return axios.get(`/trait/list?walletAddress=${walletAddress}`);
};

const fetchSingleSellTrait = (id) => {
    return axios.get(`/trait/id/${id}`)
}

const signMessage = (body) => {
    return axios.post('/trait/sign', body);
}

const saveBuyOffChainTraitResult = (body) => {
    return axios.post('/trait/purchase', body);
}

const deleteTraitSell = (id) => {
    return axios.delete(`/trait/${id}`)
}

const createTraitSellListing = (payload) => {
    return axios.post('/trait/sell', payload);
};

const Apis = {
    fetchTraitSellListing,
    createTraitSellListing,
    fetchSingleSellTrait,
    deleteTraitSell,
    signMessage,
    saveBuyOffChainTraitResult
}
export { Apis }