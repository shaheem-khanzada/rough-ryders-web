import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import useTraitStore from '../../store/useTraitStore';
import useLoadingStore from '../../store/useLoadingStore';
import TagsInput from '../TagsInput';

const CreateTraitModal = (props) => {
  const [whitelisted, setWhitelisted] = useState([]);
  const { onHide } = props;
  const createSellTrait = useTraitStore((state) => state.createSellTrait);
  const createTraitLoading = useLoadingStore((state) => state.createTrait);

  console.log('whitelisted', whitelisted);
  
  const onSumit = (event) => {
    event.preventDefault();
    const { maxQuantity, tokenId, price, commission, sponsor, expireDate } = event.target;

    const payload = {
      maxQuantity: parseInt(maxQuantity?.value),
      tokenId: parseInt(tokenId?.value),
      price: parseFloat(price?.value),
      commission: parseInt(commission?.value),
      sponsor: sponsor?.value || '0x7C8F6808778bA76841d3700Cada31206c438f49D',
      whitelisted: whitelisted,
      expireDate: new Date(expireDate?.value),
    }
    console.log('payload', payload);
    createSellTrait(payload, onHide);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Trait For Sell
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSumit}>
          <Form.Group className="mb-3" controlId="maxQuantity">
            <Form.Label>Max Quantity</Form.Label>
            <Form.Control type="number" placeholder="Enter Max Quantity" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="tokenId">
            <Form.Label>Token ID</Form.Label>
            <Form.Control type="number" placeholder="Enter Token ID" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>ETH Price</Form.Label>
            <Form.Control type="number" placeholder="Enter Price" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="commission">
            <Form.Label>Commission</Form.Label>
            <Form.Control type="number" placeholder="Enter Commission" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="sponsor">
            <Form.Label>Sponsor Address</Form.Label>
            <Form.Control type="text" placeholder="Enter Sponsor Address" />
          </Form.Group>
          <TagsInput
              placeholder={'Enter Whitelisted Address'}
              label={'Whitelisted Addressess'}
              tags={whitelisted}
              setTags={setWhitelisted}
           />
          <Form.Group controlId="expireDate">
            <Form.Label>Expire Date</Form.Label>
            <Form.Control type="date" placeholder="Expire date" />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginTop: 15 }}>
            {createTraitLoading ? 'Creating...' : 'Create'}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateTraitModal;