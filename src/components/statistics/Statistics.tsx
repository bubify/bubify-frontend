import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { withTranslation } from "react-i18next";
import AchievementExplorer from "../achievementExplorer";
import EditUser from "../editUser";

interface TabValue {
  title: string,
  value: number
}

function Statistics() {
  const options = [{
    title: "Achievement Explorer",
    value: 0
  },
  // {
  //   title: "Aggregated Burndown Chart",
  //   value: 1
  // }
];

  const [tab, setTab] = React.useState<TabValue>(options[0]);

  return (
    <>
      <Autocomplete
      value={tab}
      id="combo-box-statistics"
      options={options}
      getOptionLabel={(option) => option.title}
      getOptionSelected={(option, value) => option.value === value.value}
      disableClearable
      fullWidth
      onChange={(event: any, newValue: TabValue | null) => {
        if(!newValue) return;
        setTab(newValue);
      }}
      renderInput={(params) => <TextField {...params} label="Statistics" variant="outlined" />}
      />
      { tab.value === 0 ? <AchievementExplorer /> : null}
      { tab.value === 1 ? <EditUser /> : null}
    </>
  )
}

export default withTranslation()(Statistics);
