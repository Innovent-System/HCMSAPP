import { Avatar as MuiAvatar } from "../../deps/ui";

const Styles = {
  root: {
    m: 0.5,
  },
  small: {
    width: 30,
    height: 30
  },
  medium: {
    width: 50,
    height: 50
  },
  large: {
    width: 100,
    height: 100
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
