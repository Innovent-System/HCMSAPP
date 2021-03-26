import React, { createContext } from 'react';
import { blueGrey } from '@material-ui/core/colors'

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
  const layout = {
    primaryColor: '#f3f2f7',
    fontColor: 'black',
    headerbgColor : blueGrey[900]
  };

  return (
    <ThemeContext.Provider value={{ ...layout }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
