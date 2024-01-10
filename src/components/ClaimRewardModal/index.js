import Modal from 'react-bootstrap/Modal';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, CloseButton, Spinner } from 'react-bootstrap';
import useRoughRydersStore from '../../store/useRoughRydersStore';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useWeb3React } from '@web3-react/core';
import useLoadingStore from '../../store/useLoadingStore';

const ClaimRewardModal = React.memo(({ nft, show, onHide }) => {
    const { account } = useWeb3React()
    const [calculatedRewardAmount, setAmount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [rewardToken, setRewardToken] = useState(null);
    const { loading, claimNftRewardLoading } = useLoadingStore((state) => ({
        loading: state.calculateRewards,
        claimNftRewardLoading: state.claimNftReward
    }));
    const calculateNftReward = useRoughRydersStore((state => state.calculateNftReward));
    const rewardTokens = useRoughRydersStore((state => state.rewardTokens));
    const claimNftReward = useRoughRydersStore((state => state.claimNftReward));

    const claimReward = async () => {
        try {
            const payload = { nftId: nft._id, rewardTokenId: rewardToken._id, wallet: account };
            await claimNftReward(payload, onHide);
        } catch {}
    }

    const calculateAmount = useCallback(async () => {
        try {
            const { amount } = await calculateNftReward({
                nftId: nft._id,
                rewardTokenId: rewardToken._id
            });
            setAmount(amount);
            setErrorMessage(null);
        } catch (e) {
            console.log('calculateAmount error throw', e.response.data.error);
            setErrorMessage(e.response.data.error);
            setAmount(null);
        }
    }, [calculateNftReward, nft._id, rewardToken])

    useEffect(() => {
        if (rewardToken && rewardToken?._id) {
            const payload = { nftId: nft._id, rewardTokenId: rewardToken._id };
            calculateAmount(payload);
        }
    }, [calculateAmount, calculateNftReward, nft._id, rewardToken])

    useEffect(() => {
        if (rewardTokens && rewardTokens?.length) {
            const methToken = rewardTokens.find((token) => token.symbol === 'METH');
            methToken && setRewardToken(methToken);
        }
    }, [rewardTokens])

    return (
        <Modal
            size="lg"
            show={show}
            onHide={onHide}
            centered
            aria-labelledby="example-modal-sizes-title-lg"
            className='shadow-lg modal-'
        >
            <Modal.Header>
                <Modal.Title id="example-modal-sizes-title-lg" className='mx-auto'>
                    <h5 style={{ fontWeight: 700, color: '#f4e8bb' }}><span style={{ backgroundColor: '#f4e8bb', padding: 5, color: '#412828' }}>Ryders</span> Reward</h5>

                </Modal.Title>
                <CloseButton onClick={onHide} variant='white' />
            </Modal.Header>
            <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <h5 className='text-center mb-3'>Select one of these coin to get reward</h5>
                <ButtonGroup style={{ display: 'flex' }}>
                    {rewardTokens.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={idx % 2 ? 'outline-warning' : 'outline-warning'}
                            name="radio"
                            value={radio._id}
                            checked={rewardToken?._id === radio._id}
                            onChange={() => setRewardToken(rewardTokens[idx])}
                            style={{
                                borderColor: '#f4e8bb',
                                color: rewardToken?._id === radio._id ? '#412828' : '#f4e8bb',
                                backgroundColor: rewardToken?._id === radio._id ? '#f4e8bb' : 'transparent',
                            }}
                        >
                            {radio.symbol}
                        </ToggleButton>
                    ))}
                </ButtonGroup>

                <div>
                    {loading && (
                        <Spinner animation="border" role="status" className="mt-4 mx-auto d-flex flex-column align-items-center">
                            <span className="sr-only"></span>
                        </Spinner>
                    )}

                    {calculatedRewardAmount && !loading && (
                        <h2 className="mt-4 d-flex justify-content-center">Reward Amount: {calculatedRewardAmount} {rewardToken.symbol}</h2>
                    )}
                    {errorMessage && !loading && (
                        <div className="text-danger mt-2 text-center">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex flex-column'>
                <Button
                    disabled={errorMessage || loading}
                    className='mx-auto theme-btn'
                    variant="warning"
                    onClick={claimReward}
                >
                    {claimNftRewardLoading ? "Loading..." : "Claim Now"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});
export default ClaimRewardModal

