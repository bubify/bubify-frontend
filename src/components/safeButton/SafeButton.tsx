import { Button, PropTypes } from "@material-ui/core";
import React from "react";
import { callOnce } from "../../utils/callOnce";

interface Props {
  onClick: any;
  children: React.ReactNode;
  color?: PropTypes.Color;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  autoFocus?: boolean;
  style?: React.CSSProperties
}

const SafeButton = React.forwardRef((props: Props, ref) => {
  const callFnOnce = React.useRef(callOnce(props.onClick));
  const [d, setD] = React.useState(false);

  const handler = () => {
    const handler = callFnOnce.current.call();
    // @ts-ignore
    if (handler && Promise.resolve(handler)) {
      setD(true);
      return handler
        .then(() => {
          callFnOnce.current.reset();
          return setD(false);
        })
        .catch(() => {
          callFnOnce.current.reset();
          return setD(false);
        });
    }
  };
  const { children, color, autoFocus, variant, disabled, style } = props;

  return (
    <Button onClick={handler} disabled={d || disabled} color={color} variant={variant} autoFocus={autoFocus} style={style}>
      {children}
    </Button>
  );
});

export { SafeButton };
