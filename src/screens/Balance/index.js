import React, { useEffect } from 'react';
import { Button, Container, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import useTweetApiStore from '../../store/useTweetApiStore';
import useLoadingStore from '../../store/useLoadingStore';

const Balance = React.memo(() => {
    const { library, account } = useWeb3React();
    const { withdrawRewardsLoading } = useLoadingStore((state) => ({
        withdrawRewardsLoading: state.withdrawRewards,
    }));

    const { tokenBalances, getUserTokenBalance, withdrawAll } = useTweetApiStore((state) => ({
        getUserTokenBalance: state.getUserTokenBalance,
        tokenBalances: state.tokenBalances,
        withdrawAll: state.withdrawAll
    }));

    useEffect(() => {
        if (account) {
            getUserTokenBalance(account)
        }
    }, [account, getUserTokenBalance]);

    return (
        <Container fluid>
            <ListGroup>
                {tokenBalances.map((item, index) => (
                    <ListGroupItem key={index}>
                        <div>
                            {item.tokenSymbol} - {item.balance}
                        </div>
                    </ListGroupItem>
                ))}
            </ListGroup>
            {tokenBalances.length ? <Button
                disabled={withdrawRewardsLoading}
                className='mt-3'
                onClick={() => withdrawAll(account, library)}
            >
                {withdrawRewardsLoading ? "Loading..." : "Withdraw All"}
            </Button> : null}
        </Container>
    )
});

export default Balance;