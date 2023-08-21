import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TweetJobListing from "../screens/TweetJobListing";
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';
import useTweetApiStore from "../store/useTweetApiStore";

const NavigationContainer = React.memo(() => {
  const { account, activate, library } = useWeb3React();
  const { fetchTweetJobs } = useTweetApiStore((state) => ({
    fetchTweetJobs: state.fetchTweetJobs, 
    tweetJobs: state.tweetJobs
  }))

  useEffect(() => {
    if (account) {
      fetchTweetJobs(account);
    }
  }, [fetchTweetJobs, account, library]);

  useEffect(() => {
    activate(injected)
  }, [activate]);

  return (
    <Routes>
      <Route path="/" element={<TweetJobListing />} />
    </Routes>
  )
});

export default NavigationContainer;