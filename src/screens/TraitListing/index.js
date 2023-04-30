import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ListingCard from '../../components/ListingCard';
import useTraitStore from '../../store/useTraitStore';
import useLoadingStore from '../../store/useLoadingStore';
import ActivityIndicator from '../../components/ActivityIndicator';

const TraitListing = React.memo(() => {
    const traits = useTraitStore((state) => state.traits);
    const loadTraitsLoading = useLoadingStore((state) => state.loadTraits);

    if (loadTraitsLoading) {
        return <ActivityIndicator />
    }

    return (
        <Container fluid>
            <Row>
                {traits.map((item, index) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3}>
                        <ListingCard item={item} />
                    </Col>
                ))}
            </Row>
        </Container>
    )
});

export default TraitListing;