import React, { useState } from 'react';
import { Container, ListGroup, ListGroupItem, Badge, Button, Row, Col } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import useTweetApiStore from '../../store/useTweetApiStore';
import PerformJobModal from '../../components/PerformJobModal';
import Withdraw from '../Withdraw';
import Balance from '../Balance';
import useLoadingStore from '../../store/useLoadingStore';

const TweetJobListing = React.memo(() => {
    const { account, library: web3 } = useWeb3React();
    const [modalShow, setModalVisiblity] = useState(false);
    const { cancelTweetJobLoading } = useLoadingStore((state) => ({ cancelTweetJobLoading: state.cancelTweetJob }))
    const { tweetJobs, cancelTweetJob, setTweetjob } = useTweetApiStore((state) => ({
        tweetJobs: state.tweetJobs,
        cancelTweetJob: state.cancelTweetJob,
        setTweetjob: state.setTweetjob
    }))

    const handlePerformJob = (item) => {
        setTweetjob(item);
        setModalVisiblity(true);
    };

    const onSubmit = async (id) => {
        const message = "I am cancelling engagement job";
        const signature = await web3.eth.personal.sign(message, account, '');
        const payload = {
            id,
            signature,
        }
        const response = await cancelTweetJob(payload);
        console.log('payload', payload);
        console.log('response', response);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Tweet Job List</h1>
                    <ListGroup>
                        {tweetJobs.map((item, index) => (
                            <ListGroupItem key={index}>
                                <div>
                                    <strong>Creator:</strong> {item.creator}
                                    {item.creator === account ?
                                        <Badge
                                            style={{ marginLeft: 10 }}
                                            variant="primary"
                                        >
                                            Owned by you
                                        </Badge> : null}
                                </div>
                                <div>
                                    <strong>Username:</strong> {item.username}
                                </div>
                                <div>
                                    <strong>Tweet URL:</strong> {item.tweetUrl}
                                </div>
                                <div>
                                    <strong>Engagement Type:</strong> {item.engagementType}
                                </div>
                                <div>
                                    <strong>Reward Token Address:</strong> {item.rewardTokenAddress}
                                </div>
                                <div>
                                    <strong>Reward Token Symbol:</strong> {item.rewardTokenSymbol}
                                </div>
                                <div>
                                    <strong>Reward Per Engagement:</strong> {item.rewardPerEngagement}
                                </div>
                                <Button style={{ marginRight: 5 }} className='mt-3' onClick={() => handlePerformJob(item)}>Perform Job</Button>
                                {item.creator === account ? <Button disabled={cancelTweetJobLoading} variant='danger' className='mt-3' onClick={() => onSubmit(item._id)}>
                                    {cancelTweetJobLoading ? 'Loading...' : 'Cancel Job'}
                                </Button> : null}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Col>
                <Col>
                    <h1>Rewards</h1>
                    <Withdraw />
                </Col>
                <Col>
                    <h1>Balance</h1>
                    <Balance />
                </Col>
            </Row>
            <PerformJobModal show={modalShow} onHide={() => setModalVisiblity(false)} />
        </Container>
    )
});

export default TweetJobListing;