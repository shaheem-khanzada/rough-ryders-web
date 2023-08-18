import React from "react";
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import useTweetApiStore from "../../store/useTweetApiStore";
import { useWeb3React } from "@web3-react/core";
import useLoadingStore from "../../store/useLoadingStore";

const PerformJobModal = React.memo((props) => {
    const { handleSubmit, register } = useForm();
    const performTweetEngagementLoading = useLoadingStore((state) => state.performTweetEngagement);
    const { tweetJob, performTweetEngagement } = useTweetApiStore((state) => ({
        tweetJob: state.tweetJob,
        performTweetEngagement: state.performTweetEngagement
    }));

    const { account } = useWeb3React();

    console.log('performTweetEngagementLoading', performTweetEngagementLoading);


    const onSubmit = async (data) => {
        const payload = {
            ...data,
            engager: account,
            tweetJobId: tweetJob._id
        }
        console.log('payload', payload);
        await performTweetEngagement(payload)
        props?.onHide();
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Perform Job
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <h4>Enter Your Username</h4>
                    <Form.Group controlId="username">
                        <Form.Control placeholder="@elonmusk" type="text" {...register('username', { required: true })} />
                    </Form.Group>
                    <Button className="mt-3" type="submit">{performTweetEngagementLoading ? "Loading..." : "Perform Job"}</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default PerformJobModal;
