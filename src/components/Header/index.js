import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CreateTweetJobModal from '../CreateTweetJobModal';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import { Link } from 'react-router-dom';
import DepositModal from '../DepositModal';
import axios from 'axios';

const Header = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { active, account, activate, deactivate, library: web3 } = useWeb3React()

    return (
        <Navbar bg="light" expand="lg" style={{ marginBottom: 20 }}>
            <Container fluid>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Navbar.Brand>
                        Tweet Reward System
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <div>
                    <Button onClick={() => {
                        axios.get(`${process.env.REACT_APP_BASE_URL}/user/me`, { withCredentials: true })
                    }}>get user</Button>
                    <Button onClick={async () => {
                        const message = "I am accessing my account securely using my wallet for authentication.";
                        const privatekey = 'c88fb0fc0804ec1a42bea2157a8171875aaed6c87dabd4f941e8424ea79b3fb0'
                        const { signature } = await web3.eth.accounts.sign(message, privatekey);

                        // const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/wallet?address=${account}&signature=${signature}`, { withCredentials: true })
                        // console.log('response', response);
                        window.open(`${process.env.REACT_APP_BASE_URL}/auth/wallet?address=${account}&signature=${signature}`, '_self')
                    }}>
                        Login With Wallet connect
                    </Button>
                    <Button onClick={async () => {
                        const message = `I am linking my account securely`;
                        const privatekey = 'c88fb0fc0804ec1a42bea2157a8171875aaed6c87dabd4f941e8424ea79b3fb0'
                        const { signature } = await web3.eth.accounts.sign(message, privatekey);

                        // const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/wallet?address=${account}&signature=${signature}`, { withCredentials: true })
                        // console.log('response', response);
                        window.open(`${process.env.REACT_APP_BASE_URL}/link/wallet?address=${account}&signature=${signature}`, '_self')
                    }}>
                        Link With Wallet connect
                    </Button>
                    <Button onClick={() => {
                        window.open(`${process.env.REACT_APP_BASE_URL}/auth/google`, '_self')
                    }}>
                        Login With Google
                    </Button>
                    <Button onClick={() => {
                        window.open(`${process.env.REACT_APP_BASE_URL}/auth/twitter`, '_self')
                    }}>
                        Login With twitter
                    </Button>
                    <Button onClick={() => {
                        window.open(`${process.env.REACT_APP_BASE_URL}/link/twitter`, '_self')
                    }}>
                        Link With twitter
                    </Button>
                    <Button onClick={() => {
                        window.open(`${process.env.REACT_APP_BASE_URL}/link/google`, '_self')
                    }}>
                        Link With Google
                    </Button>
                    <Button onClick={() => active ? deactivate() : activate(injected)} variant="outline-success" style={{ marginRight: 10 }}>
                        {active ? `Disconnect Wallet (${account})` : 'Connect Wallet'}
                    </Button>
                    <Button
                        variant="outline-success"
                        onClick={() => setIsOpen(true)}
                    >
                        Create Tweet Engagement Job
                    </Button>
                    <Button
                        variant="outline-success"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Deposit
                    </Button>
                </div>
            </Container>
            <DepositModal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
            />
            <CreateTweetJobModal
                show={isOpen}
                onHide={() => setIsOpen(false)}
            />
        </Navbar>
    )
});

export default Header;