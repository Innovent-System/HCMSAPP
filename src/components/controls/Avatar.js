import { Avatar as MuiAvatar } from "../../deps/ui";

const Styles = {
  root: {
    m: 0.5,
  },
  small: {
    w: 4,
    h: 4,
  },
  medium: {
    w: 8,
    h: 8,
  },
  large: {
    w: 12,
    h: 12,
  }
};

export default function Avatar(props) {
  const { size = "large", color, variant, ...other } = props;

  return (
    <MuiAvatar
      variant={variant || "circular"}
      color={color || "primary"}
      {...other}
      sx={[
        Styles.root,
        (size && Styles[size])
      ]}   
     />
  );
}
