import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CreateTweetJobModal from '../CreateTweetJobModal';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import { Link, useNavigate } from 'react-router-dom';

const Header = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { active, account, activate, deactivate } = useWeb3React()

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
                        onClick={() => navigate('/withdraw')}
                    >
                        Withdraw
                    </Button>
                </div>
            </Container>
            <CreateTweetJobModal
                show={isOpen}
                onHide={() => setIsOpen(false)}
            />
        </Navbar>
    )
});

export default Header;