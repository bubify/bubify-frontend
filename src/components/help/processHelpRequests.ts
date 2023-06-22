import { HelpRequest } from "../../models/HelpRequest";
import { User } from "../../models/User";
import { sortSubmitters } from "./../../utils/functions/sortSubmitters";

function createHelpTableRow(dataRow: HelpRequest): HelpTableData {
  return {
    id: dataRow.id,
    submitters: dataRow.submitters.sort(sortSubmitters),
    helper: dataRow.helper,
    requestTime: new Date(dataRow.requestTime).toLocaleString("sv-SE"),
    pickupTime: dataRow.pickupTime
      ? new Date(dataRow.pickupTime).toLocaleString("sv-SE")
      : null,
    reportTime: dataRow.reportTime
      ? new Date(dataRow.reportTime).toLocaleString("sv-SE")
      : null,
    message: dataRow.message ? dataRow.message : "",
    status: dataRow.status,
    zoomRoom: dataRow.zoomRoom,
    zoomPassword: dataRow.zoomPassword,
    physicalRoom: dataRow.physicalRoom
  };
}

export function processHelpRequests(response: HelpRequest[]): HelpTableData[] {
  const helpTableData: HelpTableData[] = [];
  response.forEach((request) =>
    helpTableData.push(createHelpTableRow(request))
  );
  return helpTableData;
}

export interface HelpTableData {
  id: string;
  submitters: User[];
  requestTime: string;
  pickupTime: string | null;
  reportTime: string | null;
  helper: User | null;
  message: string;
  status: string;
  zoomRoom: string | null;
  zoomPassword: string | null;
  physicalRoom: string | null;
}
