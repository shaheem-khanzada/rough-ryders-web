import React, { useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Image } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import { Link } from 'react-router-dom';
import DepositModal from '../DepositModal';
import CheckBalanceModal from '../CheckBalanceModal'


const Header = React.memo(() => {
    const { active, account, activate, deactivate } = useWeb3React()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);


    const shortenWalletAddress = useMemo(() => {
        if (account) {
            return `${account.substring(0, 4)}...${account.slice(-4)}`;
        }
        return ''
    }, [account])


    return (
        <Navbar bg="transparent" expand="lg" style={{ marginBottom: 100 }}>
            <Container fluid>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Navbar.Brand className='text-white' style={{ fontWeight: 700, fontSize: 25 }}>
                        <Image src="./images/rough_ryders_icon.png" alt="Your Logo" style={{ height: 100 }} />
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <div className='d-flex'>

                    <Button onClick={() => active ? deactivate() : activate(injected)} className='theme-btn' variant="outline-warning" style={{ marginRight: 10 }}>
                        {active ? `Disconnect Wallet (${shortenWalletAddress})` : 'Connect Wallet'}
                    </Button>
                    {active ? <Button onClick={() => setIsModalOpen(true)} variant="outline-warning" className='theme-btn' style={{ marginRight: 10 }}>
                        Deposit
                    </Button> : null}
                    <DepositModal
                        show={isModalOpen}
                        onHide={() => setIsModalOpen(false)}
                    />
                    {active ? <Button variant="primary" className='theme-btn' onClick={() => setModalShow(true)}>
                        Balance
                    </Button> : null}
                    <CheckBalanceModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />

                </div>
            </Container>
        </Navbar>

    )
});

export default Header;