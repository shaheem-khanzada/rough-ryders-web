import React, { useCallback, useEffect, useState } from "react";
import Select from 'react-select';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Decimal from 'decimal.js';
import useLoadingStore, { LOADINGS } from "../../store/useLoadingStore";
import { normalizeErrorMessage } from "../../utils";
import useContractStore from "../../store/useContractStore";
import { useWeb3React } from "@web3-react/core";
import useTweetApiStore from "../../store/useTweetApiStore";

const DepositModal = React.memo((props) => {
    const { onHide } = props;
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOptions] = useState({});
    const [depositAmount, setDepositAmount] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const { library: web3, account } = useWeb3React();
    const { depositLoading, setDepositLoading } = useLoadingStore((state) => ({ 
        depositLoading: state.deposit,
        setDepositLoading: state.setLoading
     }));
    const { getERC20TokenContractInstance, getTweetRewardSystemContract } = useContractStore((state) => ({
        getERC20TokenContractInstance: state.getERC20TokenContractInstance,
        getTweetRewardSystemContract: state.getTweetRewardSystemContract
    }));
    const { getUserTokenBalance } = useTweetApiStore((state) => ({ getUserTokenBalance: state.getUserTokenBalance }))

    const hasDecimal = (value) => {
        const strValue = String(value);
        const [, decimalPart] = strValue.split('.');
        if (decimalPart === undefined || decimalPart === '000') {
            return value.toFixed(0)
        }
        return value.toFixed(3)
    }

    const fetchTokens = useCallback(async () => {
        setLoading(true)
        const { methods: { getWhiteListedTokens } } = getTweetRewardSystemContract(web3);
        const whitelistedTokens = await getWhiteListedTokens().call();
        const balance = await web3.eth.getBalance(account);
        const balanceInEther = web3.utils.fromWei(balance, 'ether');
        const options = [{ balance: parseFloat(balanceInEther).toFixed(3), symbol: 'ETH' }]

        for (let i = 0; i < whitelistedTokens.length; i++) {
            const token = whitelistedTokens[i];
            const { methods: { decimals, balanceOf, symbol } } = getERC20TokenContractInstance(token, web3);
            const tokenDecimal = Number(await decimals().call())
            const tokenSymbol = await symbol().call();
            const balanceWei = await balanceOf(account).call();
            const balance = parseFloat(balanceWei) / 10 ** tokenDecimal;
            options.push({ balance: hasDecimal(balance), symbol: tokenSymbol, tokenDecimal, address: token })
        }
        setOptions(options.map((token) => ({ value: token.balance, label: `${token.symbol} - ${token.balance}`, ...token })))
        setLoading(false)
    }, [account, getERC20TokenContractInstance, getTweetRewardSystemContract, web3])

    const onSumit = async () => {
        try {
            setDepositLoading(LOADINGS.DEPOSIT, true);
            if (Number(depositAmount) <= 0) {
                return normalizeErrorMessage('Amount must be greater than 0')
            }
            const tweetRewardSystemContract = getTweetRewardSystemContract(web3);

            let dAmount = 0
            if (selectedOption.symbol === 'ETH') {
                dAmount = await handleNativeTokenDepositValidation(tweetRewardSystemContract);
            } else {
                dAmount = await handleERC20TokenDepositValidation(tweetRewardSystemContract);
            }

            console.log('dAmount', dAmount);

            const transaction = await handleFinalTokenDeposit(dAmount, tweetRewardSystemContract);
            console.log('transaction', transaction);
            setTimeout(() => getUserTokenBalance(account), 5000)
            onHide()
        } catch (e) {
            console.log('error', e);
            normalizeErrorMessage(e);
        } finally {
            setDepositLoading(LOADINGS.DEPOSIT, false);
        }
    };

    const handleNativeTokenDepositValidation = async (tweetRewardSystemContract) => {
        const { depositETH } = tweetRewardSystemContract.methods;
        const balance = await web3.eth.getBalance(account);
        const balanceInEther = web3.utils.fromWei(balance, 'ether');
        const price = web3.utils.toWei(depositAmount, 'ether');

        if (depositAmount > parseFloat(balanceInEther)) {
            throw new Error("You don't have enough ETH balance");
        }

        await depositETH().call({
            from: account,
            value: price,
        });
        return price;
    };

    const handleERC20TokenDepositValidation = async (tweetRewardSystemContract) => {
        const { depositERC20 } = tweetRewardSystemContract.methods;

        const { methods: { allowance, balanceOf, decimals, approve } } = await getERC20TokenContractInstance(selectedOption.address, web3);
        const tokenDecimals = Number(await decimals().call());
        const priceInTokens = new Decimal(depositAmount).times(new Decimal(10).pow(tokenDecimals)).toFixed(0);

        const priceBN = web3.utils.toBN(priceInTokens);

        const spenderAddress = process.env.REACT_APP_TWEET_REWARD_SYSTEM_ADDRESS;
        const tokenAllowance = await allowance(account, spenderAddress).call();
     
        const allowanceBN = web3.utils.toBN(tokenAllowance);

        const balance = await balanceOf(account).call();
        const balanceBN = web3.utils.toBN(balance);

        if (!balanceBN.gte(priceBN)) {
            throw new Error("You don't have enough balance")
        }

        if (allowanceBN.lt(priceBN)) {
            await approve(spenderAddress, priceInTokens).send({ from: account });
        }

        const staticPayload = [selectedOption.address, priceInTokens];

        await depositERC20(...staticPayload).call({
            from: account,
        });
        return priceInTokens;
    };

    const handleFinalTokenDeposit = async (tokenPrice, tweetRewardSystemContract) => {
        const { depositETH, depositERC20 } = tweetRewardSystemContract.methods;

        if (selectedOption.symbol === 'ETH') {
            return depositETH().send({ from: account, value: tokenPrice });
        } else {
            return depositERC20(selectedOption.address, tokenPrice).send({ from: account });
        }
    };

    useEffect(() => {
        if (account) {
            fetchTokens()
        }
    }, [account, fetchTokens])

    useEffect(() => {
        if (selectedOption.value) {
            setDepositAmount(selectedOption.value)
        }
    }, [selectedOption])

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Deposit Token
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={() => { }}>
                    <Form.Group className="mb-3 d-flex flex-column" controlId="coinSelect">
                        <Form.Label>Select Token</Form.Label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isLoading={isLoading}
                            isClearable
                            isSearchable
                            name="token-options"
                            onChange={(value) => setSelectedOptions(value)}
                            options={options}
                        />
                    </Form.Group>
                    {selectedOption?.value ? <Form.Group className="mb-3" controlId="rewardPerEngagement">
                        <Form.Label>Total Balance</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            min={0}
                            max={Number(selectedOption?.value)}
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Enter Reward Per Engagement"
                        />
                    </Form.Group> : null}

                    <Button disabled={depositLoading} variant="primary" onClick={onSumit} style={{ marginTop: 15 }}>
                       {depositLoading ? 'Loading...' : 'Deposit'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
});

export default DepositModal;