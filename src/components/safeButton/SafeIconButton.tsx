import { IconButton } from "@material-ui/core";
import React from "react";
import { callOnce } from "../../utils/callOnce";

interface Props {
  onClick: any;
  children: JSX.Element;
}

const SafeIconButton = React.forwardRef((props: Props, ref) => {
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
  const { children } = props;

  return (
    <IconButton onClick={handler} disabled={d}>
      {children}
    </IconButton>
  );
});

export { SafeIconButton };
