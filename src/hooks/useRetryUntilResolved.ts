import React from 'react';
import useInterval from './useInterval';
function useRetryUntilResolved(callback, interval = 1000) {
    const [hasResolved, setHasResolved] = React.useState(false);
    useInterval(
        () => {
            const result = callback();
            if (result) {
                setHasResolved(true);
            }
        },
        hasResolved ? null : interval,
    );
    return hasResolved;
}
export default useRetryUntilResolved;
