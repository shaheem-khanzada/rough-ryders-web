import axios from "axios"

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const fetchTweetJobs = () => {
    return axios.get(`/tweet-jobs/list`);
};

const createTweetJob = (payload) => {
    return axios.post('/tweet-jobs/create', payload);
};

const performTweetEngagement = (payload) => {
    return axios.post('/tweet-jobs/perform-engagement', payload);
}

const getRewardWithdrawDetails = (wallet) => {
    return axios.get(`/tweet-jobs/reward-withdraw-details?wallet=${wallet}`);
}

const getUserRewards = (wallet) => {
    return axios.get(`/tweet-jobs/user-rewards?wallet=${wallet}`);
}

const Apis = {
    fetchTweetJobs,
    createTweetJob,
    performTweetEngagement,
    getRewardWithdrawDetails,
    getUserRewards,
}
export { Apis }