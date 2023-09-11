import React, { useEffect } from "react";
import Select from 'react-select';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import useLoadingStore, { LOADINGS } from "../../store/useLoadingStore";
import GroupButton from "../GroupButton";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useWeb3React } from "@web3-react/core";
import useTweetApiStore from "../../store/useTweetApiStore";
import { normalizeErrorMessage } from "../../utils";

const CreateTweetJobModal = (props) => {
  const { library: web3, account } = useWeb3React();

  const { onHide } = props;
  
  const { createTweetJobLoading, setLoading } = useLoadingStore((state) => ({
    createTweetJobLoading: state.createTweetJob,
    setLoading: state.setLoading
  }));

  const { createTweetJob, getUserTokenBalance, tokenBalancesOption, fetchTweetJobs } = useTweetApiStore((state) => ({
    createTweetJob: state.createTweetJob,
    fetchTweetJobs: state.fetchTweetJobs,
    getUserTokenBalance: state.getUserTokenBalance,
    tokenBalancesOption: state.tokenBalancesOption
  }));

  useEffect(() => {
    if (account) {
      getUserTokenBalance(account)
    }
  }, [account, getUserTokenBalance])

  const { register, handleSubmit, control } = useForm()
  const rewardPerEngagement = useWatch({
    control,
    defaultValue: 0,
    name: "rewardPerEngagement",
  });
  const tokenDetails = useWatch({
    control,
    name: "tokenDetails",
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

  console.log('tokenDetails', tokenDetails);

  const parseNumbers = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && !isNaN(obj[key]) && !web3.utils.isAddress(obj[key])) {
        obj[key] = parseFloat(obj[key]);
      }
    }
    return obj;
  }

  const onSumit = async (payload) => {
    try {
      setLoading(LOADINGS.CREATE_TWEET_JOB, true);
      const { totalEngagementCount, rewardPerEngagement, engagementType, tweetUrl, username } = parseNumbers(payload);
      const totalRewardAmount = parseInt(totalEngagementCount) * parseFloat(rewardPerEngagement)

      if (!tokenDetails) {
        throw new Error(`Please select a token first`);
      }

      if (totalRewardAmount > tokenDetails.balance) {
         throw new Error(`Not Enough Balance`);
      }

      if (totalRewardAmount <= 0) {
        throw new Error(`Total reward amount must be greater than zero`);
     }

     const message = "I'am creating engagement job"
     const signature = await web3.eth.personal.sign(message, account, '');

      const jobPayload = {
        signature,
        totalRewardAmount,
        rewardTokenAddress: tokenDetails.tokenAddress,
        rewardTokenSymbol: tokenDetails.tokenSymbol,
        tweetUrl,
        username,
        rewardPerEngagement,
        totalEngagementCount,
        engagementType,
        status: 'active',
        creator: account
      }

      console.log('createTweetJob data', jobPayload);

      const { data } = await createTweetJob(jobPayload);
      console.log('createTweetJob data', data);
      await fetchTweetJobs()
      await getUserTokenBalance(account)
      onHide()
    } catch (e) {
      console.log('error', e);
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

          <Form.Group className="mb-3 d-flex flex-column" controlId="tokenDetails">
            <Form.Label>Select Token</Form.Label>
            <Controller
              name="tokenDetails"
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  name="token-options"
                  onChange={(value) => onChange(value)}
                  options={tokenBalancesOption}
                />
              )}
            />
          </Form.Group>

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
