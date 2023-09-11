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
    const { account, library: web3 } = useWeb3React();
    const performTweetEngagementLoading = useLoadingStore((state) => state.performTweetEngagement);
    const { tweetJob, performTweetEngagement, getUserRewards } = useTweetApiStore((state) => ({
        tweetJob: state.tweetJob,
        getUserRewards: state.getUserRewards,
        performTweetEngagement: state.performTweetEngagement
    }));

    const onSubmit = async (data) => {
        const message = "I'am performing engagement job"
        const signature = await web3.eth.personal.sign(message, account, '');
        const payload = {
            ...data,
            engager: account,
            tweetJobId: tweetJob._id,
            signature
        }
        await performTweetEngagement(payload)
        await getUserRewards(account)
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
