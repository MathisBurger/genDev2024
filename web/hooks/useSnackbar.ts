import { enqueueSnackbar } from 'notistack';

/**
 * Provides snackbar functionality
 */
const useSnackbar = () => {

    /**
     * Error snackbar
     *
     * @param message Error message
     */
    const error = (message: string) => {
        enqueueSnackbar(message, {variant: 'error'});
    }

    /**
     * success snackbar
     *
     * @param message success message
     */
    const success = (message: string) => {
        enqueueSnackbar(message, {variant: 'success'});
    }

    return {error, success};
}

export default useSnackbar;