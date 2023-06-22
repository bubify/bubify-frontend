import React from "react";
import { makeTimeRelative } from "../../utils/functions/makeTimeRelative";

interface Props {
  date: string;
}

const PassedTime = (props: Props) => {
  const [time, setTimeRender] = React.useState(makeTimeRelative(props.date));

  React.useEffect(() => {
    const refreshInterval = setInterval(() => {
      setTimeRender(() => {
        return makeTimeRelative(props.date);
      });
    }, 1000 * 60);
    return () => clearInterval(refreshInterval);
  });
  return <span> {time} </span>;
};

export default PassedTime;
