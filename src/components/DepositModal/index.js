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
import { CloseButton } from "react-bootstrap";
import useRoughRydersStore from "../../store/useRoughRydersStore";

const colourStyles = {
    control: (base, state) => ({
        ...base,
        background: "#f4e8bb",
        // match with the menu

        // Overwrittes the different states of border
        borderColor: state.isFocused ? "#f4e8bb" : "green",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            // Overwrittes the different states of border
            borderColor: state.isFocused ? "#f4e8bb" : "f4e8bb"
        }
    }),
    menuList: styles => ({
        ...styles,
        background: '#412828'
    }),
    option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        background: isFocused
            ? '#ccc197'
            : isSelected
                ? '#f4e8bb'
                : '#f4e8bb',
        zIndex: 1
    }),
    menu: base => ({
        ...base,
        zIndex: 100,
        background: 'black'
    })
}

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
    const { getERC20TokenContractInstance, getRoughRydersContract } = useContractStore((state) => ({
        getERC20TokenContractInstance: state.getERC20TokenContractInstance,
        getRoughRydersContract: state.getRoughRydersContract
    }));
    const rewardTokens = useRoughRydersStore((state) => state.rewardTokens)

    const hasDecimal = (value) => {
        const strValue = String(value);
        const [, decimalPart] = strValue.split('.');
        if (decimalPart === undefined || decimalPart === '000') {
            return value.toFixed(0)
        }
        return value.toFixed(3)
    }

    const fetchTokens = useCallback(async () => {
        try {
            setLoading(true)
            const options = []

            for (let i = 0; i < rewardTokens.length; i++) {
                const token = rewardTokens[i];
                const { methods: { balanceOf } } = getERC20TokenContractInstance(token.address, web3);
                const balanceWei = await balanceOf(account).call();
                const balance = parseFloat(balanceWei) / 10 ** token.decimal;
                options.push({
                    balance: hasDecimal(balance),
                    symbol: token.symbol,
                    tokenDecimal: token.decimal,
                    address: token.address,
                    ...token
                })
            }
            setOptions(options.map((token) => ({ value: token.balance, label: `${token.symbol} - ${token.balance}`, ...token })))
            setLoading(false)
        } catch (e) {
          console.log('error fetchTokens', e);
        }
    }, [account, getERC20TokenContractInstance, rewardTokens, web3])

    const onSumit = async () => {
        try {
            setDepositLoading(LOADINGS.DEPOSIT, true);
            if (Number(depositAmount) <= 0) {
                return normalizeErrorMessage('Amount must be greater than 0')
            }
            const tweetRewardSystemContract = getRoughRydersContract(web3);

            let dAmount = await handleERC20TokenDepositValidation(tweetRewardSystemContract);

            const transaction = await handleFinalTokenDeposit(dAmount, tweetRewardSystemContract);
            console.log('transaction', transaction);
            onHide()
        } catch (e) {
            console.log('error', e);
            normalizeErrorMessage(e);
        } finally {
            setDepositLoading(LOADINGS.DEPOSIT, false);
        }
    };

    const handleERC20TokenDepositValidation = async () => {
        const { methods: { allowance, balanceOf, approve } } = await getERC20TokenContractInstance(selectedOption.address, web3);
        const tokenDecimals = selectedOption.tokenDecimal;
        const priceInTokens = new Decimal(depositAmount).times(new Decimal(10).pow(tokenDecimals)).toFixed(0);

        const priceBN = web3.utils.toBN(priceInTokens);

        const spenderAddress = process.env.REACT_APP_ROUGH_RYDERS_ADDRESS;

        const tokenAllowance = await allowance(account, spenderAddress).call();

        const allowanceBN = web3.utils.toBN(tokenAllowance);
        const balance = await balanceOf(account).call();
        const balanceBN = web3.utils.toBN(balance);

        if (!balanceBN.gte(priceBN)) {
            throw new Error("You don't have enough balance")
        }


        if (allowanceBN.lt(priceBN)) {
            console.log('running')
            if (selectedOption.symbol === 'USDT' && !allowanceBN.isZero()) {
                await approve(spenderAddress, 0).send({ from: account });
            }
            await approve(spenderAddress, priceInTokens).send({ from: account });
        }

        const staticPayload = [selectedOption.address, priceInTokens];
        console.log('staticPayload', staticPayload)

        // await depositERC20(...staticPayload).call({
        //     from: account,
        // });
        return priceInTokens;
    };

    const handleFinalTokenDeposit = async (tokenPrice, tweetRewardSystemContract) => {
        const { depositERC20 } = tweetRewardSystemContract.methods;
        return depositERC20(selectedOption.address, tokenPrice).send({ from: account });
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
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal-deposit"
        >
            <Modal.Header>
                <Modal.Title id="example-modal-sizes-title-lg" className='mx-auto'>
                    <h5 style={{ fontWeight: 700, color: '#f4e8bb' }}><span style={{ backgroundColor: '#f4e8bb', padding: 5, color: '#412828' }}>Deposit</span> Token</h5>
                </Modal.Title>
                <CloseButton onClick={onHide} variant='white' />
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={() => { }}>
                    <Form.Group className="mb-3 d-flex flex-column" controlId="coinSelect">
                        <Form.Label>Select Token</Form.Label>
                        <Select
                            className="basic-single text-black"
                            classNamePrefix="select"
                            styles={colourStyles}
                            isLoading={isLoading}
                            isClearable
                            isSearchable
                            name="token-options"
                            onChange={(value) => setSelectedOptions(value)}
                            options={options}
                        />
                    </Form.Group>
                    {selectedOption?.value ? <Form.Group className="mb-3" controlId="rewardPerEngagement">
                        <Form.Label>Deposit Amount</Form.Label>
                        <Form.Control
                            type="number"
                            step="any"
                            min={0}
                            max={Number(selectedOption?.value)}
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="Enter Reward Per Engagement"
                            style={{ backgroundColor: '#f4e8bb', color: '#412828' }}
                        />
                    </Form.Group> : null}


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={depositLoading} className="mx-auto theme-btn" variant="warning" onClick={onSumit} >
                    {depositLoading ? 'Loading...' : 'Deposit Now'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
});

export default DepositModal;