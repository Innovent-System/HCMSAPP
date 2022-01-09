import { Button as MuiButton } from "../../deps/ui";

const Styles = {
  root: {
    m: 0.5
  },
  label: {
    textTransform: "none",
  }
}

export default function Button(props) {
  const { text, size, color, variant, onClick, icon:Icon = null,...other } = props;
  
  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "small"}
      color={color || "primary"}
      onClick={onClick}
      {...(Icon && {startIcon:<Icon/>})}
      {...other}
      sx={[Styles.root,Styles.label]}
    >
    
  {text}
    </MuiButton>
  );
}
