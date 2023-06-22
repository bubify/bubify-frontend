import { MenuItem, Select, Typography } from "@material-ui/core";
import React from "react";

interface Props {
  selectedTargetGrade: number;
  targetGradeOnClick: (event: any) => void;
  disableTargetGradeChange?: boolean;
  className?: string;
}

const SelectGrade = (props: Props) => {
  const { selectedTargetGrade, targetGradeOnClick } = props;
  return (
    <Select value={selectedTargetGrade} onChange={targetGradeOnClick} disabled={props.disableTargetGradeChange}>
      <MenuItem value={5}>
        <Typography variant="h2" className={props.className}>5</Typography>
      </MenuItem>
      <MenuItem value={4}>
        <Typography variant="h2" className={props.className}>4</Typography>
      </MenuItem>
      <MenuItem value={3}>
        <Typography variant="h2" className={props.className}>3</Typography>
      </MenuItem>
    </Select>
  );
};

export default SelectGrade;
