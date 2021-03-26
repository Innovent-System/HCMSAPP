import { Avatar as MuiAvatar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
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
      className={classes.large}
    />
  );
}
