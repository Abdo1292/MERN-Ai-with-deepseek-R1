import { Link } from "react-router-dom";

type Props = {
    to: string,
    bg: string,
    text: string,
    textColor: string,
    onClick?: () => Promise<void>;
}

const NavigationLink = (props: Props) => {
  return (
<Link 
  to={props.to}

  style={
    {
      background: props.bg, 
      color: props.textColor,
      display: "inline-block",
      borderRadius: "10px",
      textDecoration: "none",
      margin: "5px",
      height: "25px",
      width: "100px",
      textAlign: "center",
      padding: "3px",
      fontWeight: "semibold",
      
    }
    }
  onClick={(e) => {
    if (props.onClick) {
      e.preventDefault(); // stop navigation
      props.onClick().then(() => {
        // navigate after logout completes
        window.location.href = props.to; 
        // or use navigate("/") if using useNavigate
      });
    }
  }}
>
  {props.text}
</Link>

  )
}

export default NavigationLink
