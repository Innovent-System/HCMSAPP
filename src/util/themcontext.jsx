import React, { createContext } from 'react';
//import { blueGrey } from '../deps/ui/colorschema'

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
  const layout = {
    primaryColor: '#006884',
    secondaryColor: '#053D57',
    fontColor: '#000000',
  };

  return (
    <ThemeContext.Provider value={{ ...layout }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
