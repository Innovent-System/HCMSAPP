import {useEffect,useState} from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

function UseSkeleton({ width, s_height, count,...rest }) {
    const [skeleton, setskeleton] = useState([]);
    useEffect(() => {
        for (let index = 0; index < count; index++) {
            skeleton.push(<Skeleton animation="wave" {...rest} height={s_height} width={width} style={{ marginBottom: 6 }} />);
        }
        return () => {
            setskeleton([]);
        }
    }, [width,s_height,count])
    

    return (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>{skeleton}</div>)
}

UseSkeleton.propTypes = {
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    s_height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    count: PropTypes.number.isRequired
}

export default UseSkeleton

