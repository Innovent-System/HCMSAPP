import React from 'react';
import { CircularProgress, Backdrop, Avatar } from '../deps/ui';
import loaderImg from '../assets/images/logo-loader.png'


export default function CircularLoading({ open = false }) {

  return (
    <div>
      <Backdrop
        sx={{ backgroundColor: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      // onClick={handleClose}
      >
        <Avatar src={loaderImg} sx={{ height: 128, width: 128 }} />
        <CircularProgress thickness={1} sx={{ position: 'absolute' }} size={140} color="primary" />
      </Backdrop>
    </div>
  );
}
