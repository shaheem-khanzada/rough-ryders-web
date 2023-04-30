import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TraitListing from "../screens/TraitListing";
import TraitDetails from "../screens/TraitDetails";
import { useWeb3React } from '@web3-react/core';
import useContractStore from "../store/useContractStore";
import useTraitStore from "../store/useTraitStore";
import { injected } from '../connectors';


const NavigationContainer = React.memo(() => {
  const { account, activate, library } = useWeb3React();
  const initTraitShopContract = useContractStore((state) => state.initTraitShopContract);
  const fetchSellTraits = useTraitStore((state) => state.fetchSellTraits);


  useEffect(() => {
    console.log('library', library);
    if (account) {
      initTraitShopContract(account, library);
      fetchSellTraits(account);
    }
  }, [initTraitShopContract, fetchSellTraits, account, library]);

  useEffect(() => {
    activate(injected)
  }, [activate]);

  return (
    <Routes>
      <Route path="/" element={<TraitListing />} />
      <Route path="detail/:id" element={<TraitDetails />} />
    </Routes>
  )
});

export default NavigationContainer;