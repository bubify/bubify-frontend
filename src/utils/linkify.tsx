import React from "react";
import Linkify from "react-linkify";

interface Props {
  children: any;
}

const LinkifyText = (props: Props) => {
  return (
    <Linkify
      componentDecorator={(decoratedHref, decoratedText, key) => (
        <a target="_blank" href={decoratedHref} key={key} rel="noopener noreferrer" >
          {decoratedText}
        </a>
      )}
    >
      {props.children}
    </Linkify>
  );
};

export default LinkifyText;
