import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import Decimal from 'decimal.js';
import { Apis } from '../../Apis';
import useTraitStore from '../../store/useTraitStore';
import { useLocation, useParams } from 'react-router-dom';
import useContractStore from '../../store/useContractStore';
import { normalizeErrorMessage } from '../../utils';
import useLoadingStore, { LOADINGS } from '../../store/useLoadingStore';
import ActivityIndicator from '../../components/ActivityIndicator';
import Details from './Details';

const TraitDetails = React.memo(() => {
    const [quantity, setQuantity] = useState(1);
    const [buyOnChain, setBuyOnChain] = useState(true);
    const { state: locationState } = useLocation()

    const { id } = useParams();
    const { library, account } = useWeb3React();

    const traitShopContract = useContractStore((state) => state.traitShopContract);
    const getERC20TokenContractInstance = useContractStore((state) => state.getERC20TokenContractInstance);

    const { trait, fetchSingleSellTraits, signMessage } = useTraitStore((state) => ({
        trait: locationState?.item || state.trait,
        fetchSingleSellTraits: state.fetchSingleSellTraits,
        signMessage: state.signMessage
    }));

    const { fetchDetailsLoading, setLoading, buyTraitWithETHLoading, buyTraitWithERC20Loading } = useLoadingStore((state) => ({
        fetchDetailsLoading: state.loadDetails,
        setLoading: state.setLoading,
        buyTraitWithERC20Loading: state.buyTraitWithERC20,
        buyTraitWithETHLoading: state.buyTraitWithETH,
    }));

    useEffect(() => {
        if (id && !locationState?.item) {
            fetchSingleSellTraits(id);
        }
    }, [fetchSingleSellTraits, id, locationState?.item]);

    async function buyTraitWithETH() {
        try {
            setLoading(LOADINGS.BUY_TRAIT_WITH_ETH, true);

            const totalPrice = (trait.price * quantity).toString();
            const price = library.utils.toWei(totalPrice, 'ether');

            const amountToBuy = quantity;

            const payload = {
                traitId: trait.tokenId,
                sponsorAddress: trait.sponsor,
                commissionPercentage: trait.commission,
                quantity: amountToBuy,
                price: price,
                signerAddress: account,
                type: 'buyTraitWithETH'
            }

            const { data: { signature } } = await signMessage(payload);

            const txPayload = [
                trait.tokenId, 
                trait.sponsor, 
                amountToBuy, 
                price, 
                trait.commission, 
                buyOnChain, 
                signature
            ];

            // static call to check for errors
            await traitShopContract.methods.buyTraitWithETH(...txPayload).call({
                from: account,
                value: price,
            });

            const tx = await traitShopContract.methods.buyTraitWithETH(...txPayload).send({
                from: account,
                value: price,
            });

            if (!buyOnChain && tx.transactionHash) {
                await Apis.saveBuyOffChainTraitResult({
                    tokenId: trait.tokenId,
                    owner: account,
                    quantity: quantity
                });
            };

            toast.success(`You Purchased ${quantity} NFT with tokenID ${trait.tokenId} ${buyOnChain ? 'on chain' : 'off chain'}`);
            console.log('Transaction hash:', tx.transactionHash);
        } catch (error) {
            normalizeErrorMessage(error);
        } finally {
            setLoading(LOADINGS.BUY_TRAIT_WITH_ETH, false);
        }
    }

    const buyTraitWithERC20 = async (erc20TokenAddress = process.env.REACT_APP_METH_ADDRESS) => {
        try {
            setLoading(LOADINGS.BUY_TRAIT_WITH_ERC20, true);
            const erc20TokenContract = await getERC20TokenContractInstance(erc20TokenAddress, library);

            const priceInEth = trait.price * quantity;

            const tokenDecimals = Number(await erc20TokenContract.methods.decimals().call());

            const priceInTokens = new Decimal(priceInEth).times(new Decimal(10).pow(tokenDecimals)).toFixed(0);
            const priceBN = library.utils.toBN(priceInTokens);

            const spenderAddress = process.env.REACT_APP_TRAIT_SHOP_ADDRESS;
            const allowance = await erc20TokenContract.methods.allowance(account, spenderAddress).call();
            const allowanceBN = library.utils.toBN(allowance);

            const balance = await erc20TokenContract.methods.balanceOf(account).call();
            const balanceBN = library.utils.toBN(balance);

            const isTokenWhitelisted = await traitShopContract.methods.isTokenWhitelisted(erc20TokenAddress).call();

            if (!isTokenWhitelisted) {
                throw Error({ message: `Token Address ${erc20TokenAddress} is not whitelisted` });
            }

            if (!balanceBN.gte(priceBN)) {
                throw Error({ message: "You don't have enough balance" })
            }

            const signPayload = {
                traitId: trait.tokenId,
                sponsorAddress: trait.sponsor,
                commissionPercentage: trait.commission,
                quantity: quantity,
                price: priceInTokens,
                erc20TokenAddress: erc20TokenAddress,
                signerAddress: account,
                type: 'buyTraitWithERC20'
            };

            const { data: { signature } } = await signMessage(signPayload);

            if (!allowanceBN.gte(priceBN)) {
                const approveTx = await erc20TokenContract.methods.approve(
                    process.env.REACT_APP_TRAIT_SHOP_ADDRESS,
                    priceInTokens
                ).send({
                    from: account
                });
                console.log('approveTx', approveTx);
            }

            const txPayload = [
                trait.tokenId,
                trait.sponsor,
                quantity,
                priceInTokens,
                erc20TokenAddress,
                trait.commission,
                buyOnChain,
                signature
            ]

            // static call to check for errors
            await traitShopContract.methods.buyTraitWithERC20(...txPayload).call({
                from: account,
            });

            const buyTraitTx = await traitShopContract.methods.buyTraitWithERC20(...txPayload).call({
                from: account,
            });

            if (!buyOnChain && buyTraitTx.transactionHash) {
                await Apis.saveBuyOffChainTraitResult({
                    tokenId: trait.tokenId,
                    owner: account,
                    quantity: quantity
                });
            }
            toast.success(`You Purchased ${quantity} NFT with tokenID ${trait.tokenId} ${buyOnChain ? 'on chain' : 'off chain'}`);
            console.log('Transaction hash:', buyTraitTx.transactionHash);

        } catch (error) {
            normalizeErrorMessage(error);
        } finally {
            setLoading(LOADINGS.BUY_TRAIT_WITH_ERC20, false);
        }
    }

    if (fetchDetailsLoading) {
        return <ActivityIndicator />;
    }

    if (!Object.keys(trait || {}).length) {
        return null;
    }

    return (
        <Container fluid>
            <Row>
                <Col md={7}>
                    <Image src={trait?.apeTrait?.femalePreviewImageSrc} fluid style={{ borderRadius: '20px' }} />
                </Col>
                <Col md={5}>
                    <Details
                        trait={trait}
                        quantity={quantity}
                        buyOnChain={buyOnChain}
                        setQuantity={setQuantity}
                        setBuyOnChain={setBuyOnChain}
                    />
                    <Button
                        variant="primary"
                        disabled={buyTraitWithERC20Loading || buyTraitWithETHLoading}
                        onClick={buyTraitWithETH}
                    >
                        {buyTraitWithETHLoading ? 'Processing...' : 'Buy With ETH'}
                    </Button>{' '}
                    <Button
                        variant="secondary"
                        disabled={buyTraitWithERC20Loading || buyTraitWithETHLoading}
                        onClick={() => buyTraitWithERC20()}
                    >
                        {buyTraitWithERC20Loading ? 'Processing...' : 'Buy With Meth'}
                    </Button>
                </Col>
            </Row>
        </Container>
    )
});

export default TraitDetails;