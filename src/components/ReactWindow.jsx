import React from "react";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ListSubheader } from "../deps/ui";
import { List } from "react-window";

const LISTBOX_PADDING = 8;

const OuterElementContext = React.createContext({});

const OuterElementType = ({ ref, ...props }) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
};


function RowComponent({ index, style, data }) {
  const item = data[index];

  if (!item) return null;

  return React.cloneElement(item, {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
    },
  });
}

const ListboxComponent = ({ ref, children, ...other }) => {

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });

  const itemData = React.Children.toArray(children);
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }
    return itemSize;
  };

  const height =
    itemData.length > 8
      ? 8 * itemSize
      : itemData.map(getChildSize).reduce((a, b) => a + b, 0);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <List

          rowCount={itemData.length}
          rowHeight={(index) => getChildSize(itemData[index])}
          rowComponent={RowComponent}
          rowProps={{ data: itemData }}
          height={height + 2 * LISTBOX_PADDING}
          width="100%"
          overscanCount={5}
          tagName={OuterElementType}
        />
      </OuterElementContext.Provider>
    </div>
  );
};

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

export default ListboxComponent;
