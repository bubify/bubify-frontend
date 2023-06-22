import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { AchievementExploreResponse } from "../../models/AchievementExploreResponse";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import axios from "../../utils/axios";
import AchievementsList from "../achievementsList";
import AchievementsExplorerTable from "./AchievementsExplorerTable";

interface Props { }

interface State {
  achievementsList: AchievementsResponse[] | undefined;
  selectedAchievements: AchievementsResponse[];
  data: AchievementExploreResponse | undefined;
}

class AchievementExplorer extends React.Component<
  Props & WithTranslation,
  State
  > {
  public state = {
    achievementsList: undefined as AchievementsResponse[] | undefined,
    selectedAchievements: [] as AchievementsResponse[],
    data: undefined as AchievementExploreResponse | undefined,
  };

  async componentDidMount() {
    const achievements: AxiosResponse<AchievementsResponse[]> = await axios.get(
      "/achievements"
    );
    this.setState({ achievementsList: achievements.data });
  }

  private handleAchievementChange = (
    event: any,
    values: AchievementsResponse[]
  ) => {
    if (values.length === 0) {
      this.setState({
        data: undefined,
      });
    }
    if (this.state.selectedAchievements.length > 0 && values.length > 0) return;
    this.setState(
      {
        selectedAchievements: values,
      },
      this.getAchievementData
    );
  };

  private getAchievementData = async () => {
    try {
      const response: AxiosResponse<AchievementExploreResponse> = await axios.get(
        "/explore/achievement/" + this.state.selectedAchievements[0].id
      );
      this.setState({
        data: response.data,
      });
    } catch (e) { }
  };

  render() {
    const loading = !this.state.achievementsList;

    return (
      <div>
        {loading ? (
          <p></p>
        ) : (
            <>
              <AchievementsList
                label={this.props.t("AchievementExplorer.selectAchievements")}
                achievementsRemaining={
                  this.state.achievementsList as AchievementsResponse[]
                }
                selectedAchievements={this.state.selectedAchievements}
                handleChange={this.handleAchievementChange}
              />
              {!this.state.data ? null : (
                <AchievementsExplorerTable data={this.state.data} />
              )}
            </>
          )}
      </div>
    );
  }
}

export default withTranslation()(AchievementExplorer);
