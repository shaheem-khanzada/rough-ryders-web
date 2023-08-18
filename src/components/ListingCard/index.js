import React from 'react';
import { Button, Card } from 'react-bootstrap';
import useTraitStore from '../../store/useTraitStore';
import { useWeb3React } from '@web3-react/core';
import useContractStore from '../../store/useContractStore';
import useLoadingStore from '../../store/useLoadingStore';
import './ListingCard.css';
import { Link } from 'react-router-dom';

const ListingCard = React.memo(({ item }) => {
    const { account } = useWeb3React();
    const deleteTraitSell = useTraitStore((state) => state.deleteTraitSell);
    const isAdmin = useContractStore((state) => state.isAdmin);
    const deleteTraitLoading = useLoadingStore((state) => state.deleteTrait);

    return (
        <Card style={{ width: '25rem', marginBottom: 10 }}>
            <Card.Body>
                <Card.Img variant="top" src={item?.apeTrait?.femalePreviewImageSrc} />
                <Card.Title style={{ fontSize: 26, fontWeight: 600 }}>{item?.apeTrait?.name}</Card.Title>
                <Card.Text>
                    BAP Apes Traits
                </Card.Text>
                <div className="card-info">
                    <div className="max-quantity">Max Quantity: {item?.maxQuantity}</div>
                    <div className="price">Price: {item?.price} ETH</div>
                </div>
                <Link to={`/detail/${item._id}`} state={{ item }}>
                    <Button variant="primary">
                        View Details
                    </Button>
                </Link>
                {isAdmin ?
                    <Button
                        variant="danger"
                        style={{ marginLeft: 10 }}
                        disabled={deleteTraitLoading}
                        onClick={() => deleteTraitSell(item._id, account)}
                    >
                        {deleteTraitLoading ? 'Deleting...' : 'Delete Trait Sell'}
                    </Button> : null}
            </Card.Body>
        </Card>
    )
});

export default ListingCard;
