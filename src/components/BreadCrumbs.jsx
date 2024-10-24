import React from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { Breadcrumbs, Link } from '../deps/ui'



const BreadCrumbsSegments = () => {
    const location = useLocation();
    const { pathname } = location;
    const segments = pathname.split("/");
    return (
        <Breadcrumbs>
            {segments.map((e, index) => <Link
                key={e}
                component={RouterLink}
                to={e}
                variant="body2"
            >
                {e}
            </Link>)}
        </Breadcrumbs>
    )
}

export default BreadCrumbsSegments
