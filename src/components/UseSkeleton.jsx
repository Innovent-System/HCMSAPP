import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

function UseSkeleton({ width, heigth, count,...rest }) {
    const skeletionSets = [];
    for (let index = 0; index < count; index++) {
        skeletionSets.push(<Skeleton animation="wave" {...rest} height={heigth} width={width} style={{ marginBottom: 6 }} />);
    }

    return (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>{skeletionSets}</div>)
}

UseSkeleton.propTypes = {
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    heigth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    count: PropTypes.number.isRequired
}

export default UseSkeleton

