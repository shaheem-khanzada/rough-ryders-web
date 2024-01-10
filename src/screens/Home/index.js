import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Card.css';
import useRoughRydersStore from '../../store/useRoughRydersStore';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import { useState } from 'react';
import ClaimRewardModal from '../../components/ClaimRewardModal';
import useLoadingStore from '../../store/useLoadingStore';
import ActivityIndicator from '../../components/ActivityIndicator';

const Item = ({ nft }) => {
    const { timeDifference, timerEnded } = useCountdownTimer(nft.startDate);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="Card shadow-xl">
            <div className="banner" >
                <h4 className="caption mt-1 mb-1" style={{ position: 'absolute', color: '#f4e8bb', display: 'flex', justifyContent: 'center', top: 20 }}>{nft.metadata.name || nft.metadata.id}</h4>
                <img src={`${nft.metadata.image}`} style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }} alt="" className="equi" />
            </div>
            <div className="timer-bg mb-4">
                <div className='timer'>
                    {timeDifference}
                </div>
            </div>
            <div className='p-3'>
                <div>
                    <div className="description">
                        <h5 style={{ fontWeight: 700 }}><span style={{ backgroundColor: '#412828', padding: 5, color: '#f4e8bb' }}>Eligibility</span>  Criteria</h5>
                        <p style={{ textAlign: 'center', fontSize: 15, marginTop: 20 }}>
                            1. Keep the NFT in your account for a minimum period of 30 days.
                        </p>
                        <p style={{ textAlign: 'center', fontSize: 15 }} >
                            2. Don't list NFT on any other platform during initial 30-day to get reward
                        </p>

                    </div>
                </div>
                <div className='action-buttons mx-auto'>
                    <Button className='theme-btn-card' disabled={!timerEnded} onClick={() => setIsModalOpen(true)} >
                        Claim Reward
                    </Button>
                    <ClaimRewardModal
                        nft={nft}
                        show={isModalOpen}
                        onHide={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
        </div>
    )
}


const Home = React.memo(() => {
    const { nfts } = useRoughRydersStore();
    const loading = useLoadingStore((state) => state.loadNftList)

    const renderItems = () => {
        if (loading) {
            return (
                <ActivityIndicator />
            )
        }
        else if (Array.isArray(nfts) && nfts.length) {
            return (
                nfts.map((item, key) => (
                    <Col key={key} xs={12} sm={12} md={6} lg={6} xl={4}>
                        <Item nft={item} />
                    </Col>
                ))
            )
        } else {
            return (
                <span style={{
                    color: '#f4e8bb',
                    fontSize: 22,
                    fontWeight: 400,
                }}
                >
                    Oops! It seems that there are no NFTs found in your wallet at the moment
                </span>
            )
        }
    }
    return (
        <Container fluid className='container-fluid'>
            <Row>
                {renderItems()}
            </Row>
        </Container>
    )
});

export default Home; 