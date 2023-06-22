import { DemonstrateRequest } from "./../../models/DemonstrateRequest";
import { sortSubmitters } from "./../../utils/functions/sortSubmitters";
import { DemonstrateTableData } from "./demonstrateTable/DemonstrateTableStudent";

function createDemonstrateTableRow(
  dataRow: DemonstrateRequest
): DemonstrateTableData {
  const d = new Date(dataRow.requestTime);
  return {
    id: dataRow.id,
    submitters: dataRow.submitters.sort(sortSubmitters),
    examiner: dataRow.examiner,
    achievements: dataRow.achievements,
    time: d.toLocaleString("sv-SE"),
    zoomRoom: dataRow.zoomRoom,
    zoomPassword: dataRow.zoomPassword,
    physicalRoom: dataRow.physicalRoom
  };
}

export function processDemonstrateRequests(
  response: DemonstrateRequest[]
): DemonstrateTableData[] {
  const demonstrateTableData: DemonstrateTableData[] = [];
  response.forEach((request) =>
    demonstrateTableData.push(createDemonstrateTableRow(request))
  );
  demonstrateTableData.sort((a, b) => {
    return (new Date(a.time) as any) - (new Date(b.time) as any);
  });
  return demonstrateTableData;
}
