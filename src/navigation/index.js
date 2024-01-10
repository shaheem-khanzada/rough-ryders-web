import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../screens/Home";
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';
import useRoughRydersStore from "../store/useRoughRydersStore";

const NavigationContainer = React.memo(() => {
  const { account, activate, library } = useWeb3React();
  const { fetchNftList, fetchUserBalance, fetchRewardTokens  } = useRoughRydersStore((state) => ({
    fetchNftList: state.fetchNftList,
    fetchUserBalance: state.fetchUserBalance,
    fetchRewardTokens: state.fetchRewardTokens,
    tweetJobs: state.tweetJobs
  }))
 

  useEffect(() => {
    if (account) {
      fetchNftList(account);
      fetchUserBalance(account);
      fetchRewardTokens(account);
    }
  }, [fetchNftList, fetchUserBalance, fetchRewardTokens, account, library]);

  useEffect(() => {
    activate(injected)
  }, [activate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
});

export default NavigationContainer;