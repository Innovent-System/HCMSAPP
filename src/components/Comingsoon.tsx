import React from 'react'
import { Grid, Container, Card, CardMedia,CardHeader } from '../deps/ui'
import soonSvg from '../assets/images/comingsoon.png'

const Comingsoon = () => {
    return (

        <Container fixed sx={{ textAlign: '-webkit-center'}}>
            <Card elevation={0} sx={{ maxWidth: 800 }}>
                <CardMedia
                    sx={{ height: 500 }}

                    image={soonSvg}
                    title="green iguana"
                />
                <CardHeader title="Coming Soon"/>
            </Card>
        </Container>
    )
}

export default Comingsoon