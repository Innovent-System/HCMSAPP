import { Button as MuiButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
  },
  label: {
    textTransform: "none",
  },
}));

export default function Button(props) {
  const { text, size, color, variant, onClick, icon:Icon = null,...other } = props;
  const classes = useStyles();

  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "small"}
      color={color || "primary"}
      onClick={onClick}
      {...(Icon && {startIcon:<Icon/>})}
      {...other}
      classes={{ root: classes.root, label: classes.label }}
    >
    
  {text}
    </MuiButton>
  );
}
