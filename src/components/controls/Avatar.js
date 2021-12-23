import { Avatar as MuiAvatar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  medium: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export default function Avatar(props) {
  const { size, color, variant, ...other } = props;
  const classes = useStyles();

  return (
    <MuiAvatar
      variant={variant || "circular"}
      color={color || "primary"}
      {...other}
      classes={{ root: classes.root }}
      className={size && classes[size]}
    />
  );
}
