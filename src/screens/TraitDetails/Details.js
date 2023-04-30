import React from 'react';
import { FormGroup, FormLabel, FormControl, FormCheck } from 'react-bootstrap';

const Details = React.memo(({ trait, quantity, buyOnChain, setQuantity, setBuyOnChain }) => {
    return (
        <React.Fragment>
            <h2>{trait?.apeTrait?.name}</h2>
            <p>Price: {(trait?.price * Number(quantity)).toFixed(4)} ETH</p>
            <p>Max Quantity: {trait?.maxQuantity}</p>
            <p>Fur Skin: {trait?.apeTrait?.furOrSkin}</p>
            <p>Category Name: {trait?.apeTrait?.categoryName}</p>
            <p>Rarity: {trait?.apeTrait?.rarity}</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FormGroup>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl type="number" max={trait?.maxQuantity} min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormCheck type="checkbox" label="Buy onChain" checked={buyOnChain} onChange={() => setBuyOnChain(!buyOnChain)} />
                </FormGroup>
            </div>
        </React.Fragment>
    )
});

export default Details;