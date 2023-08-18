import { toast } from 'react-toastify';

const normalizeErrorMessage = (error, customMessage) => {
    const message =  error?.response?.data?.error || error?.response?.data?.message
    if (message && typeof message === 'string') {
        toast.error(message);
    } else if (error?.message) {
        toast.error(error?.message);
    } else if (customMessage) {
        toast.error(customMessage);
    } else if (Array.isArray(message)) {
        toast.error(message[0])
    } else if (typeof message === 'string') {
        toast.error(message);
    } else if (error.message) {
        toast.error(error.message);
    } else {
        toast.error('Something went wrong.');
    }
}

export { normalizeErrorMessage };