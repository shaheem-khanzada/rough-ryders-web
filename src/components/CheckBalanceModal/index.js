import Modal from 'react-bootstrap/Modal';
import React from 'react';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import useRoughRydersStore from '../../store/useRoughRydersStore';
import Alert from 'react-bootstrap/Alert';

const CheckBalanceModal = React.memo((props) => {
    const balances = useRoughRydersStore((state) => state.balances)
    const isExist = Array.isArray(balances) && balances.length;

    const renderItems = () => {
        if (isExist) {
            return (
                balances.map((balance) => (
                    <Badge key={balance.tokenAddress} pill bg='#ffff' style={{ background: '#f4e8bb', color: '#412828', cursor: 'pointer' }}>
                        {balance.balance} {balance.tokenSymbol}
                    </Badge>
                ))
            )
        } else {
            return (
                <Alert variant='danger' className='mx-auto w-100'>Opps you don't have any fund to withdaw !</Alert>
            )
        }
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className='mx-auto' id="contained-modal-title-vcenter">
                <h5 style={{ fontWeight: 700, color:'#f4e8bb' }}><span style={{ backgroundColor: '#f4e8bb', padding: 5, color: '#412828' }}>Your</span> Balance</h5>

                </Modal.Title>
                
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-center flex-column'>
                <Stack direction="horizontal" className='w-100' style={{ flexWrap: 'wrap' }} gap={2}>
                   {renderItems()}
                </Stack>
                <Button className='theme-btn mt-3'>Withdraw</Button>
            </Modal.Body>
        </Modal>
    );
});
export default CheckBalanceModal

