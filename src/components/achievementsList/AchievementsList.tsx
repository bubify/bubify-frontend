import { Chip, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import { mapTargetGradeEnumToNumber } from "../../utils/functions/mapTargetGradeEnumToNumber";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

const FormStyle = {
  margin: "10px",
};

interface Props {
  limit?: number;
  label: string;
  achievementsRemaining: AchievementsResponse[] | null;
  selectedAchievements: AchievementsResponse[];
  handleChange: (event: any, values: AchievementsResponse[]) => void;
}

function getLabelLong(option: AchievementsResponse) {
  return (
    "(" +
    mapTargetGradeEnumToNumber(option.level) +
    ") " +
    option.code +
    " - " +
    option.name
  );
}

function getLabelShort(option: AchievementsResponse) {
  return "(" + mapTargetGradeEnumToNumber(option.level) + ") " + option.code;
}

function AchievementsList(props: Props & EContextValue) {
  const { limit } = props;
  return (
    <Autocomplete
      value={props.selectedAchievements}
      style={FormStyle}
      multiple
      autoHighlight
      filterSelectedOptions
      id="tags-standard"
      onChange={props.handleChange}
      options={props.achievementsRemaining ? props.achievementsRemaining : []}
      getOptionSelected={(option, value) => {
        return option.id.toString() === value.id.toString();
      }}
      getOptionLabel={(option) => getLabelLong(option)}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label={props.label} />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const exceededLimitStyle =
            limit && index >= limit ? { background: "#FF8585" } : {};
          return (
            <Chip
              style={exceededLimitStyle}
              disabled={false}
              label={getLabelShort(option)}
              {...getTagProps({ index })}
            />
          );
        })
      }
    />
  );
}

export default withUser()(AchievementsList);
