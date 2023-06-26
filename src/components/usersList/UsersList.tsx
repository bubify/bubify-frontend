import { Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../models/User";

const FormStyle = {
  margin: "10px",
};

interface Props {
  users: User[] | undefined;
  selectedUsers: User[];
  handleChange: (event: any, values: User[]) => void;
  disabledId?: string | undefined;
  label?: String;
  clearable?: boolean;
}

function UsersList(props: Props) {
  const { t } = useTranslation();
  const loading: boolean = props.users === undefined;

  return (
    <>
      {loading ? (
        <p></p>
      ) : (
          <Autocomplete
            value={props.selectedUsers}
            style={FormStyle}
            multiple
            autoHighlight
            disableClearable={props.clearable ? !props.clearable :true}
            id="tags-standard"
            onChange={props.handleChange}
            options={props.users as User[]}
            getOptionSelected={(option, value) => {
              return option.id.toString() === value.id.toString();
            }}
            getOptionLabel={(user) => user.firstName + " " + user.lastName}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={props.label ? props.label : t("UsersList.select") as string}
              />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.firstName + " " + option.lastName}
                  {...getTagProps({ index })}
                  disabled={
                    props.disabledId !== undefined &&
                    props.disabledId.toString() === option.id.toString()
                  }
                />
              ))
            }
          />
        )}
    </>
  );
}

export default UsersList;
