import * as React from "react";
import { EContextValue as InjectedProps, UserConsumer } from "./UserContext";

// Props the HOC adds to the wrapped component
export type EInjectedProps = InjectedProps;

export const withUser = () => <TOriginalProps extends {}>(
  Component:
    | React.ComponentClass<TOriginalProps & InjectedProps>
    | React.FunctionComponent<TOriginalProps & InjectedProps>
) => {
  // Do something with the options here or some side effects
  type ResultProps = TOriginalProps;
  const result = class WithUser extends React.Component<ResultProps> {
    // Define how your HOC is shown in ReactDevTools
    //public static displayName = wrapDisplayName(Component, "withUser");
    //Component.displayName = "withUser";
    // Implement other methods here

    public render(): JSX.Element {
      // Render all your added markup
      return (
        <UserConsumer>
          {(value) => <Component {...this.props} {...value} />}
        </UserConsumer>
      );
    }
  };

  return result;
};
export default withUser;
