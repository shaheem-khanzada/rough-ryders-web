import React, { useEffect } from 'react';
import { Badge, Button, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import useTweetApiStore from '../../store/useTweetApiStore';
import useContractStore from '../../store/useContractStore';
import { normalizeErrorMessage } from '../../utils';
import useLoadingStore, { LOADINGS } from '../../store/useLoadingStore';

const status = {
    required_verification: 'Pending for verification',
    verified: 'Claimable',
    claimed: 'Already Claimbed'
}

const statusStyle = {
    required_verification: { color: 'red', border: '1px solid red' },
    verified: { color: 'green', border: '1px solid green' },
    claimed: { color: '#0d6efd', border: '1px solid #0d6efd' }
}

const Withdraw = React.memo(() => {
    const { library, account } = useWeb3React();
    const getTweetRewardSystemContract = useContractStore((state) => state.getTweetRewardSystemContract);
    const { withdrawRewardsLoading, setLoading } = useLoadingStore((state) => ({
        withdrawRewardsLoading: state.withdrawRewards,
        setLoading: state.setLoading
    }));

    const { getUserRewards, userRewards, getRewardWithdrawDetails, verifiedRewards } = useTweetApiStore((state) => ({
        getUserRewards: state.getUserRewards,
        userRewards: state.userRewards,
        verifiedRewards: state.verifiedRewards,
        getRewardWithdrawDetails: state.getRewardWithdrawDetails
    }));

    const withdrawAll = async () => {
        try {
            setLoading(LOADINGS.WITHDRAW_REWARDS, true);
            const { amounts, tokens, signature, timeOut } = await getRewardWithdrawDetails(account);
            const tweetRewardSystemContract = await getTweetRewardSystemContract(library);
            const { withdrawBatch } = tweetRewardSystemContract.methods;
            await withdrawBatch(tokens, amounts, timeOut, signature).call({ from: account });
            await withdrawBatch(tokens, amounts, timeOut, signature).send({ from: account });
            setTimeout(() => {
                getUserRewards(account);
            }, 5000)
        } catch (e) {
            normalizeErrorMessage(e);
        } finally {
            setLoading(LOADINGS.WITHDRAW_REWARDS, false);
        }
    }

    useEffect(() => {
        if (account) {
            getUserRewards(account)
        }
    }, [account, getUserRewards]);

    return (
        <Container fluid>
            <ListGroup>
                {userRewards.map((item, index) => (
                    <ListGroupItem key={index}>
                        <div>
                            <strong>Reward Amount:</strong> {item.rewardAmount}
                            <Badge
                                style={{ marginLeft: 10, ...statusStyle[item.status] }}
                                bg={'transparent'}
                            >
                                {status[item.status]}
                            </Badge>
                        </div>
                        <div>
                            <strong>Reward Token Address:</strong> {item.rewardTokenAddress}
                        </div>
                        <div>
                            <strong>Reward Token Type:</strong> {item.rewardTokenType}
                        </div>
                    </ListGroupItem>
                ))}
            </ListGroup>
            <Button disabled={verifiedRewards.length === 0 || withdrawRewardsLoading} className='mt-3' onClick={withdrawAll}>{withdrawRewardsLoading ? "Loading..." : "Withdraw All Claimable"}</Button>
        </Container>
    )
});

export default Withdraw;