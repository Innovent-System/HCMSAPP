import { Button as MuiButton } from "../../deps/ui";
import PropTypes from 'prop-types';

const Styles = {
  root: {
    m: 0.5
  },
  label: {
    textTransform: "none",
  }
}

export default function Button(props) {
  const { text, size, color, variant, onClick, icon:Icon = null,sx={},...other } = props;
  
  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "small"}
      color={color || "primary"}
      onClick={onClick}
      {...(Icon && {startIcon:<Icon/>})}
      {...other}
      sx={[Styles.root,Styles.label,{...sx}]}
    >
    
  {text}
    </MuiButton>
  );
}

Button.propTypes = {
  text:PropTypes.string,
  onClick:PropTypes.func.isRequired,
  color:PropTypes.string,
  icon:PropTypes.any,
  variant:PropTypes.string,
  size:PropTypes.string,
  sx:PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.arrayOf(
      PropTypes.func,
      PropTypes.object,
      PropTypes.bool
    )
  ])
}