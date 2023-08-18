import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import CreateTraitModal from '../CreateTraitModal';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import useContractStore from "../../store/useContractStore";
import { Link } from 'react-router-dom';

const Header = React.memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { active, account, activate, deactivate } = useWeb3React()
    const isAdmin = useContractStore((state) => state.isAdmin);

    return (
        <Navbar bg="light" expand="lg" style={{ marginBottom: 20 }}>
            <Container fluid>
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <Navbar.Brand>
                        Trait Shop
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <div>
                    <Button onClick={() => active ? deactivate() : activate(injected)} variant="outline-success" style={{ marginRight: 10 }}>
                        {active ? `Disconnect Wallet (${account})` : 'Connect Wallet'}
                    </Button>
                    {isAdmin ? <Button
                        variant="outline-success"
                        onClick={() => setIsOpen(true)}
                    >
                        Create Trait Sell
                    </Button> : null}
                </div>
            </Container>
            <CreateTraitModal
                show={isOpen}
                onHide={() => setIsOpen(false)}
            />
        </Navbar>
    )
});

export default Header;