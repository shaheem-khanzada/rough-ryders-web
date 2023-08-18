import React, { useState } from 'react';
import { Container, ListGroup, ListGroupItem, Badge, Button } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import useTweetApiStore from '../../store/useTweetApiStore';
import PerformJobModal from '../../components/PerformJobModal';

const TweetJobListing = React.memo(() => {
    const { account } = useWeb3React();
    const [modalShow, setModalVisiblity] = useState(false);
    const { tweetJobs, setTweetjob } = useTweetApiStore((state) => ({
        tweetJobs: state.tweetJobs,
        setTweetjob: state.setTweetjob
    }))

    const handlePerformJob = (item) => {
        setTweetjob(item);
        setModalVisiblity(true);
    };

    return (
        <Container fluid>
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
                            <strong>Reward Token Type:</strong> {item.rewardTokenType}
                        </div>
                        <div>
                            <strong>Reward Per Engagement:</strong> {item.rewardPerEngagement}
                        </div>
                        <Button className='mt-3' onClick={() => handlePerformJob(item)}>Perform Job</Button>
                    </ListGroupItem>
                ))}
            </ListGroup>
            <PerformJobModal show={modalShow} onHide={() => setModalVisiblity(false)} />
        </Container>
    )
});

export default TweetJobListing;