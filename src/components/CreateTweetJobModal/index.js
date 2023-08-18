import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Decimal from 'decimal.js';
import useLoadingStore, { LOADINGS } from "../../store/useLoadingStore";
import GroupButton from "../GroupButton";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";
import useContractStore from "../../store/useContractStore";
import useTweetApiStore from "../../store/useTweetApiStore";
import { normalizeErrorMessage } from "../../utils";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';


const CreateTweetJobModal = (props) => {
  const { library, account } = useWeb3React();

  const { onHide } = props;
  const { createTweetJobLoading, setLoading } = useLoadingStore((state) => ({
    createTweetJobLoading: state.createTweetJob,
    setLoading: state.setLoading
   }));
  const createTweetJob = useTweetApiStore((state) => state.createTweetJob);
  const getERC20TokenContractInstance = useContractStore((state) => state.getERC20TokenContractInstance);
  const getTweetRewardSystemContract = useContractStore((state) => state.getTweetRewardSystemContract);

  const { register, handleSubmit, control } = useForm()
  const rewardPerEngagement = useWatch({
    control,
    defaultValue: 0,
    name: "rewardPerEngagement",
  });
  const engagementType = useWatch({
    control,
    defaultValue: 'like',
    name: "engagementType",
  });
  const totalEngagementCount = useWatch({
    control,
    defaultValue: 0,
    name: "totalEngagementCount",
  });
  const rewardTokenType = useWatch({
    control,
    defaultValue: 'native',
    name: "rewardTokenType",
  });

  const parseNumbers = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && !isNaN(obj[key]) && !library.utils.isAddress(obj[key])) {
        obj[key] = parseFloat(obj[key]);
      }
    }
    return obj;
  }

  const handleNativeTokenDepositValidation = async (payload, totalRewardAmount, tweetRewardSystemContract) => {
    const { depositETH } = tweetRewardSystemContract.methods;
    const balance = await library.eth.getBalance(account);
    const balanceInEther = library.utils.fromWei(balance, 'ether');
    const price = library.utils.toWei(totalRewardAmount.toString(), 'ether');

    if (totalRewardAmount > parseFloat(balanceInEther)) {
      throw new Error("You don't have enough ETH balance");
    }

    await depositETH('TEST_JOB_ID').call({
      from: account,
      value: price,
    });
    payload.tokenPrice = price;
    return price;
  };

  const handleERC20TokenDepositValidation = async (payload, totalRewardAmount, tweetRewardSystemContract) => {
    const { depositERC20 } = tweetRewardSystemContract.methods;

    const { methods: { allowance, balanceOf, decimals, approve } } = await getERC20TokenContractInstance(payload.rewardTokenAddress, library);
    const tokenDecimals = Number(await decimals().call());
    const priceInTokens = new Decimal(totalRewardAmount).times(new Decimal(10).pow(tokenDecimals)).toFixed(0);

    const priceBN = library.utils.toBN(priceInTokens);

    const spenderAddress = process.env.REACT_APP_TWEET_REWARD_SYSTEM_ADDRESS;
    const tokenAllowance = await allowance(account, spenderAddress).call();
    const allowanceBN = library.utils.toBN(tokenAllowance);

    const balance = await balanceOf(account).call();
    const balanceBN = library.utils.toBN(balance);

    if (!balanceBN.gte(priceBN)) {
      throw new Error("You don't have enough balance")
    }

    if (allowanceBN.lte(priceBN)) {
      await approve(spenderAddress, priceInTokens).send({ from: account });
    }

    const staticPayload = [payload.rewardTokenAddress, priceInTokens, 'TEST_JOB_ID'];

    await depositERC20(...staticPayload).call({
      from: account,
    });
    payload.tokenPrice = priceInTokens;
    return priceInTokens;
  };

  const handleFinalTokenDeposit = async (jobId, payload, tweetRewardSystemContract) => {
    const { rewardTokenType, rewardTokenAddress, tokenPrice } = payload;
    const { depositETH, depositERC20 } = tweetRewardSystemContract.methods;

    switch (rewardTokenType) {
      case 'native':
        return depositETH(jobId).send({ from: account, value: tokenPrice });
      case 'token':
        return depositERC20(rewardTokenAddress, tokenPrice, jobId).send({ from: account });
      default:
        throw new Error('Invalid reward token type');
    }
  };

  const onSumit = async (payload) => {
    try {
      setLoading(LOADINGS.CREATE_TWEET_JOB, true);
      const { totalEngagementCount, rewardPerEngagement } = parseNumbers(payload);
      const totalRewardAmount = parseInt(totalEngagementCount) * parseFloat(rewardPerEngagement)
      const tweetRewardSystemContract = await getTweetRewardSystemContract(library);
      
      if (rewardTokenType === 'native') {
        payload.rewardTokenAddress = ZERO_ADDRESS;
        await handleNativeTokenDepositValidation(payload, totalRewardAmount, tweetRewardSystemContract);
      } else if (rewardTokenType === 'token') {
        await handleERC20TokenDepositValidation(payload, totalRewardAmount, tweetRewardSystemContract);
      }

      const jobPayload = {
        ...payload,
        totalRewardAmount,
        status: 'incomplete_deposit',
        creator: account
      }

      const { data } = await createTweetJob(jobPayload);

      const transaction = await handleFinalTokenDeposit(data._id, payload, tweetRewardSystemContract);
      console.log('transaction', transaction);
      onHide()
    } catch (e) {
      normalizeErrorMessage(e);
    } finally {
      setLoading(LOADINGS.CREATE_TWEET_JOB, false);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Tweet Job
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSumit)}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="string"
              {...register("username", { required: true })}
              placeholder="Enter User Name"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="tweetUrl">
            <Form.Label>Tweet Url</Form.Label>
            <Form.Control
              type="string"
              {...register("tweetUrl", { required: true })}
              placeholder="Enter Tweet Url"
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex flex-column" controlId="engagementType">
            <Form.Label>Engagement Type</Form.Label>
            <Controller
              name="engagementType"
              control={control}
              defaultValue="like"
              render={({ field: { onChange, value } }) => (
                <GroupButton
                  item={['like', 'retweet', 'comment']}
                  onChange={(value) => {
                    onChange(value);
                  }}
                  selectedValue={value}
                />
              )}
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex flex-column" controlId="rewardTokenType">
            <Form.Label>Reward Token Type</Form.Label>
            <Controller
              name="rewardTokenType"
              control={control}
              defaultValue="native"
              render={({ field: { onChange, value } }) => (
                <GroupButton
                  item={['native', 'token']}
                  onChange={(value) => {
                    onChange(value);
                  }}
                  selectedValue={value}
                />
              )}
            />
          </Form.Group>

          {rewardTokenType === 'token' ? <Form.Group className="mb-3" controlId="rewardTokenAddress">
            <Form.Label>Reward Token Address</Form.Label>
            <Form.Control
              type="string"
              {...register("rewardTokenAddress", { required: true })}
              placeholder="Enter Reward Token Address"
            />
          </Form.Group> : null}


          <Form.Group className="mb-3" controlId="rewardPerEngagement">
            <Form.Label>Reward Per Engagement</Form.Label>
            <Form.Control
              type="number"
              {...register("rewardPerEngagement", { required: true })}
              step="any"
              placeholder="Enter Reward Per Engagement"
            />
          </Form.Group>

          {rewardPerEngagement ? <Form.Group className="mb-3" controlId="totalEngagementCount">
            <Form.Label>Number of {engagementType} required</Form.Label>
            <Form.Control
              type="number"
              {...register("totalEngagementCount", { required: true })}
              placeholder="Enter total engagement Count"
            />
          </Form.Group> : null}

          <Form.Group className="mb-3" controlId="totalRewardAmount">
            <Form.Label>Total Reward Amount</Form.Label>
            <Form.Control
              type="number"
              disabled
              readOnly
              value={(totalEngagementCount * rewardPerEngagement) || 0}
              placeholder="Total Reward Amount"
            />
          </Form.Group>

          <Button variant="primary" type="submit" style={{ marginTop: 15 }}>
            {createTweetJobLoading ? "Creating..." : "Create"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTweetJobModal;
