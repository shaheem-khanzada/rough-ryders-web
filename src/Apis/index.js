import axios from "axios"

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const fetchTweetJobs = (wallet) => {
    return axios.get(`/tweet-jobs/list?wallet=${wallet}`);
};

const createTweetJob = (payload) => {
    return axios.post('/tweet-jobs/create', payload);
};

const performTweetEngagement = (payload) => {
    return axios.post('/tweet-jobs/perform-engagement', payload);
}

const claimAllRewards = (payload) => {
    return axios.post('/tweet-jobs/claim-rewards', payload);
}

const cancelTweetJob = (payload) => {
    return axios.post('/tweet-jobs/cancel-job', payload);
}

const getWithdrawDetails = (wallet, signature) => {
    return axios.get(`/tweet-jobs/withdraw-details?wallet=${wallet}&signature=${signature}`);
}

const getUserRewards = (wallet) => {
    return axios.get(`/tweet-jobs/user-rewards?wallet=${wallet}`);
}

const getUserTokenBalance = (wallet) => {
    return axios.get(`/tweet-jobs/user-balance?wallet=${wallet}`);
}

const Apis = {
    fetchTweetJobs,
    createTweetJob,
    performTweetEngagement,
    getWithdrawDetails,
    getUserRewards,
    claimAllRewards,
    getUserTokenBalance,
    cancelTweetJob
}
export { Apis }