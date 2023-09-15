import React, { useEffect } from 'react';
import { Badge, Button, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import useTweetApiStore from '../../store/useTweetApiStore';
import useLoadingStore from '../../store/useLoadingStore';

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
    const { account, library: web3 } = useWeb3React();
    const { claimAllLoading } = useLoadingStore((state) => ({
        claimAllLoading: state.claimAll,
    }));

    const { getUserRewards, userRewards, verifiedRewards, claimAllRewards } = useTweetApiStore((state) => ({
        getUserRewards: state.getUserRewards,
        claimAllRewards: state.claimAllRewards,
        userRewards: state.userRewards,
        verifiedRewards: state.verifiedRewards,
        getWithdrawDetails: state.getWithdrawDetails
    }));

    useEffect(() => {
        if (account) {
            getUserRewards(account)
        }
    }, [account, getUserRewards]);

    const onSubmit = async () => {
        const message = "I am claiming all of my rewards"
        const signature = await web3.eth.personal.sign(message, account, '');
        await claimAllRewards({ wallet: account, signature })
    }

    return (
        <Container fluid>
            <ListGroup>
                {userRewards.map((item, index) => (
                    <ListGroupItem key={index}>
                        <div>
                            <strong>Reward Amount:</strong> {item.rewardAmount} {item.rewardTokenSymbol}
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
                    </ListGroupItem>
                ))}
            </ListGroup>
            <Button
                disabled={verifiedRewards.length === 0 || claimAllLoading}
                className='mt-3'
                onClick={onSubmit}
            >
                {claimAllLoading ? "Loading..." : "Claim All Rewards"}
            </Button>
        </Container>
    )
});

export default Withdraw;